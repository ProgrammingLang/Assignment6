// LC.interpret will invoke the lambda-calculus interpreter
// on a string containing a lambda-calclus expression
var LC = require("./lambdacalculus.js");

////// Next we define some Church encodings you can use in the assignment 

// Logical values
var T = "^x y.x";
var F = "^x y.y";
var AND = "^a b.((a b) "+F+")";
var IF = "^p x y.((p x) y)";
var OR = "^p q.((("+IF+" p) "+T+") q)"; 


// Integer values

var ZERO = "^f x.x";
var ONE = "^f x.(f x)";
var TWO = "^f x.(f (f x))";
var THREE = "^f x.(f (f (f x)))";
var FOUR = "^f x.(f (f (f (f x))))";
var FIVE = "^f x.(f (f (f (f (f x)))))";
var SIX = "^f x.(f (f (f (f (f (f x))))))";
var SEVEN = "^f x.(f (f (f (f (f (f (f x)))))))";
var EIGHT = "^f x.(f (f (f (f (f (f (f (f x))))))))";
var NINE = "^f x.(f (f (f (f (f (f (f (f (f x)))))))))";
var ADD = "^n m f x.((n f) ((m f) x))";
var MULT = "^n m f x.((n (m f)) x)";

// Successor, predecessor, and IsZero
var SUCC = "^n f x.(f ((n f) x))";
var ISZERO = "^n.((n ^x."+F+") "+T+")";
var PRED = "^n.^f.^x.(((n ^g.^h.(h (g f))) ^u.x) ^u.u)";


// And of course, the Y combinator!
var Y = "^h.(^x.(h (x x)) ^x.(h (x x)))";

// Demos of how to use the encodings and Y to define factorial,
// subtraction x - y (only allowed when x >= y since we don't encode
// negative integers), and the less-than-or-equal-to comparison.  You
// may need subtraction and less-than-or-equal-to for Probelm 1.

// Factorial
var FACT = "^f x.((("+IF+" ("+ISZERO+" x)) "+ONE+") (("+MULT+" x) (f ("+PRED+" x))))";
var Y_FACT = "("+Y+" "+FACT+")";

// Subtraction
var SUBREC = "^f x y.((("+IF+" ("+ISZERO+" y)) x) ((f ("+PRED+" x)) ("+PRED+" y)))";
var Y_SUB = "("+Y+" "+SUBREC+")";

// Less than or equal to
var LE = "^le x y.((("+IF+" ("+ISZERO+" x)) "+T+") ((("+IF+" ("+ISZERO+" y)) "+F+") ((le ("+PRED+" x)) ("+PRED+" y))))";
var Y_LE = "("+Y+" "+LE+")";

// Problem 1 -- implementing the remainder (modulo) operation

//returning 0
var REMAINDER = "^f x y.((("+IF+" ("+ISZERO+" x)) "+ZERO+") ((("+IF+" (("+Y_LE+" y) x)) ((f (("+Y_SUB+" x) y)) y)) x))";
// Uncomment the next line after you have implemented REMAINDER for Y

var Y_REM = "("+Y+" "+REMAINDER+")";

// Problem 2 -- Encoding lists in the lambda calculus
 var CONS = "^h t s.((s h) t)";
 var HD = "^l.(l "+T+")";
 var TL = "^l.(l "+F+")";
 var ISEMPTY = "^l.(l ^h t."+F+")";
 var NIL = "^x."+T;

// Uncomment the next three lines after you have implemented list operations
 var LISTA = "((" + CONS + " a) " + NIL + ")";
 var LISTBA = "((" + CONS + " b) " + LISTA + ")";
 var LISTCBA = "((" + CONS + " c) " + LISTBA + ")";

// Problem 3 -- Recursive function for the length of a list

 var LENGTH = "^f y.((("+IF+" ("+ISEMPTY+" y)) "+ZERO+") ("+SUCC+" (f ("+TL+" y))))";
// Uncomment the next line after you have implemented LENGTH for Y
 var Y_LENGTH = "("+Y+" "+LENGTH+")";

// Problem 4 -- Recursive function for the sum of the values in a list of numbers

 var SUM = "^f x.((("+IF+" ("+ISEMPTY+" x)) "+ZERO+") (("+ADD+" ("+HD+" x)) (f ("+TL+" x))))";
 
// Uncomment the next line after you have implemented SUM for Y
 var Y_SUM = "("+Y+" "+SUM+")";

// Uncomment the next three lines after you have implemented the a recursive sum func
 var LIST1 = "((" + CONS + " " + ONE +") " + NIL + ")";
 var LIST31 = "((" + CONS + " " +THREE +") " + LIST1 + ")";
 var LIST531 = "((" + CONS + " " + FIVE +") " + LIST31 + ")";

 var LISTa = "((" + CONS + " " + ZERO +") " + NIL + ")";
 var LISTaa = "((" + CONS + " " +ZERO +") " + LISTa + ")";
 var LISTaaa = "((" + CONS + " " + ZERO +") " + LISTaa + ")";


// Problem 5 -- Using Matt Might's Y combinator in JS to recursively define exponentiation

// Matt Might's JS implementation of Y
var Y_in_JS = function (h) {
    return (function (x) {
	return h(function (y) { return (x(x))(y);});
    })
    (function (x) {
	return h(function (y) { return (x(x))(y);});
    }) ;
} ;

// The example discussed in class notes
var FactGen = function (fact) {
    return (function(n) {
	return ((n == 0) ? 1 : (n*fact(n-1))) ;
    });
} ;

// Implement the function that Y_in_JS can use to create a recursive
// exponential function for a^n where n is a non-negative integer

 var EXP_gen = function(exp) {
    return(function(n) {
      return (function(x) {
        return ((x==0) ? 1 : (n*exp(n)(x-1)));
      });
    });
  };

///////////////////////////////////////////////////////////////////
//// All test cases you add must be below this comment.  Everything
//// below this line will be stripped away to accomodate our more
//// extensive set of test cases when your submission is evaluated

// Runs of the demos that I've provided
console.log("\n\nOutput from my samples of recursive functions");
console.log("Factorial of 3 " + LC.interpret("("+ Y_FACT + " " +THREE+")"));
console.log("Subtract 3 from 5: " + LC.interpret("(("+Y_SUB+" "+FIVE+") "+THREE+")"));
console.log("5 <= 3 " + LC.interpret("(("+Y_LE+" "+FIVE+") "+THREE+")"));
console.log("3 <= 5 " + LC.interpret("(("+Y_LE+" "+THREE+") "+FIVE+")"));
console.log("3 <= 3 " + LC.interpret("(("+Y_LE+" "+THREE+") "+THREE+")"));

//Testing Problem 1

console.log("\n\nOutput from Problem 1 tests");
console.log("Mod 0 by 4 " + LC.interpret("(("+Y_REM+" "+ZERO+") "+FOUR+")"));
console.log("Mod 2 by 3 " + LC.interpret("(("+Y_REM+" "+TWO+") "+THREE+")"));
console.log("Mod 3 by 2 " + LC.interpret("(("+Y_REM+" "+THREE+") "+TWO+")"));
console.log("Mod 2 by 4 " + LC.interpret("(("+Y_REM+" "+TWO+") "+FOUR+")"));
console.log("Mod 4 by 2 " + LC.interpret("(("+Y_REM+" "+FOUR+") "+TWO+")"));
console.log("Mod 5 by 3 " + LC.interpret("(("+Y_REM+" "+FIVE+") "+THREE+")"));
console.log("Mod 3 by 5 " + LC.interpret("(("+Y_REM+" "+THREE+") "+FIVE+")"));
console.log("Mod 4 by 1 " + LC.interpret("(("+Y_REM+" "+FOUR+") "+ONE+")"));
console.log("Mod 1 by 4 " + LC.interpret("(("+Y_REM+" "+ONE+") "+FOUR+")"));

// Testing Problem 2

console.log("\n\nOutput from Problem 2 tests");
 console.log("Testing HD on LISTA " + LC.interpret("(" + HD + " " + LISTA + ")"));
 console.log("Testing HD on LISTBA " + LC.interpret("(" + HD + " " + LISTBA + ")"));
 console.log("Testing HD on LISTCBA " + LC.interpret("(" + HD + " " + LISTCBA + ")"));
 console.log("Testing ISEMPTY on NIL " + LC.interpret("("+ ISEMPTY + " " + NIL +")"));
 console.log("Testing ISEMPTY on TL of one-element list " + LC.interpret("("+ ISEMPTY + " (" + TL + " " + LISTA + "))"));
 console.log("Testing ISEMPTY on non-empty TL " + LC.interpret("("+ ISEMPTY + " (" + TL + " " + LISTBA + "))"));
 console.log("Testing HD of the TL on LISTCBA " + LC.interpret("("+ HD + " (" + TL + " " + LISTCBA + "))"));
 console.log("Testing HD of the TL of the TL on LISTCBA " + LC.interpret("("+ HD + " (" + TL + " (" + TL + " " + LISTCBA + ")))"));
 console.log("Testing HD of the TL on LISTA " + LC.interpret("("+ HD + " (" + TL + " " + LISTA + "))"));
 console.log("Testing TL of the TL on LISTA " + LC.interpret("("+ TL + " (" + TL + " " + LISTA + "))"));

// Testing Problem 3

console.log("\n\nOutput from Problem 3 tests");
 console.log("Length of list with no elements " + LC.interpret("("+Y_LENGTH+" "+NIL+")"));
 console.log("Length of list with one elements " + LC.interpret("("+Y_LENGTH+" "+LISTA+")"));
 console.log("Length of list with two elements " + LC.interpret("("+Y_LENGTH+" "+LISTBA+")"));
 console.log("Length of list with three elements " + LC.interpret("("+Y_LENGTH+" "+LISTCBA+")"));

// Testing Problem 4
console.log("\n\nOutput from Problem 4 tests");
 console.log("Sum of list with 5, 3, 1 " + LC.interpret("("+Y_SUM+" "+LIST531+")"));
 console.log("Sum of list with 0s " + LC.interpret("("+Y_SUM+" "+LISTaaa+")"));

//Testing Problem 5

console.log("\n\nUsing Might's Y to define factorial and invoking it on 6 yields " + (Y_in_JS(FactGen))(6));
console.log("\n\nOutput from Problem 5 tests");
 console.log("4 ^ 3 is " + ((Y_in_JS(EXP_gen))(4))(3)) ;
 console.log("3 ^ 4 is " + ((Y_in_JS(EXP_gen))(3))(4)) ;
console.log("4 ^ 0 is " + ((Y_in_JS(EXP_gen))(4))(0)) ;

