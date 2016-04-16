
var assert = require('chai').assert;

// get the function make ID
//?????

describe('Log Model', function() {
  beforeEach();
  describe('Adding a log', function () {


    it('should add a log', function () {
        var id = makeID();
        assert.isNotNull(id, 'You got somthng');
    });

   it('should be a string', function () {
        var id = makeID();
        assert.typeOf('id', 'string', 'we have a string');
    });


  });
});
