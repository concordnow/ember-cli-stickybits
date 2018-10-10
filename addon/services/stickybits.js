import Service from '@ember/service';
import { get, set } from '@ember/object';
import stickybits from 'stickybits';

/**
  Provides stickybits as a service
  to create, update, destroy stickybits instances

  @class Stickybits
  @public
*/
export default Service.extend({

  /**
    Store all stickybits instances
    key = target used to create instance
    value = stickybits instance

    @type WeakMap
  */
  weakmap: null,

  init() {
    this._super(...arguments);
    set(this, 'weakmap', new WeakMap());
  },

  /**
    Create a new stickybits instance.
    If an instance already exist for the target,
    return the existing instance.

    @method create
    @param {DOMElement|string} target Target to turn sticky
    @param {Object} props Stickybits parameter
    @return {Object} stickybitsInstance Instance newly created
  */
  create(target, props) {
    let weakmap = get(this, 'weakmap');
    let stickybitsInstance = weakmap.get(target);

    if (stickybitsInstance) {
      return stickybitsInstance;
    }
    stickybitsInstance = stickybits(target, props);
    weakmap.set(target, stickybitsInstance);

    return stickybitsInstance;
  },

  /**
    Update an existing stickybits instance

    @method update
    @param {DOMElement|string} target Target used to create the instance
  */
  update(target) {
    let weakmap = get(this, 'weakmap');
    let stickybitsInstance = weakmap.get(target);
    if (stickybitsInstance) {
      stickybitsInstance.update();
    }
  },

  /**
    Destroy an existing stickybits instance

    @method update
    @param {DOMElement|string} target Target used to create the instance
  */
  cleanup(target) {
    let weakmap = get(this, 'weakmap');
    let stickybitsInstance = weakmap.get(target);
    if (stickybitsInstance) {
      stickybitsInstance.cleanup();
    }
  }
});
