var test = require('tape');
var unpack = require('../');
var pack = require('browser-pack');
var concat = require('concat-stream');
var vm = require('vm');

var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/uglified.js', 'utf8');

test('uglified', function (t) {
    t.plan(4);
    t.doesNotThrow(function() {
        var p = pack({ raw: true });
        var rows = unpack(src);
        t.equal(rows.length, 3, 'should unpack 3 rows');
        t.ok(rows[2].hasOwnProperty('id'), 'third row should have an id property');
    }, 'should not throw');
    
    t.deepEquals(deps(src), ['./foo.js', 'gamma']);

    function deps(src) {
      var rows = unpack(src);
      return rows.reduce(function(prev, row) {
        return prev.concat(Object.keys(row.deps));
      }, []);
    }
});
