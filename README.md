[wumbo](https://github.com/shrimpboyho/wumbo/) - A Simple Math Expression Parser
==============================================

##What is it?

![image](http://static.fjcdn.com/pictures/Wumbo_1a4a2c_1459092.jpg)

```wumbo``` is a library that parses mathematical expressions in the form of strings. It has support for the following operators:
```
+ // Addition
- // Subtraction
* // Multiplication
/ // Division
^ // Exponentiation
```
```wumbo``` currently has a JavaScript version, and it is soon going to be ported over to C and C++. To get involved, open an issue or make a fork.

##How to Install

Include the library in your HTML as follows:

```html

<script src="wumbo.js"></script>
<script src="your_code.js"></script>
```

##How to Use

Create a ```Wumbo()``` object:

```js

var patrick = new Wumbo(); // Create the wumbotron
```

Call the ```.parse()``` method with an expression in a string:

```js

var answer = patrick.parse('5 * ( 2 + 3 )');
console.log(answer);

// Output: 25
```


