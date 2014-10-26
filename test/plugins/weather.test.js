var Event = new (require('events')).EventEmitter();

var plugin = require('../../app/plugins/weather')(
  {},
  {Event: Event},
  function() {}
);

var should = require('should');

suite("plugins:weather", function() {
  test("what is the weather", function(done) {
    var command = 'what',
        message = 'is the weather';

    Event.emit(
      'what',
      function(answer) {
        answer.should.match(/Now in Budapest \(HU\)/);
        answer.should.match(/Temperature: [\d]{1,2}°C/);
        done();
      },
      message
    );
  });

  test("what's the weather", function(done) {
    var command = "what's",
        message = 'the weather';

    Event.emit(
      'what',
      function(answer) {
        answer.should.match(/Now in Budapest \(HU\)/);
        answer.should.match(/Temperature: [\d]{1,2}°C/);
        done();
      },
      message
    );
  });

  test("with specified city", function(done) {
    var command = 'what',
        message = 'is the weather in London';

    Event.emit(
      'what',
      function(answer) {
        answer.should.match(/Now in London \(GB\)/);
        answer.should.match(/Temperature: [\d]{1,2}°C/);
        done();
      },
      message
    );
  });

  test("unknown city", function(done) {
    var command = "what",
        message = 'is the weather in Errorish';

    Event.emit(
      'what',
      function(answer) {
        answer.should.match(/^Sorry, but I don't know where is Errorish\.$/);
        done();
      },
      message
    );
  });
});
