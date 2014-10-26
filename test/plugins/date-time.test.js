var Event = new (require('events')).EventEmitter();

var plugin = require('../../app/plugins/date-time')(
  {},
  {Event: Event},
  function() {}
);

var should = require('should');

suite("plugins:date-time", function() {
  test("what time is it", function(done) {
    var command = 'what',
        message = 'time is it';

    Event.emit(
      'what',
      function(answer) {
        answer.should.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(am|pm)$/);
        done();
      },
      message
    );
  });

  test("what time is it?", function(done) {
    var command = 'what',
        message = 'time is it?';

    Event.emit(
      'what',
      function(answer) {
        answer.should.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(am|pm)$/);
        done();
      },
      message
    );
  });

  test("specified city with continent (Europe/Budapest)", function(done) {
    var command = 'what',
        message = 'time is it in Europe/Budapest';

    Event.emit(
      'what',
      function(answer) {
        answer.should.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(am|pm)$/);
        done();
      },
      message
    );
  });

  test("specified city with space in name (America/New York)", function(done) {
    var command = 'what',
        message = 'time is it in America/New York';

    Event.emit(
      'what',
      function(answer) {
        answer.should.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(am|pm)$/);
        done();
      },
      message
    );
  });

  test("specified city without continent (London)", function(done) {
    var command = 'what',
        message = 'time is it in London';

    Event.emit(
      'what',
      function(answer) {
        answer.should.equal('Please give me the continent too like Europe/Budapest or America/New York.');
        done();
      },
      message
    );
  });

  test("specified city without continent but with space in name (New York)", function(done) {
    var command = 'what',
        message = 'time is it in New York';

    Event.emit(
      'what',
      function(answer) {
        answer.should.equal('Please give me the continent too like Europe/Budapest or America/New York.');
        done();
      },
      message
    );
  });
});
