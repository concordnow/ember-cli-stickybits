import Component from '@ember/component';
import { computed, set, get, getProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
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
  resize: service(),
  scroll: service(),

  /**
     If false remove sticky behavior

     @argument enabled
     @type boolean
  */
  enabled: true,

  /**
    If true listen window resize and adjust component width
    according to its parent

    @argument autoResize
    @type boolean
  */
  autoResize: true,

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
  _lastenabled: undefined,

  noStickySupport: computed.not('stickybits.hasStickySupport'),
  hasFixedPosition: computed.or('noStickySupport', 'useFixed'),
  needsResizeHandler: computed.and('hasFixedPosition', 'autoResize'),
  needsScrollHandler: computed.and('hasFixedPosition', 'autoResize'),

  init() {
    this._super(...arguments);

    let enabled = get(this, 'enabled');
    set(this, '_lastenabled', enabled);
    if (get(this, 'needsResizeHandler')) {
      get(this, 'resize').on('debouncedDidResize', this, this._resizeHandler);
      get(this, 'scroll').on('debouncedDidScroll', this, this._scrollHandler);
    }
  },

  didInsertElement() {
    this._super(...arguments);

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

    if (!enabled) {
      return;
    }
    this._turnOnSticky(props);
    // Force first scroll handler
    // if page is displayed already scrolled
    next(this, this._scrollHandler);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    let lastenabled = get(this, '_lastenabled');
    let enabled = get(this, 'enabled');
    let element = get(this, 'element');

    if (!element) {
      return;
    }

    if (enabled !== lastenabled) {
      if (enabled) {
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

        this._turnOnSticky(props);
      } else {
        this._turnOffSticky();
      }
      set(this, '_lastenabled', enabled);
    }
  },

  willDestroyElement() {
    get(this, 'resize').off('debouncedDidResize', this, this._resizeHandler);
    get(this, 'scroll').off('debouncedDidScroll', this, this._scrollHandler);
    this._turnOffSticky();
    this._super(...arguments);
  },

  /**
     Turn on sticky behavior

     @method _turnOnSticky
     @private
  */
  _turnOnSticky(props) {
    let element = get(this, 'element');
    get(this, 'stickybits').create(element, props);
  },

  /**
     Turn off sticky behavior

     @method _turnOffSticky
     @private
  */
  _turnOffSticky() {
    let element = get(this, 'element');
    if (get(this, 'needsResizeHandler')) {
      element.style.width = '';
    }
    element.style.top = '';
    element.style.position = '';

    get(this, 'stickybits').cleanup(element);
  },

  /**
     Update stickybits instance if window is resized

     @method _resizeHandler
     @private
  */
  _resizeHandler() {
    if (get(this, 'isDestroying') || get(this, 'isDestroyed')) {
      return;
    }
    if (!get(this, 'needsResizeHandler')) {
      return;
    }
    let element = get(this, 'element');
    let parentWidth = element.parentElement.offsetWidth;
    if (element.offsetWidth !== parentWidth) {
      element.style.width = `${parentWidth}px`;
    }
    get(this, 'stickybits').update(element);
  },

  /**
     Update stickybits instance if window is scrolled

     @method _scrollHandler
     @private
  */
  _scrollHandler() {
    if (get(this, 'isDestroying') || get(this, 'isDestroyed')) {
      return;
    }
    if (!get(this, 'needsScrollHandler')) {
      return;
    }
    let element = get(this, 'element');
    let parentWidth = element.parentElement.offsetWidth;

    if (element.offsetWidth !== parentWidth) {
      element.style.width = `${parentWidth}px`;
    }
    get(this, 'stickybits').update(element);
  }
});
