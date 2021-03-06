[![Build Status](https://travis-ci.org/Yitsushi/Hyppolit.svg?branch=master)](https://travis-ci.org/Yitsushi/Hyppolit) [![Dependency Status](https://gemnasium.com/Yitsushi/Hyppolit.svg)](https://gemnasium.com/Yitsushi/Hyppolit)

Hyppolit, the Butler is a bot to connect your services and to does what you want.
He is your personal, team or company butler.

The name comes from a [movie with the same name from my country](http://www.imdb.com/title/tt0021985/) from 1931. It's because
I wrote a lot of bots before but now it is not only a bot but an awesome support,
a real butler.

## How to use?

    $ git clone https://github.com/Yitsushi/Hyppolit.git
    $ cd Hyppolit
    $ npm install
    $ cp config.json.example config.json

    ## Edit your config.json

    $ node index.js

## Available plugins

### date-time

 - what time is it
 - what time is it in Europe/Budapest
 - what time is it in America/New York


##### Configuration:

```
{ "name": "date-time" }
```

### hipchat

Hyppolit connects to your HipChat instance and wait for your questions. If
you invite him into a channel then he will join immediately. Your can ask him
in public or in private too.

##### Configuration:

```
{
  "name": "hipchat",
  "configuration": {
    "hostname": "xxxxx.hipchat.com",
    "jid": "xxxxxxx",
    "password": "xxxxxx",
    "autojoin": ["xxxxxxxxx", "xxxxxxx"]
  }
}
```

### weather

 - what is the weather
 - what's the weather
 - what is the weather in London
 - what's the weather in London

##### Configuration:

```
{ "name": "weather" }
```


### docker

 - docker list containers
 - docker list running containers
 - docker list stopped containers
 - docker list all containers

##### Configuration:

With host and port:

```
{
  "name": "docker",
  "configuration": {
    "type": "host",
    "address": "tcp://192.168.59.103:2375"
  }
}
```

Or with socket:

```
{
  "name": "docker",
  "configuration": {
    "type": "socket",
    "address": "/var/run/docker.sock"
  }
}
```

## API? Documentation?

Soon. :)

## Authors and Contributors

 - Balazs Nadasdi (@yitsushi)
