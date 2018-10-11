import Service from '@ember/service';
import { cancel, debounce } from '@ember/runloop';
import Evented from '@ember/object/evented';

// TODO: Extract this in a separated module
// Highly inspired by
// https://github.com/mike-north/ember-resize/blob/master/addon/services/resize.ts
export default Service.extend(Evented, {
  _onScrollHandler: undefined,
  debounceTimeout: 100,
  scrollXSensitive: true,
  scrollYSensitive: true,

  _oldScrollX: window.scrollX,
  _oldScrollY: window.scrollY,
  _oldScrollXDebounced: window.scrollX,
  _oldScrollYDebounced: window.scrollY,

  init() {
    this._super(...arguments);
    this._onScrollHandler = (evt) => {
      this._fireScrollNotification(evt);
      const scheduledDebounce = debounce(this, this._fireDebouncedScrollNotification, evt, this.get('debounceTimeout'));
      this._scheduledDebounce = scheduledDebounce;
    };
    this._installScrollListener();
  },

  destroy() {
    this._super(...arguments);

    this._uninstallScrollListener();
    this._cancelScheduledDebounce();
  },


  _hasWindowScrollChanged(x, y, debounced) {
    const xKey = debounced ? '_oldScrollXDebounced' : '_oldScrollX';
    const yKey = debounced ? '_oldScrollYDebounced' : '_oldScrollY';
    return (
      (this.get('scrollXSensitive') && x !== this.get(xKey)) ||
        (this.get('scrollYSensitive') && y !== this.get(yKey))
    );
  },

  _updateCachedWindowScroll(x, y, debounced) {
    const xKey = debounced ? '_oldScrollXDebounced' : '_oldScrollX';
    const yKey = debounced ? '_oldScrollYDebounced' : '_oldScrollY';
    this.set(xKey, x);
    this.set(yKey, y);
  },

  _installScrollListener() {
    if (!this._onScrollHandler) { return; }
    window.addEventListener('scroll', this._onScrollHandler);
  },

  _uninstallScrollListener() {
    if (!this._onScrollHandler) { return; }
    window.removeEventListener('scroll', this._onScrollHandler);
  },

  _cancelScheduledDebounce() {
    if (!this._scheduledDebounce) { return; }
    cancel(this._scheduledDebounce);
  },

  _fireScrollNotification(evt) {
    const { scrollX, scrollY } = window;
    if (this._hasWindowScrollChanged(scrollX, scrollY)) {
      this.trigger('didScroll', evt);
      this._updateCachedWindowScroll(scrollX, scrollY);
    }
  },

  _fireDebouncedScrollNotification(evt) {
    const { scrollX, scrollY } = window;
    if (this._hasWindowScrollChanged(scrollX, scrollY, true)) {
      this.trigger('debouncedDidScroll', evt);
      this._updateCachedWindowScroll(scrollX, scrollY, true);
    }
  }
});
