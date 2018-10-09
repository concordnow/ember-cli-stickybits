'use strict';

const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: require('./package').name,
  options: {
    nodeAssets: {
      stickybits: () => ({
        vendor: {
          include: ['dist/stickybits.js'],
          processTree: input => fastbootTransform(input)
        }
      })
    }
  },
  included() {
    this._super.included.apply(this, arguments);
    this.import('vendor/stickybits/dist/stickybits.js');
    this.import('vendor/shims/stickybits.js');
  }
};
