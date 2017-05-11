"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var sinon = require("sinon");
var _global = require("../map-elections");
ava_1.default('File implements InitMap for Google callback', function (t) {
    console.log(_global.MapElections.InitMap);
    t.truthy(_global.MapElections.InitMap && typeof _global.MapElections.InitMap === 'function');
});
ava_1.default('File implements InitMap for Google callback', function (t) {
    var xhr = sinon.useFakeXMLHttpRequest();
    var map = new _global.MapElections.InitMap();
    console.log(map);
});
