(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['stickybits'],
      __esModule: true,
    };
  }

  define('stickybits', [], vendorModule);
})();
