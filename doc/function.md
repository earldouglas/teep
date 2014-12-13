# Global





* * *

### curry(f) 

Curries a function

*Example:*

    function add(x, y) {
      return x + y;
    };

    var add2 = curry(add)(2);
    var five = add2(3);

*Example:*

    function mathemagic(x, y, z) {
      return x * (y + z);
    };

    var fortyTwo = curry(mathemagic)(2)(20)(1);

**Parameters**

**f**: , An n-ary function to curry

**Returns**: , Nested unary functions with depth of `f`'s arity



* * *










