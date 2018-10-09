import Component from '@ember/component';
import { get, getProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import layout from '../templates/components/stickybits-element';

export default Component.extend({
  layout,
  stickybits: service(),

  noStyles: null,
  parentClass: null,
  scrollEl: null,
  stickyBitStickyOffset: null,
  stickyClass: null,
  stuckClass: null,
  useFixed: null,
  useGetBoundingClientRect: null,
  useStickyClasses: null,
  verticalPosition: null,

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
    this._windowResizeHandler = this.onWindowResize.bind(this);
    window.addEventListener('resize', this._windowResizeHandler);
  },

  onWindowResize() {
    debounce(() => {
      if (get(this, 'isDestroying') || get(this, 'isDestroyed')) {
        return;
      }
      let target = get(this, 'element');
      get(this, 'stickybits').update(target);
    }, 200);
  },

  willDestroyElement() {
    let target = get(this, 'element');
    get(this, 'stickybits').cleanup(target);
    window.removeEventListener('resize', this._windowResizeHandler);
    this._super(...arguments);
  }
});
