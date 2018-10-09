import Service from '@ember/service';
import { get, set } from '@ember/object';
import { assert } from '@ember/debug';
import stickybits from 'stickybits';

export default Service.extend({
  // WeakMap to store stickybits instances
  weakmap: null,

  init() {
    this._super(...arguments);
    set(this, 'weakmap', new WeakMap());
  },

  create(target, props) {
    let weakmap = get(this, 'weakmap');
    assert('Try to create multiple stickybits instance for the same element', !weakmap.has(target));

    let stickybitsInstance = stickybits(target, props);
    weakmap.set(target, stickybitsInstance);

    return stickybitsInstance;
  },

  update(target) {
    let weakmap = get(this, 'weakmap');
    let stickybitsInstance = weakmap.get(target);
    if (stickybitsInstance) {
      stickybitsInstance.update();
    }
  },

  cleanup(target) {
    let weakmap = get(this, 'weakmap');
    let stickybitsInstance = weakmap.get(target);
    if (stickybitsInstance) {
      stickybitsInstance.cleanup();
    }
  }
});
