'use strict';

Tinytest.add('proj4 load', function (test) {
  test.equal(proj4.defs('WGS84')['title'], "WGS 84 (long/lat)", {message: 'defs should load'});
});