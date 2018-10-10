import Component from '@ember/component';
import { set, get, getProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import layout from '../templates/components/stickybits-element';

/**
  A container which directly attach stickybits instance to it.
  ```hbs
    {{#stickybits-element}}
      Here is my sticky content
    {{/stickybits-element}}
  ```

  @class StickybitsElement
  @public
*/
export default Component.extend({
  layout,
  stickybits: service(),

  /**
     If false remove sticky behavior

     @argument enabled
     @type boolean
  */
  enabled: true,

  /**
    If true listen window resize

    @argument listenResize
    @type boolean
  */
  listenResize: false,

  /**
    Number of milliseconds to debounce stickybits update on resize

    @argument resizeDebounce
    @type number
  */
  resizeDebounce: 200,

  /**
    Stickybits `noStyles` option

    @argument noStyles
    @type boolean
  */
  noStyles: undefined,

  /**
    Stickybits `parentClass` option

    @argument parentClass
    @type string
  */
  parentClass: undefined,

  /**
    Stickybits `scrollEl` option

    @argument scrollEl
    @type DOMElement
  */
  scrollEl: undefined,

  /**
    Stickybits `stickyBitStickyOffset` option

    @argument stickyBitStickyOffset
    @type number
  */
  stickyBitStickyOffset: undefined,

  /**
    Stickybits `stickyClass` option

    @argument stickyClass
    @type {string}
  */
  stickyClass: undefined,

  /**
    Stickybits `stuckClass` option

    @argument stuckClass
    @type string
  */
  stuckClass: undefined,

  /**
    Stickybits `useFixed` option

    @argument useFixed
    @type boolean
  */
  useFixed: undefined,

  /**
    Stickybits `useGetBoundingClientRect` option

    @argument useGetBoundingClientRect
    @type boolean
  */
  useGetBoundingClientRect: undefined,

  /**
    Stickybits `useStickyClasses` option

    @argument useStickyClasses
    @type boolean
  */
  useStickyClasses: undefined,

  /**
    Stickybits `verticalPosition` option

    @argument verticalPosition
    @type boolean
  */
  verticalPosition: undefined,

  /**
     Last `enabled` state

     @type boolean
     @private
  */
  _lastenabled: true,

  didInsertElement() {
    this._super(...arguments);

    let target = get(this, 'element');
    let enabled = get(this, 'enabled');
    let props = getProperties(this, [
      'noStyles',
      'parentClass',
      'scrollEl',
      'stickyBitStickyOffset',
      'stickyClass',
      'stuckClass',
      'useFixed',
      'useGetBoundingClientRect',
      'useStickyClasses',
      'verticalPosition'
    ]);

    set(this, '_lastenabled', enabled);
    if (!enabled) {
      return;
    }
    this._createStickybits(target, props);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    let lastenabled = get(this, '_lastenabled');
    let enabled = get(this, 'enabled');
    let target = get(this, 'element');

    if (enabled !== lastenabled) {
      let props = getProperties(this, [
        'noStyles',
        'parentClass',
        'scrollEl',
        'stickyBitStickyOffset',
        'stickyClass',
        'stuckClass',
        'useFixed',
        'useGetBoundingClientRect',
        'useStickyClasses',
        'verticalPosition'
      ]);

      set(this, '_lastenabled', enabled);
      this._createStickybits(target, props);
    } else {
      this._cleanupStickybits(target);
    }
  },

  willDestroyElement() {
    let target = get(this, 'element');
    this._cleanupStickybits(target);
    this._super(...arguments);
  },

  /**
     Create stickybits instance

     @method _createStickybits
     @private
  */
  _createStickybits(target, props) {
    get(this, 'stickybits').create(target, props);
    if (get(this, 'listenResize')) {
      this._windowResizeHandler = this._onWindowResize.bind(this);
      window.addEventListener('resize', this._windowResizeHandler);
    }
  },

  /**
     Cleanup stickybits instance

     @method _cleanupStickybits
     @private
  */
  _cleanupStickybits(target) {
    get(this, 'stickybits').cleanup(target);
    if (this._windowResizeHandler) {
      window.removeEventListener('resize', this._windowResizeHandler);
    }
  },

  /**
    Update stickybits instance if window is resized

    @method _onWindowResize
    @private
  */
  _onWindowResize() {
    debounce(() => {
      if (get(this, 'isDestroying') || get(this, 'isDestroyed')) {
        return;
      }
      let target = get(this, 'element');
      get(this, 'stickybits').update(target);
    }, get(this, 'resizeDebounce'));
  }
});
