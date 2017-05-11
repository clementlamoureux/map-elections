import test from 'ava';
import * as _global from '../map-elections'

test('File implements InitMap for Google callback', t => {
    console.log(_global.MapElections.InitMap);
    t.truthy(_global.MapElections.InitMap && typeof _global.MapElections.InitMap === 'function');
});