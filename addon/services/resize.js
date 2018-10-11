import Service from '@ember/service';
import { cancel, debounce } from '@ember/runloop';
import Evented from '@ember/object/evented';

// TODO: Extract this in a separated module
// Highly inspired by
// https://github.com/mike-north/ember-resize/blob/master/addon/services/resize.ts
export default Service.extend(Evented, {
  _onResizeHandler: undefined,
  debounceTimeout: 100,
  widthSensitive: true,
  heightSensitive: true,

  _oldWidth: window.innerWidth,
  _oldHeight: window.innerHeight,
  _oldWidthDebounced: window.innerWidth,
  _oldHeightDebounced: window.innerHeight,

  init() {
    this._super(...arguments);
    this._onResizeHandler = (evt) => {
      this._fireResizeNotification(evt);
      const scheduledDebounce = debounce(this, this._fireDebouncedResizeNotification, evt, this.get('debounceTimeout'));
      this._scheduledDebounce = scheduledDebounce;
    };
    this._installResizeListener();
  },

  destroy() {
    this._super(...arguments);

    this._uninstallResizeListener();
    this._cancelScheduledDebounce();
  },


  _hasWindowResizeChanged(w, h, debounced) {
    const wKey = debounced ? '_oldWidthDebounced' : '_oldWidth';
    const hKey = debounced ? '_oldHeightDebounced' : '_oldHeight';
    return (
      (this.get('widthSensitive') && w !== this.get(wKey)) ||
        (this.get('heightSensitive') && h !== this.get(hKey))
    );
  },

  _updateCachedWindowResize(w, h, debounced) {
    const wKey = debounced ? '_oldWidthDebounced' : '_oldWidth';
    const hKey = debounced ? '_oldHeightDebounced' : '_oldHeight';
    this.set(wKey, w);
    this.set(hKey, h);
  },

  _installResizeListener() {
    if (!this._onResizeHandler) { return; }
    window.addEventListener('resize', this._onResizeHandler);
  },

  _uninstallResizeListener() {
    if (!this._onResizeHandler) { return; }
    window.removeEventListener('resize', this._onResizeHandler);
  },

  _cancelScheduledDebounce() {
    if (!this._scheduledDebounce) { return; }
    cancel(this._scheduledDebounce);
  },

  _fireResizeNotification(evt) {
    const { innerWidth, innerHeight } = window;
    if (this._hasWindowResizeChanged(innerWidth, innerHeight)) {
      this.trigger('didResize', evt);
      this._updateCachedWindowResize(innerWidth, innerHeight);
    }
  },

  _fireDebouncedResizeNotification(evt) {
    const { innerWidth, innerHeight } = window;
    if (this._hasWindowResizeChanged(innerWidth, innerHeight, true)) {
      this.trigger('debouncedDidResize', evt);
      this._updateCachedWindowResize(innerWidth, innerHeight, true);
    }
  }
});
