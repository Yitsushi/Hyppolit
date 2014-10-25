var should = require('should');

suite("general:calculator", function() {
  test("3 + 8 = 11", function(done) {
    var a = 3, b = 8, c;

    c = a + b;
    c.should.equal(11);
    done();
  });

  test("3 * 8 = 24", function(done) {
    var a = 3, b = 8, c;

    c = a * b;
    c.should.equal(24);
    done();
  });

  test("3 - 8 = -5", function(done) {
    var a = 3, b = 8, c;

    c = a - b;
    c.should.equal(-5);
    done();
  });
});
