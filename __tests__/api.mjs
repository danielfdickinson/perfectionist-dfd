import postcss from 'postcss';
import ava from 'ava';
import { createRequire } from 'module';
import perfectionistDFD from '../src/index.mjs';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

function usage (t, instance) {
    const input = 'h1 { color: #fff }';
    return instance.process(input).then(({css}) => {
        t.deepEqual(css, 'h1 {\n    color: #fff;\n}\n', 'should be consumed');
    });
}

ava('can be used as a postcss plugin', usage, postcss().use(perfectionistDFD()));
ava('can be used as a postcss plugin (2)', usage, postcss([ perfectionistDFD() ]));
ava('can be used as a postcss plugin (3)', usage, postcss([ perfectionistDFD ]));

ava('should use the postcss plugin api', t => {
    t.truthy(perfectionistDFD().postcssVersion, 'should be able to access version');
    t.deepEqual(perfectionistDFD().postcssPlugin, pkg.name, 'should be able to access name');
});