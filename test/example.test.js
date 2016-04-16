
var assert = require('chai').assert;

// get the function make ID
//?????

describe('api controllers', function() {
  describe('authToken', function () {


    it('should make an ID', function () {
        var id = makeID();
        assert.isNotNull(id, 'You got somthng');
    });
    
   it('should be a string', function () {
        var id = makeID();
        assert.typeOf('id', 'string', 'we have a string');
    });
    
       
  });
});