import Component from '@ember/component';
import { get, getProperties } from '@ember/object';
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

  didInsertElement() {
    this._super(...arguments);

    let target = get(this, 'element');
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

    get(this, 'stickybits').create(target, props);
    if (get(this, 'listenResize')) {
      this._windowResizeHandler = this._onWindowResize.bind(this);
      window.addEventListener('resize', this._windowResizeHandler);
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
  },

  willDestroyElement() {
    let target = get(this, 'element');
    get(this, 'stickybits').cleanup(target);
    if (this._windowResizeHandler) {
      window.removeEventListener('resize', this._windowResizeHandler);
    }
    this._super(...arguments);
  }
});
