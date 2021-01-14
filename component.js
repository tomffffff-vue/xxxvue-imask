import { ref, h , computed , watch , onMounted, onUnmounted } from 'vue';
import IMask from 'imask';

var IMaskComponent = {
  name: 'imask-input',
  props: {
    mask: {},
    value: {},
    unmask: {
      validator: function validator(value) {
        return value === 'typed' || typeof value === 'boolean';
      }
    },
    prepare: Function,
    validate: Function,
    commit: Function,
    overwrite: {
      type: Boolean,
      required: false,
      default: undefined
    },
    // pattern
    placeholderChar: String,
    lazy: {
      type: Boolean,
      required: false,
      default: undefined
    },
    definitions: Object,
    blocks: Object,
    // date
    pattern: String,
    format: Function,
    parse: Function,
    autofix: {
      type: Boolean,
      required: false,
      default: undefined
    },
    // number
    radix: String,
    thousandsSeparator: String,
    mapToRadix: Array,
    scale: Number,
    signed: {
      type: Boolean,
      required: false,
      default: undefined
    },
    normalizeZeros: {
      type: Boolean,
      required: false,
      default: undefined
    },
    padFractionalZeros: {
      type: Boolean,
      required: false,
      default: undefined
    },
    min: [Number, Date],
    max: [Number, Date],
    // dynamic
    dispatch: Function
  },
  setup(props, { emit }) {
    const maskRef = ref(null);
    const elRef = ref(null);
    const unmask = ref(props.unmask)
    const propsvalue = ref(props.value);

    watch(()=>props,(newval)=>{
      let _maskOptions = Object.assign({}, maskOptions);
      if (_maskOptions.mask) {
        if (maskRef.value) {
          maskRef.value.updateOptions(_maskOptions);

          if ('value' in newval && (newval.value !== _maskValue() || typeof newval.value !== 'string' && maskRef.value.value === '' && !maskRef.value.el.isActive)) {
            _updateValue();
          }
        } else {
          _initMask(_maskOptions);
          if (newval.value !== _maskValue()) _onAccept();
        }
      } else {
        _destroyMask();
        if ('value' in newval && elRef.value) 
        elRef.value.value = newval.value;
      }
    },{deep:true});

    const _extractOptionsFromProps = (props) => {
      props = Object.assign({}, props); // keep only defined props

      Object.keys(props).filter(function (prop) {
        return props[prop] === undefined;
      }).forEach(function (undefinedProp) {
        delete props[undefinedProp];
      });
      delete props.value;
      delete props.unmask;
      return props;
    };

    let maskOptions = _extractOptionsFromProps(props);
    const _initMask = (options)=>{
      let _maskOptions = options || Object.assign({}, maskOptions);
      maskRef.value = IMask(elRef.value, _maskOptions).on('accept', _onAccept.bind(this)).on('complete', _onComplete.bind(this));
      _updateValue();
    };
    const _maskValue = ()=>{
      if (unmask.value === 'typed') return maskRef.value.typedValue;
      if (unmask.value) return maskRef.value.unmaskedValue;
      return maskRef.value.value;
    };
    const _updateValue = () => {
      let _value = (propsvalue.value == null || propsvalue.value == undefined)? '' : propsvalue.value;
      if (unmask.value === 'typed') 
        maskRef.value.typedValue = _value;
      else if (unmask.value) 
        maskRef.value.unmaskedValue = _value;
      else 
        maskRef.value.value = _value;
    };

    const _onAccept = () => {
      var val = _maskValue();

      emit('input', val);
      emit('accept', val);
    };
    const _onComplete = () => {
      emit('complete', _maskValue());
    };
    const _destroyMask = () => {
      if (maskRef.value) {
        maskRef.value.destroy();
        maskRef.value = null;
      }
    }
    onMounted(()=>{
      if (!props.mask) return;
      _initMask();
    });
    onUnmounted(()=>{
      _destroyMask();
    });
    let $listeners = {};
    
    return ()=> {
      var _props = {
        value: maskRef.value ? maskRef.value.value : propsvalue.value || '',
        ref: elRef,
      };
  
      if (!props.mask) {
        _props.onInput = function (event) {
          return emit('input', event.target.value);
        };
      } else {
        delete _props.onInput;
      }
      return h('input', _props);
    }
    /*
    return {
      value,
      elRef,
      maskRef,
      $listeners,
      props,
      emit
    };
    */
  },
  /*
  render(value,elRef,maskRef,$listeners,$props,emit) {
    var props = {
      domProps: {
        value: maskRef.value ? maskRef.value.value : value
      },
      ref: elRef,
      on: Object.assign({}, $listeners)
    };

    if (!$props.mask) {
      props.on.input = function (event) {
        return emit('input', event.target.value);
      };
    } else {
      delete props.on.input;
    }
    return h('input', props);
  },
  */
};

export default IMaskComponent;
