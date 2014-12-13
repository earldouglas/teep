# Global





* * *

### collect(promises, callback) 

Given an array of promises and a callback, passes the result of each promise
(in order) as an argument to the callback, and returns a single promise that
yields the result of the callback.

Any of the promises can be 'lazy', implemented as a nullary function that 
returns a promise, and will be retrieved as late as possible.

*Example:*

    var p = collect([
        Promise.resolve(2),
        Promise.resolve(20),
        Promise.resolve(1)
    ], function (x, y, z) {
        return x * (y + z);
    });

p is congruent to Promise.resolve(2 * (20 + 1)), or Promise.resolve(42)

**Parameters**

**promises**: , An array of Promise instances or Promise-returning functions

**callback**: , A function that takes as arguments the results of the promises




* * *










