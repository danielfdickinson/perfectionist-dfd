import ava from 'ava';
import { createRequire } from 'module';
import semver from 'semver';
import pluginNewNode from '../src/index.mjs';

const requireShim = createRequire(import.meta.url);
const pluginOldNode = requireShim('..');

var plugin;

if (semver.gt(process.version, 'v16.0.0')) {
    plugin = pluginNewNode;
} else {
    plugin = pluginOldNode;
}

function perfectionistDFD (css, options) {
    return plugin.process(css, options).css;
}

let tests = [{
    message: 'configurable indent size',
    fixture: 'h1{color:black}',
    expected: 'h1 {\n  color: black;\n}\n',
    options: {indentSize: 2},
}, {
    message: 'configurable indent type',
    fixture: 'h1{color:black}',
    expected: 'h1 {\n	color: black;\n}\n',
    options: {indentChar: '\t', indentSize: 1},
}, {
    message: 'disable the cascade',
    fixture: 'h1{-webkit-border-radius: 12px; border-radius: 12px; }',
    expected: 'h1 {\n    -webkit-border-radius: 12px;\n    border-radius: 12px;\n}\n',
    options: {cascade: false},
}, {
    message: 'convert hex colours to uppercase',
    fixture: 'h1{color:#fff}',
    expected: 'h1 {\n    color: #FFF;\n}\n',
    options: {colorCase: 'upper'},
}, {
    message: 'expand shorthand hex',
    fixture: 'h1{color:#fff}',
    expected: 'h1 {\n    color: #ffffff;\n}\n',
    options: {colorShorthand: false},
}, {
    message: 'expand shorthand hex (2)',
    fixture: 'h1{color:#ffffff}',
    expected: 'h1 {\n    color: #ffffff;\n}\n',
    options: {colorShorthand: false},
}, {
    message: 'do not remove units from zero lengths',
    fixture: 'h1{width:0px}',
    expected: 'h1 {\n    width: 0px;\n}\n',
    options: {zeroLengthNoUnit: false},
}, {
    message: 'add leading zeroes',
    fixture: 'h1{width:.5px}',
    expected: 'h1 {\n    width: 0.5px;\n}\n',
    options: {trimLeadingZero: false},
}, {
    message: 'do not trim trailing zeroes',
    fixture: 'h1{width:10.000px}',
    expected: 'h1 {\n    width: 10.000px;\n}\n',
    options: {trimTrailingZeros: false},
}];

let mapTests = [{
    message: 'expand css',
    fixture: 'h1{color:black}',
    options: {map: true},
}, {
    message: 'expand css (2)',
    fixture: 'h1{color:black}',
    options: {map: false, sourcemap: true},
}];

Object.keys(tests).forEach(key => {
    ava(`fixture: ${tests[key]['message']}`, t => {
        t.deepEqual(perfectionistDFD(tests[key]['fixture'], tests[key]['options'] || {}), tests[key]['expected'],
            'should output the expected result');
    });

});

Object.keys(mapTests).forEach(key => {
    ava(`fixture: ${mapTests[key]['message']}`, t => {
        const hasMap = /sourceMappingURL=data:application\/json;base64/.test(perfectionistDFD(mapTests[key]['fixture'], mapTests[key]['options'] || {}));
        t.truthy(hasMap, mapTests[key]['message']);
    });
});
