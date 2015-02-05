// package metadata file for Meteor.js
'use strict';

var packageName = 'proj4:proj4';  // https://atmospherejs.com/proj4/proj4

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'));

Package.describe({
  name: packageName,
  summary: 'Proj4js (official): converts geo coordinates from one system to another',
  version: packageJson.version,
  git: 'https://github.com/proj4js/proj4js.git'
});

Package.onUse(function (api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);
  api.export('proj4');
  api.addFiles([
    'dist/proj4.js',
    'meteor/export.js'
  ]
  );
});

Package.onTest(function (api) {
  api.use(packageName);
  api.use('tinytest');

  api.addFiles('meteor/test.js');
});