#!/usr/bin/env node

var parse = require('../');
var concat = require('concat-stream');

process.stdin.pipe(concat(function (body) {
    var rows = parse(body);
    console.log('[');
    rows.forEach(function (row, index) {
        if (index > 0) console.log(',');
        console.log(JSON.stringify(row));
    });
    console.log(']');
}));
