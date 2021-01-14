import IMask from 'imask/esm/imask';

var IMaskDirective = {
  name: 'imask',
  bind: function bind(el, _ref) {
    var options = _ref.value;
    if (!options) return;
    initMask(el, options);
  },
  update: function update(el, _ref2) {
    var options = _ref2.value;

    if (options) {
      if (el.maskRef) {
        el.maskRef.updateOptions(options);
        if (el.value !== el.maskRef.value) el.maskRef._onChange();
      } else initMask(el, options);
    } else {
      destroyMask(el);
    }
  },
  unbind: function unbind(el) {
    destroyMask(el);
  }
};

function fireEvent(el, eventName, data) {
  var e = document.createEvent('CustomEvent');
  e.initCustomEvent(eventName, true, true, data);
  el.dispatchEvent(e);
}

function initMask(el, opts) {
  el.maskRef = IMask(el, opts).on('accept', function () {
    return fireEvent(el, 'accept', el.maskRef);
  }).on('complete', function () {
    return fireEvent(el, 'complete', el.maskRef);
  });
}

function destroyMask(el) {
  if (el.maskRef) {
    el.maskRef.destroy();
    delete el.maskRef;
  }
}

export default IMaskDirective;
