var parse = require('esprima').parse;

module.exports = function (src) {
    var ast = parse(src, { range: true });
    if (ast.body.length !== 1) return;
    if (ast.body[0].type !== 'ExpressionStatement') return;
    if (ast.body[0].expression.type === 'UnaryExpression') {
        var body = ast.body[0].expression.argument;
    } else {
        var body = ast.body[0].expression;
    }

    if (body.type !== 'CallExpression') return;

    var args = body.arguments;
    if (args.length !== 3) return;
    
    if (args[0].type !== 'ObjectExpression') return;
    if (args[1].type !== 'ObjectExpression') return;
    if (args[2].type !== 'ArrayExpression') return;
    
    var files = args[0].properties;
    var cache = args[1];
    var entries = args[2].elements.map(function (e) {
        return e.value
    });
    
    return files.map(function (file) {
        var body = file.value.elements[0].body.body;
        var start, end;
        if (body.length === 0) {
            start = body.range[0];
            end = body.range[1];
        }
        else {
            start = body[0].range[0];
            end = body[body.length-1].range[1];
        }
        
        var depProps = file.value.elements[1].properties;
        var deps = depProps.reduce(function (acc, dep) {
            acc[dep.key.value] = dep.value.value;
            return acc;
        }, {});
        var row = {
            id: file.key.value,
            source: src.slice(start, end).toString('utf8'),
            deps: deps
        };
        if (entries.indexOf(row.id) >= 0) row.entry = true;
        return row;
    });
};
