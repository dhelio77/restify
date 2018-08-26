const _ = require('lodash');

function Foo() {
  this.a = 1;
}
 
function Bar() {
  this.c = 3;
}
 
Foo.prototype.b = 2;
Bar.prototype.d = 4;
 
console.log(_.assignIn({ 'a': 0 }, new Foo, new Bar, {'e': 5}));