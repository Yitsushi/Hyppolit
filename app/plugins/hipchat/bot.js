var xmpp = require('node-xmpp'),
    util = require('util'),
    events = require('events');

var Bot = function(options) {
  events.EventEmitter.call(this);
  options = options || {};

  this.once('connect', function() { });

  var jid = new xmpp.JID(options.jid);
  if (!jid.resource) {
    jid.resource = 'Hyppolit';
  }

  this.iq_count = 0;
  this.jabber = null;
  this.jid = jid.toString();
  this.password = options.password;
  this.host = options.host;

  this.mucHost = this.host ? "conf." + this.host : "conf.hipchat.com";
  this.ver = 'hyppolit:0.0.0';

  var self = this;
  this.on('error', function(error) {
    self.disconnect();
  });
};

util.inherits(Bot, events.EventEmitter);

Bot.prototype.connect = function() {
  this.jabber = new xmpp.Client({
    jid: this.jid,
    password: this.password,
    host: this.host
  });

  this.jabber.on('online', this.onOnline.bind(this));
  this.jabber.on('error', this.onError.bind(this));
  this.jabber.on('stanza', this.onStanza.bind(this));
};

Bot.prototype.onOnline = function() {
  var self = this;
  this.setAvailability('chat');

  this.keepalive = setInterval(function() {
    self.jabber.send(new xmpp.Message({}));
    self.emit('ping');
  }, 30000);

  this.getProfile(function(err, data) {
    if (err) {
      self.emit('error', null, 'Unable to get profile info: ' + err, null);
      return false;
    }

    self.name = data.fn;
    self.mention_name = data.nickname;
    self.emit('connect');
  });
};
Bot.prototype.onError = function(err) {
  console.log(err);
};

Bot.prototype.setAvailability = function(availability, status) {
  var packet = new xmpp.Element('presence', { type: 'available' });
  packet.c('show').t(availability);
  if (status) {
    packet.c('status').t(status);
  }
  packet.c('c', {
    xmlns: 'http://jabber.org/protocol/caps',
    node: 'http://hipchat.com/client/bot', // tell HipChat we're a bot
    ver: this.ver
  });

  this.jabber.send(packet);
};

Bot.prototype.getProfile = function(callback) {
  var stanza = new xmpp.Element('iq', { type: 'get' })
                       .c('vCard', { xmlns: 'vcard-temp' });

  this.sendIq(stanza, function(err, response) {
    var data = {};
    if (!err) {
      var fields = response.getChild('vCard').children;
      fields.forEach(function(field) {
        data[field.name.toLowerCase()] = field.getText();
      });
    }
    callback(err, data, response);
  });
};

Bot.prototype.sendIq = function(stanza, callback) {
  stanza = stanza.root();
  var id = this.iq_count++;
  stanza.attrs.id = id;
  this.once('iq:' + id, callback);
  this.jabber.send(stanza);
};


Bot.prototype.onStanza = function(stanza) {
  var body, fromJid;

  this.emit('data', stanza);
  if (stanza.is('message') && stanza.attrs.type === 'groupchat') {
    body = stanza.getChildText('body');
    if (!body) { return false; }
    if (stanza.getChild('delay')) { return false; }

    fromJid = new xmpp.JID(stanza.attrs.from);
    var fromChannel = fromJid.bare().toString();
    var fromNick = fromJid.resource;

    if (fromNick === this.name) { return false; }

    this.emit('message', fromChannel, fromNick, body);
  } else if (stanza.is('iq')) {
    var event_id = 'iq:' + stanza.attrs.id;
    if (stanza.attrs.type === 'result') {
      this.emit(event_id, null, stanza);
    } else {
      var condition = 'unknown';
      var error_elem = stanza.getChild('error');
      if (error_elem) {
        condition = error_elem.children[0].name;
      }
      this.emit(event_id, condition, stanza);
    }
  } else if (stanza.is('message') && !stanza.attrs.type) {
    var x = stanza.getChild('x', 'http://jabber.org/protocol/muc#user');
    if (!x) { return false; }
    var invite = x.getChild('invite');
    if (!invite) { return false; }
    var reason = invite.getChildText('reason');

    var inviteRoom = new xmpp.JID(stanza.attrs.from);
    var inviteSender = new xmpp.JID(invite.attrs.from);

    this.emit('invite', inviteRoom.bare(), inviteSender.bare(), reason);
  } else if (stanza.is('message') && stanza.attrs.type === 'chat') {
    body = stanza.getChildText('body');
    if (!body) { return false; }
    fromJid = new xmpp.JID(stanza.attrs.from);
    this.emit('privateMessage', fromJid.bare().toString(), body);
  }
};
Bot.prototype.join = function(roomJid, historyStanzas) {
  if (!historyStanzas) {
    historyStanzas = 0;
  }
  var packet = new xmpp.Element('presence', { to: roomJid + '/' + this.name });
  packet.c('x', { xmlns: 'http://jabber.org/protocol/muc' })
    .c('history', {
      xmlns: 'http://jabber.org/protocol/muc',
      maxstanzas: String(historyStanzas)
    });
  this.jabber.send(packet);
};
Bot.prototype.part = function(roomJid) {
  var packet = new xmpp.Element('presence', { type: 'unavailable', to: roomJid + '/' + this.name });
  packet.c('x', { xmlns: 'http://jabber.org/protocol/muc' });
  packet.c('status').t('hc-leave');
  this.jabber.send(packet);
};
Bot.prototype.send = function(targetJid, message) {
  var packet;
  var parsedJid = new xmpp.JID(targetJid);

  if (parsedJid.domain === this.mucHost) {
    packet = new xmpp.Element('message', {
      to: targetJid + '/' + this.name,
      type: 'groupchat'
    });
  } else {
    packet = new xmpp.Element('message', {
      to: targetJid,
      type: 'chat',
      from: this.jid
    });
    packet.c('inactive', { xmlns: 'http://jabber/protocol/chatstates' });
  }

  packet.c('body').t(message);
  this.jabber.send(packet);
};

Bot.prototype.getBuddyList = function(callback) {
  var iq = new xmpp.Element('iq', { type: 'get' })
    .c('query', { xmlns: 'jabber:iq:roster' });
  this.sendIq(iq, function(err, stanza) {
    var buddyList = [];
    if (!err) {
      stanza.getChild('query').getChildren('item').map(function(el) {
        buddyList.push({
          jid: el.attrs.jid,
          name: el.attrs.name,
          mention_name: el.attrs.mention_name,
        });
      });
    }
    callback(err, buddyList, stanza);
  });
};

module.exports.Bot = Bot;
