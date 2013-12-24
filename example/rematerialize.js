var parse = require('../');
var concat = require('concat-stream');

process.stdin.pipe(concat(function (body) {
    console.log(parse(body));
}));
