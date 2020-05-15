(function () {
  'use strict';

  /*!
   * Vue.js v2.6.11
   * (c) 2014-2019 Evan You
   * Released under the MIT License.
   */
  /*  */

  var emptyObject = Object.freeze({});

  // These helpers produce better VM code in JS engines due to their
  // explicitness and function inlining.
  function isUndef (v) {
    return v === undefined || v === null
  }

  function isDef (v) {
    return v !== undefined && v !== null
  }

  function isTrue (v) {
    return v === true
  }

  function isFalse (v) {
    return v === false
  }

  /**
   * Check if value is primitive.
   */
  function isPrimitive (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Get the raw type string of a value, e.g., [object Object].
   */
  var _toString = Object.prototype.toString;

  function toRawType (value) {
    return _toString.call(value).slice(8, -1)
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
  }

  function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
  }

  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex (val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  }

  function isPromise (val) {
    return (
      isDef(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function'
    )
  }

  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString (val) {
    return val == null
      ? ''
      : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
  }

  /**
   * Convert an input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber (val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap (
    str,
    expectsLowerCase
  ) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Check if an attribute is a reserved attribute.
   */
  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

  /**
   * Remove an item from an array.
   */
  function remove (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether an object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached (fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str))
    })
  }

  /**
   * Camelize a hyphen-delimited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  });

  /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */

  /* istanbul ignore next */
  function polyfillBind (fn, ctx) {
    function boundFn (a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind (fn, ctx) {
    return fn.bind(ctx)
  }

  var bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

  /**
   * Mix properties into target object.
   */
  function extend (to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject (arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res
  }

  /* eslint-disable no-unused-vars */

  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
  function noop (a, b, c) {}

  /**
   * Always return false.
   */
  var no = function (a, b, c) { return false; };

  /* eslint-enable no-unused-vars */

  /**
   * Return the same value.
   */
  var identity = function (_) { return _; };

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  /**
   * Return the first index at which a loosely equal value can be
   * found in the array (if value is a plain object, the array must
   * contain an object of the same shape), or -1 if it is not present.
   */
  function looseIndexOf (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) { return i }
    }
    return -1
  }

  /**
   * Ensure a function is called only once.
   */
  function once (fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }

  var SSR_ATTR = 'data-server-rendered';

  var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];

  var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
  ];

  /*  */



  var config = ({
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: undefined !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: undefined !== 'production',

    /**
     * Whether to record perf
     */
    performance: false,

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,

    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  });

  /*  */

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

  /**
   * Check if a string starts with $ or _
   */
  function isReserved (str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
  function parsePath (path) {
    if (bailRE.test(path)) {
      return
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }

  /*  */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  var isPhantomJS = UA && /phantomjs/.test(UA);
  var isFF = UA && UA.match(/firefox\/(\d+)/);

  // Firefox has a "watch" function on Object.prototype...
  var nativeWatch = ({}).watch;

  var supportsPassive = false;
  if (inBrowser) {
    try {
      var opts = {};
      Object.defineProperty(opts, 'passive', ({
        get: function get () {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      })); // https://github.com/facebook/flow/issues/285
      window.addEventListener('test-passive', null, opts);
    } catch (e) {}
  }

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }

  var hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  var _Set;
  /* istanbul ignore if */ // $flow-disable-line
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = /*@__PURE__*/(function () {
      function Set () {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has (key) {
        return this.set[key] === true
      };
      Set.prototype.add = function add (key) {
        this.set[key] = true;
      };
      Set.prototype.clear = function clear () {
        this.set = Object.create(null);
      };

      return Set;
    }());
  }

  /*  */

  var warn = noop;
  var tip = noop;
  var generateComponentTrace = (noop); // work around flow check
  var formatComponentName = (noop);

  {
    var hasConsole = typeof console !== 'undefined';
    var classifyRE = /(?:^|[-_])(\w)/g;
    var classify = function (str) { return str
      .replace(classifyRE, function (c) { return c.toUpperCase(); })
      .replace(/[-_]/g, ''); };

    warn = function (msg, vm) {
      var trace = vm ? generateComponentTrace(vm) : '';

      if (config.warnHandler) {
        config.warnHandler.call(null, msg, vm, trace);
      } else if (hasConsole && (!config.silent)) {
        console.error(("[Vue warn]: " + msg + trace));
      }
    };

    tip = function (msg, vm) {
      if (hasConsole && (!config.silent)) {
        console.warn("[Vue tip]: " + msg + (
          vm ? generateComponentTrace(vm) : ''
        ));
      }
    };

    formatComponentName = function (vm, includeFile) {
      if (vm.$root === vm) {
        return '<Root>'
      }
      var options = typeof vm === 'function' && vm.cid != null
        ? vm.options
        : vm._isVue
          ? vm.$options || vm.constructor.options
          : vm;
      var name = options.name || options._componentTag;
      var file = options.__file;
      if (!name && file) {
        var match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
      }

      return (
        (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
        (file && includeFile !== false ? (" at " + file) : '')
      )
    };

    var repeat = function (str, n) {
      var res = '';
      while (n) {
        if (n % 2 === 1) { res += str; }
        if (n > 1) { str += str; }
        n >>= 1;
      }
      return res
    };

    generateComponentTrace = function (vm) {
      if (vm._isVue && vm.$parent) {
        var tree = [];
        var currentRecursiveSequence = 0;
        while (vm) {
          if (tree.length > 0) {
            var last = tree[tree.length - 1];
            if (last.constructor === vm.constructor) {
              currentRecursiveSequence++;
              vm = vm.$parent;
              continue
            } else if (currentRecursiveSequence > 0) {
              tree[tree.length - 1] = [last, currentRecursiveSequence];
              currentRecursiveSequence = 0;
            }
          }
          tree.push(vm);
          vm = vm.$parent;
        }
        return '\n\nfound in\n\n' + tree
          .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
              ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
              : formatComponentName(vm))); })
          .join('\n')
      } else {
        return ("\n\n(found in " + (formatComponentName(vm)) + ")")
      }
    };
  }

  /*  */

  var uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    if ( !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort(function (a, b) { return a.id - b.id; });
    }
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget (target) {
    targetStack.push(target);
    Dep.target = target;
  }

  function popTarget () {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }

  /*  */

  var VNode = function VNode (
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: { configurable: true } };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance
  };

  Object.defineProperties( VNode.prototype, prototypeAccessors );

  var createEmptyVNode = function (text) {
    if ( text === void 0 ) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };

  function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode (vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      // #7975
      // clone children array to avoid mutating original in case of cloning
      // a child.
      vnode.children && vnode.children.slice(),
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    );
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  var shouldObserve = true;

  function toggleObserving (value) {
    shouldObserve = value;
  }

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe (value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        /* eslint-enable no-self-compare */
        if ( customSetter) {
          customSetter();
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set (target, key, val) {
    if (
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
       warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del (target, key) {
    if (
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
       warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray (value) {
    for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Options with restrictions
   */
  {
    strats.el = strats.propsData = function (parent, child, vm, key) {
      if (!vm) {
        warn(
          "option \"" + key + "\" can only be used during instance " +
          'creation with the `new` keyword.'
        );
      }
      return defaultStrat(parent, child)
    };
  }

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData (to, from) {
    if (!from) { return to }
    var key, toVal, fromVal;

    var keys = hasSymbol
      ? Reflect.ownKeys(from)
      : Object.keys(from);

    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      // in case the object is already observed...
      if (key === '__ob__') { continue }
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (
        toVal !== fromVal &&
        isPlainObject(toVal) &&
        isPlainObject(fromVal)
      ) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   */
  function mergeDataOrFn (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn () {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn () {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }

  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {
         warn(
          'The "data" option should be a function ' +
          'that returns a per-instance value in component ' +
          'definitions.',
          vm
        );

        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook (
    parentVal,
    childVal
  ) {
    var res = childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal;
    return res
      ? dedupeHooks(res)
      : res
  }

  function dedupeHooks (hooks) {
    var res = [];
    for (var i = 0; i < hooks.length; i++) {
      if (res.indexOf(hooks[i]) === -1) {
        res.push(hooks[i]);
      }
    }
    return res
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets (
    parentVal,
    childVal,
    vm,
    key
  ) {
    var res = Object.create(parentVal || null);
    if (childVal) {
       assertObjectType(key, childVal, vm);
      return extend(res, childVal)
    } else {
      return res
    }
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) { parentVal = undefined; }
    if (childVal === nativeWatch) { childVal = undefined; }
    /* istanbul ignore if */
    if (!childVal) { return Object.create(parentVal || null) }
    {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = {};
    extend(ret, parentVal);
    for (var key$1 in childVal) {
      var parent = ret[key$1];
      var child = childVal[key$1];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key$1] = parent
        ? parent.concat(child)
        : Array.isArray(child) ? child : [child];
    }
    return ret
  };

  /**
   * Other object hashes.
   */
  strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    if (childVal && undefined !== 'production') {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = Object.create(null);
    extend(ret, parentVal);
    if (childVal) { extend(ret, childVal); }
    return ret
  };
  strats.provide = mergeDataOrFn;

  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal
  };

  /**
   * Validate component names
   */
  function checkComponents (options) {
    for (var key in options.components) {
      validateComponentName(key);
    }
  }

  function validateComponentName (name) {
    if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
      warn(
        'Invalid component name: "' + name + '". Component names ' +
        'should conform to valid custom element name in html5 specification.'
      );
    }
    if (isBuiltInTag(name) || config.isReservedTag(name)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + name
      );
    }
  }

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps (options, vm) {
    var props = options.props;
    if (!props) { return }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        } else {
          warn('props must be strings when using array syntax.');
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val)
          ? val
          : { type: val };
      }
    } else {
      warn(
        "Invalid value for option \"props\": expected an Array or an Object, " +
        "but got " + (toRawType(props)) + ".",
        vm
      );
    }
    options.props = res;
  }

  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject (options, vm) {
    var inject = options.inject;
    if (!inject) { return }
    var normalized = options.inject = {};
    if (Array.isArray(inject)) {
      for (var i = 0; i < inject.length; i++) {
        normalized[inject[i]] = { from: inject[i] };
      }
    } else if (isPlainObject(inject)) {
      for (var key in inject) {
        var val = inject[key];
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val };
      }
    } else {
      warn(
        "Invalid value for option \"inject\": expected an Array or an Object, " +
        "but got " + (toRawType(inject)) + ".",
        vm
      );
    }
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives (options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def$$1 = dirs[key];
        if (typeof def$$1 === 'function') {
          dirs[key] = { bind: def$$1, update: def$$1 };
        }
      }
    }
  }

  function assertObjectType (name, value, vm) {
    if (!isPlainObject(value)) {
      warn(
        "Invalid value for option \"" + name + "\": expected an Object, " +
        "but got " + (toRawType(value)) + ".",
        vm
      );
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions (
    parent,
    child,
    vm
  ) {
    {
      checkComponents(child);
    }

    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives(child);

    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
      if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm);
      }
      if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }
    }

    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField (key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset (
    options,
    type,
    id,
    warnMissing
  ) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return
    }
    var assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id)) { return assets[id] }
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
    // fallback to prototype chain
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    if ( warnMissing && !res) {
      warn(
        'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
        options
      );
    }
    return res
  }

  /*  */



  function validateProp (
    key,
    propOptions,
    propsData,
    vm
  ) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // boolean casting
    var booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        // only cast empty string / same name to boolean if
        // boolean has higher priority
        var stringIndex = getTypeIndex(String, prop.type);
        if (stringIndex < 0 || booleanIndex < stringIndex) {
          value = true;
        }
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldObserve = shouldObserve;
      toggleObserving(true);
      observe(value);
      toggleObserving(prevShouldObserve);
    }
    {
      assertProp(prop, key, value, vm, absent);
    }
    return value
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue (vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined
    }
    var def = prop.default;
    // warn against non-factory defaults for Object & Array
    if ( isObject(def)) {
      warn(
        'Invalid default value for prop "' + key + '": ' +
        'Props with type Object/Array must use a factory function ' +
        'to return the default value.',
        vm
      );
    }
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined
    ) {
      return vm._props[key]
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm)
      : def
  }

  /**
   * Assert whether a prop is valid.
   */
  function assertProp (
    prop,
    name,
    value,
    vm,
    absent
  ) {
    if (prop.required && absent) {
      warn(
        'Missing required prop: "' + name + '"',
        vm
      );
      return
    }
    if (value == null && !prop.required) {
      return
    }
    var type = prop.type;
    var valid = !type || type === true;
    var expectedTypes = [];
    if (type) {
      if (!Array.isArray(type)) {
        type = [type];
      }
      for (var i = 0; i < type.length && !valid; i++) {
        var assertedType = assertType(value, type[i]);
        expectedTypes.push(assertedType.expectedType || '');
        valid = assertedType.valid;
      }
    }

    if (!valid) {
      warn(
        getInvalidTypeMessage(name, value, expectedTypes),
        vm
      );
      return
    }
    var validator = prop.validator;
    if (validator) {
      if (!validator(value)) {
        warn(
          'Invalid prop: custom validator check failed for prop "' + name + '".',
          vm
        );
      }
    }
  }

  var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

  function assertType (value, type) {
    var valid;
    var expectedType = getType(type);
    if (simpleCheckRE.test(expectedType)) {
      var t = typeof value;
      valid = t === expectedType.toLowerCase();
      // for primitive wrapper objects
      if (!valid && t === 'object') {
        valid = value instanceof type;
      }
    } else if (expectedType === 'Object') {
      valid = isPlainObject(value);
    } else if (expectedType === 'Array') {
      valid = Array.isArray(value);
    } else {
      valid = value instanceof type;
    }
    return {
      valid: valid,
      expectedType: expectedType
    }
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType (fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ''
  }

  function isSameType (a, b) {
    return getType(a) === getType(b)
  }

  function getTypeIndex (type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1
    }
    for (var i = 0, len = expectedTypes.length; i < len; i++) {
      if (isSameType(expectedTypes[i], type)) {
        return i
      }
    }
    return -1
  }

  function getInvalidTypeMessage (name, value, expectedTypes) {
    var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', '));
    var expectedType = expectedTypes[0];
    var receivedType = toRawType(value);
    var expectedValue = styleValue(value, expectedType);
    var receivedValue = styleValue(value, receivedType);
    // check if we need to specify expected value
    if (expectedTypes.length === 1 &&
        isExplicable(expectedType) &&
        !isBoolean(expectedType, receivedType)) {
      message += " with value " + expectedValue;
    }
    message += ", got " + receivedType + " ";
    // check if we need to specify received value
    if (isExplicable(receivedType)) {
      message += "with value " + receivedValue + ".";
    }
    return message
  }

  function styleValue (value, type) {
    if (type === 'String') {
      return ("\"" + value + "\"")
    } else if (type === 'Number') {
      return ("" + (Number(value)))
    } else {
      return ("" + value)
    }
  }

  function isExplicable (value) {
    var explicitTypes = ['string', 'number', 'boolean'];
    return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
  }

  function isBoolean () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
  }

  /*  */

  function handleError (err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
    // See: https://github.com/vuejs/vuex/issues/1505
    pushTarget();
    try {
      if (vm) {
        var cur = vm;
        while ((cur = cur.$parent)) {
          var hooks = cur.$options.errorCaptured;
          if (hooks) {
            for (var i = 0; i < hooks.length; i++) {
              try {
                var capture = hooks[i].call(cur, err, vm, info) === false;
                if (capture) { return }
              } catch (e) {
                globalHandleError(e, cur, 'errorCaptured hook');
              }
            }
          }
        }
      }
      globalHandleError(err, vm, info);
    } finally {
      popTarget();
    }
  }

  function invokeWithErrorHandling (
    handler,
    context,
    args,
    vm,
    info
  ) {
    var res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
        // issue #9511
        // avoid catch triggering multiple times when nested calls
        res._handled = true;
      }
    } catch (e) {
      handleError(e, vm, info);
    }
    return res
  }

  function globalHandleError (err, vm, info) {
    if (config.errorHandler) {
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        // if the user intentionally throws the original error in the handler,
        // do not log it twice
        if (e !== err) {
          logError(e, null, 'config.errorHandler');
        }
      }
    }
    logError(err, vm, info);
  }

  function logError (err, vm, info) {
    {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }

  /*  */

  var isUsingMicroTask = false;

  var callbacks = [];
  var pending = false;

  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // Here we have async deferring wrappers using microtasks.
  // In 2.5 we used (macro) tasks (in combination with microtasks).
  // However, it has subtle problems when state is changed right before repaint
  // (e.g. #6813, out-in transitions).
  // Also, using (macro) tasks in event handler would cause some weird behaviors
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
  // So we now use microtasks everywhere, again.
  // A major drawback of this tradeoff is that there are some scenarios
  // where microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690, which have workarounds)
  // or even between bubbling of the same event (#6566).
  var timerFunc;

  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }

  /*  */

  /* not type checking this file because flow doesn't play well with Proxy */

  var initProxy;

  {
    var allowedGlobals = makeMap(
      'Infinity,undefined,NaN,isFinite,isNaN,' +
      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
      'require' // for Webpack/Browserify
    );

    var warnNonPresent = function (target, key) {
      warn(
        "Property or method \"" + key + "\" is not defined on the instance but " +
        'referenced during render. Make sure that this property is reactive, ' +
        'either in the data option, or for class-based components, by ' +
        'initializing the property. ' +
        'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
        target
      );
    };

    var warnReservedPrefix = function (target, key) {
      warn(
        "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
        'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
        'prevent conflicts with Vue internals. ' +
        'See: https://vuejs.org/v2/api/#data',
        target
      );
    };

    var hasProxy =
      typeof Proxy !== 'undefined' && isNative(Proxy);

    if (hasProxy) {
      var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
      config.keyCodes = new Proxy(config.keyCodes, {
        set: function set (target, key, value) {
          if (isBuiltInModifier(key)) {
            warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
            return false
          } else {
            target[key] = value;
            return true
          }
        }
      });
    }

    var hasHandler = {
      has: function has (target, key) {
        var has = key in target;
        var isAllowed = allowedGlobals(key) ||
          (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
        if (!has && !isAllowed) {
          if (key in target.$data) { warnReservedPrefix(target, key); }
          else { warnNonPresent(target, key); }
        }
        return has || !isAllowed
      }
    };

    var getHandler = {
      get: function get (target, key) {
        if (typeof key === 'string' && !(key in target)) {
          if (key in target.$data) { warnReservedPrefix(target, key); }
          else { warnNonPresent(target, key); }
        }
        return target[key]
      }
    };

    initProxy = function initProxy (vm) {
      if (hasProxy) {
        // determine which proxy handler to use
        var options = vm.$options;
        var handlers = options.render && options.render._withStripped
          ? getHandler
          : hasHandler;
        vm._renderProxy = new Proxy(vm, handlers);
      } else {
        vm._renderProxy = vm;
      }
    };
  }

  /*  */

  var seenObjects = new _Set();

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse (val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse (val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
      return
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) { _traverse(val[i], seen); }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { _traverse(val[keys[i]], seen); }
    }
  }

  var mark;
  var measure;

  {
    var perf = inBrowser && window.performance;
    /* istanbul ignore if */
    if (
      perf &&
      perf.mark &&
      perf.measure &&
      perf.clearMarks &&
      perf.clearMeasures
    ) {
      mark = function (tag) { return perf.mark(tag); };
      measure = function (name, startTag, endTag) {
        perf.measure(name, startTag, endTag);
        perf.clearMarks(startTag);
        perf.clearMarks(endTag);
        // perf.clearMeasures(name)
      };
    }
  }

  /*  */

  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once$$1,
      capture: capture,
      passive: passive
    }
  });

  function createFnInvoker (fns, vm) {
    function invoker () {
      var arguments$1 = arguments;

      var fns = invoker.fns;
      if (Array.isArray(fns)) {
        var cloned = fns.slice();
        for (var i = 0; i < cloned.length; i++) {
          invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
        }
      } else {
        // return handler return value for single handlers
        return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
      }
    }
    invoker.fns = fns;
    return invoker
  }

  function updateListeners (
    on,
    oldOn,
    add,
    remove$$1,
    createOnceHandler,
    vm
  ) {
    var name, def$$1, cur, old, event;
    for (name in on) {
      def$$1 = cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      if (isUndef(cur)) {
         warn(
          "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
          vm
        );
      } else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur, vm);
        }
        if (isTrue(event.once)) {
          cur = on[name] = createOnceHandler(event.name, cur, event.capture);
        }
        add(event.name, cur, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook (def, hookKey, hook) {
    if (def instanceof VNode) {
      def = def.data.hook || (def.data.hook = {});
    }
    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook () {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  function extractPropsFromVNodeData (
    data,
    Ctor,
    tag
  ) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if (isDef(attrs) || isDef(props)) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        {
          var keyInLowerCase = key.toLowerCase();
          if (
            key !== keyInLowerCase &&
            attrs && hasOwn(attrs, keyInLowerCase)
          ) {
            tip(
              "Prop \"" + keyInLowerCase + "\" is passed to component " +
              (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
              " \"" + key + "\". " +
              "Note that HTML attributes are case-insensitive and camelCased " +
              "props need to use their kebab-case equivalents when using in-DOM " +
              "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
            );
          }
        }
        checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey, false);
      }
    }
    return res
  }

  function checkProp (
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (isDef(hash)) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true
      }
    }
    return false
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren (children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren (children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }

  function isTextNode (node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }

  function normalizeArrayChildren (children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') { continue }
      lastIndex = res.length - 1;
      last = res[lastIndex];
      //  nested
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
          // merge adjacent text nodes
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
            c.shift();
          }
          res.push.apply(res, c);
        }
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          res[lastIndex] = createTextVNode(last.text + c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[lastIndex] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) &&
            isDef(c.tag) &&
            isUndef(c.key) &&
            isDef(nestedIndex)) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }

  /*  */

  function initProvide (vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function'
        ? provide.call(vm)
        : provide;
    }
  }

  function initInjections (vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
      toggleObserving(false);
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          defineReactive$$1(vm, key, result[key], function () {
            warn(
              "Avoid mutating an injected value directly since the changes will be " +
              "overwritten whenever the provided component re-renders. " +
              "injection being mutated: \"" + key + "\"",
              vm
            );
          });
        }
      });
      toggleObserving(true);
    }
  }

  function resolveInject (inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      var result = Object.create(null);
      var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // #6574 in case the inject object is observed...
        if (key === '__ob__') { continue }
        var provideKey = inject[key].from;
        var source = vm;
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey];
            break
          }
          source = source.$parent;
        }
        if (!source) {
          if ('default' in inject[key]) {
            var provideDefault = inject[key].default;
            result[key] = typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault;
          } else {
            warn(("Injection \"" + key + "\" not found"), vm);
          }
        }
      }
      return result
    }
  }

  /*  */



  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots (
    children,
    context
  ) {
    if (!children || !children.length) {
      return {}
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }

  function isWhitespace (node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }

  /*  */

  function normalizeScopedSlots (
    slots,
    normalSlots,
    prevSlots
  ) {
    var res;
    var hasNormalSlots = Object.keys(normalSlots).length > 0;
    var isStable = slots ? !!slots.$stable : !hasNormalSlots;
    var key = slots && slots.$key;
    if (!slots) {
      res = {};
    } else if (slots._normalized) {
      // fast path 1: child component re-render only, parent did not change
      return slots._normalized
    } else if (
      isStable &&
      prevSlots &&
      prevSlots !== emptyObject &&
      key === prevSlots.$key &&
      !hasNormalSlots &&
      !prevSlots.$hasNormal
    ) {
      // fast path 2: stable scoped slots w/ no normal slots to proxy,
      // only need to normalize once
      return prevSlots
    } else {
      res = {};
      for (var key$1 in slots) {
        if (slots[key$1] && key$1[0] !== '$') {
          res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
        }
      }
    }
    // expose normal slots on scopedSlots
    for (var key$2 in normalSlots) {
      if (!(key$2 in res)) {
        res[key$2] = proxyNormalSlot(normalSlots, key$2);
      }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (slots && Object.isExtensible(slots)) {
      (slots)._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res
  }

  function normalizeScopedSlot(normalSlots, key, fn) {
    var normalized = function () {
      var res = arguments.length ? fn.apply(null, arguments) : fn({});
      res = res && typeof res === 'object' && !Array.isArray(res)
        ? [res] // single vnode
        : normalizeChildren(res);
      return res && (
        res.length === 0 ||
        (res.length === 1 && res[0].isComment) // #9658
      ) ? undefined
        : res
    };
    // this is a slot using the new v-slot syntax without scope. although it is
    // compiled as a scoped slot, render fn users would expect it to be present
    // on this.$slots because the usage is semantically a normal slot.
    if (fn.proxy) {
      Object.defineProperty(normalSlots, key, {
        get: normalized,
        enumerable: true,
        configurable: true
      });
    }
    return normalized
  }

  function proxyNormalSlot(slots, key) {
    return function () { return slots[key]; }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      if (hasSymbol && val[Symbol.iterator]) {
        ret = [];
        var iterator = val[Symbol.iterator]();
        var result = iterator.next();
        while (!result.done) {
          ret.push(render(result.value, ret.length));
          result = iterator.next();
        }
      } else {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
    }
    if (!isDef(ret)) {
      ret = [];
    }
    (ret)._isVList = true;
    return ret
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot (
    name,
    fallback,
    props,
    bindObject
  ) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        if ( !isObject(bindObject)) {
          warn(
            'slot v-bind without argument expects an Object',
            this
          );
        }
        props = extend(extend({}, bindObject), props);
      }
      nodes = scopedSlotFn(props) || fallback;
    } else {
      nodes = this.$slots[name] || fallback;
    }

    var target = props && props.slot;
    if (target) {
      return this.$createElement('template', { slot: target }, nodes)
    } else {
      return nodes
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  }

  /*  */

  function isKeyNotMatch (expect, actual) {
    if (Array.isArray(expect)) {
      return expect.indexOf(actual) === -1
    } else {
      return expect !== actual
    }
  }

  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes (
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    } else if (mappedKeyCode) {
      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    } else if (eventKeyName) {
      return hyphenate(eventKeyName) !== key
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps (
    data,
    tag,
    value,
    asProp,
    isSync
  ) {
    if (value) {
      if (!isObject(value)) {
         warn(
          'v-bind without argument expects an Object or Array value',
          this
        );
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        var hash;
        var loop = function ( key ) {
          if (
            key === 'class' ||
            key === 'style' ||
            isReservedAttribute(key)
          ) {
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
          }
          var camelizedKey = camelize(key);
          var hyphenatedKey = hyphenate(key);
          if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
            hash[key] = value[key];

            if (isSync) {
              var on = data.on || (data.on = {});
              on[("update:" + key)] = function ($event) {
                value[key] = $event;
              };
            }
          }
        };

        for (var key in value) loop( key );
      }
    }
    return data
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic (
    index,
    isInFor
  ) {
    var cached = this._staticTrees || (this._staticTrees = []);
    var tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this // for render fns generated for functional component templates
    );
    markStatic(tree, ("__static__" + index), false);
    return tree
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  }

  function markStatic (
    tree,
    key,
    isOnce
  ) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners (data, value) {
    if (value) {
      if (!isPlainObject(value)) {
         warn(
          'v-on without argument expects an Object value',
          this
        );
      } else {
        var on = data.on = data.on ? extend({}, data.on) : {};
        for (var key in value) {
          var existing = on[key];
          var ours = value[key];
          on[key] = existing ? [].concat(existing, ours) : ours;
        }
      }
    }
    return data
  }

  /*  */

  function resolveScopedSlots (
    fns, // see flow/vnode
    res,
    // the following are added in 2.6
    hasDynamicKeys,
    contentHashKey
  ) {
    res = res || { $stable: !hasDynamicKeys };
    for (var i = 0; i < fns.length; i++) {
      var slot = fns[i];
      if (Array.isArray(slot)) {
        resolveScopedSlots(slot, res, hasDynamicKeys);
      } else if (slot) {
        // marker for reverse proxying v-slot without scope on this.$slots
        if (slot.proxy) {
          slot.fn.proxy = true;
        }
        res[slot.key] = slot.fn;
      }
    }
    if (contentHashKey) {
      (res).$key = contentHashKey;
    }
    return res
  }

  /*  */

  function bindDynamicKeys (baseObj, values) {
    for (var i = 0; i < values.length; i += 2) {
      var key = values[i];
      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      } else if ( key !== '' && key !== null) {
        // null is a special value for explicitly removing a binding
        warn(
          ("Invalid value for dynamic directive argument (expected string or null): " + key),
          this
        );
      }
    }
    return baseObj
  }

  // helper to dynamically append modifier runtime markers to event names.
  // ensure only append when value is already string, otherwise it will be cast
  // to string and cause the type check to miss.
  function prependModifier (value, symbol) {
    return typeof value === 'string' ? symbol + value : value
  }

  /*  */

  function installRenderHelpers (target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
  }

  /*  */

  function FunctionalRenderContext (
    data,
    props,
    children,
    parent,
    Ctor
  ) {
    var this$1 = this;

    var options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var contextVm;
    if (hasOwn(parent, '_uid')) {
      contextVm = Object.create(parent);
      // $flow-disable-line
      contextVm._original = parent;
    } else {
      // the context vm passed in is a functional context as well.
      // in this case we want to make sure we are able to get a hold to the
      // real context instance.
      contextVm = parent;
      // $flow-disable-line
      parent = parent._original;
    }
    var isCompiled = isTrue(options._compiled);
    var needNormalization = !isCompiled;

    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = function () {
      if (!this$1.$slots) {
        normalizeScopedSlots(
          data.scopedSlots,
          this$1.$slots = resolveSlots(children, parent)
        );
      }
      return this$1.$slots
    };

    Object.defineProperty(this, 'scopedSlots', ({
      enumerable: true,
      get: function get () {
        return normalizeScopedSlots(data.scopedSlots, this.slots())
      }
    }));

    // support for compiled functional template
    if (isCompiled) {
      // exposing $options for renderStatic()
      this.$options = options;
      // pre-resolve slots for renderSlot()
      this.$slots = this.slots();
      this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
    }

    if (options._scopeId) {
      this._c = function (a, b, c, d) {
        var vnode = createElement(contextVm, a, b, c, d, needNormalization);
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        return vnode
      };
    } else {
      this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
    }
  }

  installRenderHelpers(FunctionalRenderContext.prototype);

  function createFunctionalComponent (
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
      if (isDef(data.props)) { mergeProps(props, data.props); }
    }

    var renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    var vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
    } else if (Array.isArray(vnode)) {
      var vnodes = normalizeChildren(vnode) || [];
      var res = new Array(vnodes.length);
      for (var i = 0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
      }
      return res
    }
  }

  function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    var clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    {
      (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
    }
    if (data.slot) {
      (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone
  }

  function mergeProps (to, from) {
    for (var key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */

  /*  */

  /*  */

  /*  */

  // inline hooks to be invoked on component VNodes during patch
  var componentVNodeHooks = {
    init: function init (vnode, hydrating) {
      if (
        vnode.componentInstance &&
        !vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ) {
        // kept-alive components, treat as a patch
        var mountedNode = vnode; // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode);
      } else {
        var child = vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance
        );
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      }
    },

    prepatch: function prepatch (oldVnode, vnode) {
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
      );
    },

    insert: function insert (vnode) {
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    destroy: function destroy (vnode) {
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
  };

  var hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      {
        warn(("Invalid Component definition: " + (String(Ctor))), context);
      }
      return
    }

    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractPropsFromVNodeData(data, Ctor, tag);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      var slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
      asyncFactory
    );

    return vnode
  }

  function createComponentInstanceForVnode (
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent // activeInstance in lifecycle state
  ) {
    var options = {
      _isComponent: true,
      _parentVnode: vnode,
      parent: parent
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options)
  }

  function installComponentHooks (data) {
    var hooks = data.hook || (data.hook = {});
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var existing = hooks[key];
      var toMerge = componentVNodeHooks[key];
      if (existing !== toMerge && !(existing && existing._merged)) {
        hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
      }
    }
  }

  function mergeHook$1 (f1, f2) {
    var merged = function (a, b) {
      // flow complains about extra args which is why we use any
      f1(a, b);
      f2(a, b);
    };
    merged._merged = true;
    return merged
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel (options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input'
    ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
      if (
        Array.isArray(existing)
          ? existing.indexOf(callback) === -1
          : existing !== callback
      ) {
        on[event] = [callback].concat(existing);
      }
    } else {
      on[event] = callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement (
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType)
  }

  function _createElement (
    context,
    tag,
    data,
    children,
    normalizationType
  ) {
    if (isDef(data) && isDef((data).__ob__)) {
       warn(
        "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
        'Always create fresh vnode data objects in each render!',
        context
      );
      return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode()
    }
    // warn against non-primitive key
    if (
      isDef(data) && isDef(data.key) && !isPrimitive(data.key)
    ) {
      {
        warn(
          'Avoid using non-primitive value as key, ' +
          'use string/number value instead.',
          context
        );
      }
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
      typeof children[0] === 'function'
    ) {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
      var Ctor;
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        if ( isDef(data) && isDef(data.nativeOn)) {
          warn(
            ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
            context
          );
        }
        vnode = new VNode(
          config.parsePlatformTagName(tag), data, children,
          undefined, undefined, context
        );
      } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(
          tag, data, children,
          undefined, undefined, context
        );
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (Array.isArray(vnode)) {
      return vnode
    } else if (isDef(vnode)) {
      if (isDef(ns)) { applyNS(vnode, ns); }
      if (isDef(data)) { registerDeepBindings(data); }
      return vnode
    } else {
      return createEmptyVNode()
    }
  }

  function applyNS (vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      ns = undefined;
      force = true;
    }
    if (isDef(vnode.children)) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (isDef(child.tag) && (
          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
          applyNS(child, ns, force);
        }
      }
    }
  }

  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings (data) {
    if (isObject(data.style)) {
      traverse(data.style);
    }
    if (isObject(data.class)) {
      traverse(data.class);
    }
  }

  /*  */

  function initRender (vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
      defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
        !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
      }, true);
      defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
        !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
      }, true);
    }
  }

  var currentRenderingInstance = null;

  function renderMixin (Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var _parentVnode = ref._parentVnode;

      if (_parentVnode) {
        vm.$scopedSlots = normalizeScopedSlots(
          _parentVnode.data.scopedSlots,
          vm.$slots,
          vm.$scopedSlots
        );
      }

      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        // There's no need to maintain a stack because all render fns are called
        // separately from one another. Nested component's render fns are called
        // when parent component is patched.
        currentRenderingInstance = vm;
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, "render");
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        if ( vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } finally {
        currentRenderingInstance = null;
      }
      // if the returned array contains only a single node, allow it
      if (Array.isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0];
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        if ( Array.isArray(vnode)) {
          warn(
            'Multiple root nodes returned from render function. Render function ' +
            'should return a single root node.',
            vm
          );
        }
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode
    };
  }

  /*  */

  function ensureCtor (comp, base) {
    if (
      comp.__esModule ||
      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
      comp = comp.default;
    }
    return isObject(comp)
      ? base.extend(comp)
      : comp
  }

  function createAsyncPlaceholder (
    factory,
    data,
    context,
    children,
    tag
  ) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node
  }

  function resolveAsyncComponent (
    factory,
    baseCtor
  ) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp
    }

    if (isDef(factory.resolved)) {
      return factory.resolved
    }

    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
      // already pending
      factory.owners.push(owner);
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp
    }

    if (owner && !isDef(factory.owners)) {
      var owners = factory.owners = [owner];
      var sync = true;
      var timerLoading = null;
      var timerTimeout = null

      ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

      var forceRender = function (renderCompleted) {
        for (var i = 0, l = owners.length; i < l; i++) {
          (owners[i]).$forceUpdate();
        }

        if (renderCompleted) {
          owners.length = 0;
          if (timerLoading !== null) {
            clearTimeout(timerLoading);
            timerLoading = null;
          }
          if (timerTimeout !== null) {
            clearTimeout(timerTimeout);
            timerTimeout = null;
          }
        }
      };

      var resolve = once(function (res) {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender(true);
        } else {
          owners.length = 0;
        }
      });

      var reject = once(function (reason) {
         warn(
          "Failed to resolve async component: " + (String(factory)) +
          (reason ? ("\nReason: " + reason) : '')
        );
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender(true);
        }
      });

      var res = factory(resolve, reject);

      if (isObject(res)) {
        if (isPromise(res)) {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isPromise(res.component)) {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              timerLoading = setTimeout(function () {
                timerLoading = null;
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender(false);
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            timerTimeout = setTimeout(function () {
              timerTimeout = null;
              if (isUndef(factory.resolved)) {
                reject(
                   ("timeout (" + (res.timeout) + "ms)")
                    
                );
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading
        ? factory.loadingComp
        : factory.resolved
    }
  }

  /*  */

  function isAsyncPlaceholder (node) {
    return node.isComment && node.asyncFactory
  }

  /*  */

  function getFirstComponentChild (children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }

  /*  */

  /*  */

  function initEvents (vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  var target;

  function add (event, fn) {
    target.$on(event, fn);
  }

  function remove$1 (event, fn) {
    target.$off(event, fn);
  }

  function createOnceHandler (event, fn) {
    var _target = target;
    return function onceHandler () {
      var res = fn.apply(null, arguments);
      if (res !== null) {
        _target.$off(event, onceHandler);
      }
    }
  }

  function updateComponentListeners (
    vm,
    listeners,
    oldListeners
  ) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
    target = undefined;
  }

  function eventsMixin (Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          vm.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on () {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
          vm.$off(event[i$1], fn);
        }
        return vm
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (!fn) {
        vm._events[event] = null;
        return vm
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      {
        var lowerCaseEvent = event.toLowerCase();
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
          tip(
            "Event \"" + lowerCaseEvent + "\" is emitted in component " +
            (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
            "Note that HTML attributes are case-insensitive and you cannot use " +
            "v-on to listen to camelCase events when using in-DOM templates. " +
            "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
          );
        }
      }
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        var info = "event handler for \"" + event + "\"";
        for (var i = 0, l = cbs.length; i < l; i++) {
          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
      }
      return vm
    };
  }

  /*  */

  var activeInstance = null;
  var isUpdatingChildComponent = false;

  function setActiveInstance(vm) {
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    return function () {
      activeInstance = prevActiveInstance;
    }
  }

  function initLifecycle (vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      var prevEl = vm.$el;
      var prevVnode = vm._vnode;
      var restoreActiveInstance = setActiveInstance(vm);
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      restoreActiveInstance();
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
      // fire destroyed hook
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // release circular reference (#6759)
      if (vm.$vnode) {
        vm.$vnode.parent = null;
      }
    };
  }

  function mountComponent (
    vm,
    el,
    hydrating
  ) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
      {
        /* istanbul ignore if */
        if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
          vm.$options.el || el) {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          );
        }
      }
    }
    callHook(vm, 'beforeMount');

    var updateComponent;
    /* istanbul ignore if */
    if ( config.performance && mark) {
      updateComponent = function () {
        var name = vm._name;
        var id = vm._uid;
        var startTag = "vue-perf-start:" + id;
        var endTag = "vue-perf-end:" + id;

        mark(startTag);
        var vnode = vm._render();
        mark(endTag);
        measure(("vue " + name + " render"), startTag, endTag);

        mark(startTag);
        vm._update(vnode, hydrating);
        mark(endTag);
        measure(("vue " + name + " patch"), startTag, endTag);
      };
    } else {
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, {
      before: function before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function updateChildComponent (
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    {
      isUpdatingChildComponent = true;
    }

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren.

    // check if there are dynamic scopedSlots (hand-written or compiled but with
    // dynamic slot names). Static scoped slots compiled from template has the
    // "$stable" marker.
    var newScopedSlots = parentVnode.data.scopedSlots;
    var oldScopedSlots = vm.$scopedSlots;
    var hasDynamicScopedSlot = !!(
      (newScopedSlots && !newScopedSlots.$stable) ||
      (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
      (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
    );

    // Any static slot children from the parent may have changed during parent's
    // update. Dynamic scoped slots may also have changed. In such cases, a forced
    // update is necessary to ensure correctness.
    var needsForceUpdate = !!(
      renderChildren ||               // has new static slots
      vm.$options._renderChildren ||  // has old static slots
      hasDynamicScopedSlot
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;

    // update props
    if (propsData && vm.$options.props) {
      toggleObserving(false);
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        var propOptions = vm.$options.props; // wtf flow?
        props[key] = validateProp(key, propOptions, propsData, vm);
      }
      toggleObserving(true);
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    listeners = listeners || emptyObject;
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);

    // resolve slots + force update if has children
    if (needsForceUpdate) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }

    {
      isUpdatingChildComponent = false;
    }
  }

  function isInInactiveTree (vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) { return true }
    }
    return false
  }

  function activateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return
      }
    } else if (vm._directInactive) {
      return
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook (vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }

  /*  */

  var MAX_UPDATE_COUNT = 100;

  var queue = [];
  var activatedChildren = [];
  var has = {};
  var circular = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  var currentFlushTimestamp = 0;

  // Async edge case fix requires storing an event listener's attach timestamp.
  var getNow = Date.now;

  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  // All IE versions use low-res event timestamps, and have problematic clock
  // implementations (#9632)
  if (inBrowser && !isIE) {
    var performance = window.performance;
    if (
      performance &&
      typeof performance.now === 'function' &&
      getNow() > document.createEvent('Event').timeStamp
    ) {
      // if the event timestamp, although evaluated AFTER the Date.now(), is
      // smaller than it, it means the event is using a hi-res timestamp,
      // and we need to use the hi-res version for event listener timestamps as
      // well.
      getNow = function () { return performance.now(); };
    }
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    currentFlushTimestamp = getNow();
    flushing = true;
    var watcher, id;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) { return a.id - b.id; });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      if (watcher.before) {
        watcher.before();
      }
      id = watcher.id;
      has[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if ( has[id] != null) {
        circular[id] = (circular[id] || 0) + 1;
        if (circular[id] > MAX_UPDATE_COUNT) {
          warn(
            'You may have an infinite update loop ' + (
              watcher.user
                ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                : "in a component render function."
            ),
            watcher.vm
          );
          break
        }
      }
    }

    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  function callUpdatedHooks (queue) {
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'updated');
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent (vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks (queue) {
    for (var i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher (watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;

        if ( !config.async) {
          flushSchedulerQueue();
          return
        }
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */



  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression =  expOrFn.toString()
      ;
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
         warn(
          "Failed watching path: \"" + expOrFn + "\" " +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        );
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get () {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var i = this.deps.length;
    while (i--) {
      var dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  };

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps (vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false);
    }
    var loop = function ( key ) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        var hyphenatedKey = hyphenate(key);
        if (isReservedAttribute(hyphenatedKey) ||
            config.isReservedAttr(hyphenatedKey)) {
          warn(
            ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
            vm
          );
        }
        defineReactive$$1(props, key, value, function () {
          if (!isRoot && !isUpdatingChildComponent) {
            warn(
              "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              "value. Prop being mutated: \"" + key + "\"",
              vm
            );
          }
        });
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) loop( key );
    toggleObserving(true);
  }

  function initData (vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
       warn(
        'data functions should return an object:\n' +
        'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      );
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      {
        if (methods && hasOwn(methods, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a data property."),
            vm
          );
        }
      }
      if (props && hasOwn(props, key)) {
         warn(
          "The data property \"" + key + "\" is already declared as a prop. " +
          "Use prop default value instead.",
          vm
        );
      } else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  function getData (data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, "data()");
      return {}
    } finally {
      popTarget();
    }
  }

  var computedWatcherOptions = { lazy: true };

  function initComputed (vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if ( getter == null) {
        warn(
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      } else {
        if (key in vm.$data) {
          warn(("The computed property \"" + key + "\" is already defined in data."), vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
        }
      }
    }
  }

  function defineComputed (
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (
        sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function createGetterInvoker(fn) {
    return function computedGetter () {
      return fn.call(this, this)
    }
  }

  function initMethods (vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      {
        if (typeof methods[key] !== 'function') {
          warn(
            "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
            "Did you reference the function correctly?",
            vm
          );
        }
        if (props && hasOwn(props, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a prop."),
            vm
          );
        }
        if ((key in vm) && isReserved(key)) {
          warn(
            "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
            "Avoid defining component methods that start with _ or $."
          );
        }
      }
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
  }

  function initWatch (vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher (
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }

  function stateMixin (Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () { return this._data };
    var propsDef = {};
    propsDef.get = function () { return this._props };
    {
      dataDef.set = function () {
        warn(
          'Avoid replacing instance root $data. ' +
          'Use nested data properties instead.',
          this
        );
      };
      propsDef.set = function () {
        warn("$props is readonly.", this);
      };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      var vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        try {
          cb.call(vm, watcher.value);
        } catch (error) {
          handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
        }
      }
      return function unwatchFn () {
        watcher.teardown();
      }
    };
  }

  /*  */

  var uid$3 = 0;

  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$3++;

      var startTag, endTag;
      /* istanbul ignore if */
      if ( config.performance && mark) {
        startTag = "vue-perf-start:" + (vm._uid);
        endTag = "vue-perf-end:" + (vm._uid);
        mark(startTag);
      }

      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      {
        initProxy(vm);
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      /* istanbul ignore if */
      if ( config.performance && mark) {
        vm._name = formatComponentName(vm, false);
        mark(endTag);
        measure(("vue " + (vm._name) + " init"), startTag, endTag);
      }

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;

    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = resolveConstructorOptions(Ctor.super);
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }

  function resolveModifiedOptions (Ctor) {
    var modified;
    var latest = Ctor.options;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) { modified = {}; }
        modified[key] = latest[key];
      }
    }
    return modified
  }

  function Vue (options) {
    if (
      !(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  /*  */

  function initUse (Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
  }

  /*  */

  function initMixin$1 (Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this
    };
  }

  /*  */

  function initExtend (Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
      }

      var name = extendOptions.name || Super.options.name;
      if ( name) {
        validateComponentName(name);
      }

      var Sub = function VueComponent (options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }

  function initProps$1 (Comp) {
    var props = Comp.options.props;
    for (var key in props) {
      proxy(Comp.prototype, "_props", key);
    }
  }

  function initComputed$1 (Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters (Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          /* istanbul ignore if */
          if ( type === 'component') {
            validateComponentName(id);
          }
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition
        }
      };
    });
  }

  /*  */



  function getComponentName (opts) {
    return opts && (opts.Ctor.options.name || opts.tag)
  }

  function matches (pattern, name) {
    if (Array.isArray(pattern)) {
      return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
      return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
  }

  function pruneCache (keepAliveInstance, filter) {
    var cache = keepAliveInstance.cache;
    var keys = keepAliveInstance.keys;
    var _vnode = keepAliveInstance._vnode;
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          pruneCacheEntry(cache, key, keys, _vnode);
        }
      }
    }
  }

  function pruneCacheEntry (
    cache,
    key,
    keys,
    current
  ) {
    var cached$$1 = cache[key];
    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
      cached$$1.componentInstance.$destroy();
    }
    cache[key] = null;
    remove(keys, key);
  }

  var patternTypes = [String, RegExp, Array];

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes,
      max: [String, Number]
    },

    created: function created () {
      this.cache = Object.create(null);
      this.keys = [];
    },

    destroyed: function destroyed () {
      for (var key in this.cache) {
        pruneCacheEntry(this.cache, key, this.keys);
      }
    },

    mounted: function mounted () {
      var this$1 = this;

      this.$watch('include', function (val) {
        pruneCache(this$1, function (name) { return matches(val, name); });
      });
      this.$watch('exclude', function (val) {
        pruneCache(this$1, function (name) { return !matches(val, name); });
      });
    },

    render: function render () {
      var slot = this.$slots.default;
      var vnode = getFirstComponentChild(slot);
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        var name = getComponentName(componentOptions);
        var ref = this;
        var include = ref.include;
        var exclude = ref.exclude;
        if (
          // not included
          (include && (!name || !matches(include, name))) ||
          // excluded
          (exclude && name && matches(exclude, name))
        ) {
          return vnode
        }

        var ref$1 = this;
        var cache = ref$1.cache;
        var keys = ref$1.keys;
        var key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
          : vnode.key;
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance;
          // make current key freshest
          remove(keys, key);
          keys.push(key);
        } else {
          cache[key] = vnode;
          keys.push(key);
          // prune oldest entry
          if (this.max && keys.length > parseInt(this.max)) {
            pruneCacheEntry(cache, keys[0], keys, this._vnode);
          }
        }

        vnode.data.keepAlive = true;
      }
      return vnode || (slot && slot[0])
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /*  */

  function initGlobalAPI (Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    {
      configDef.set = function () {
        warn(
          'Do not replace the Vue.config object, set individual fields instead.'
        );
      };
    }
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive$$1
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    // 2.6 explicit observable API
    Vue.observable = function (obj) {
      observe(obj);
      return obj
    };

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);

  Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
  });

  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function get () {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext
    }
  });

  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  });

  Vue.version = '2.6.11';

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select,progress');
  var mustUseProp = function (tag, type, attr) {
    return (
      (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
      (attr === 'selected' && tag === 'option') ||
      (attr === 'checked' && tag === 'input') ||
      (attr === 'muted' && tag === 'video')
    )
  };

  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

  var convertEnumeratedValue = function (key, value) {
    return isFalsyAttrValue(value) || value === 'false'
      ? 'false'
      // allow arbitrary string value for contenteditable
      : key === 'contenteditable' && isValidContentEditableValue(value)
        ? value
        : 'true'
  };

  var isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
  );

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false
  };

  /*  */

  function genClassForVnode (vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode && parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class)
  }

  function mergeClassData (child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class)
        ? [child.class, parent.class]
        : parent.class
    }
  }

  function renderClass (
    staticClass,
    dynamicClass
  ) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  function concat (a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  function stringifyClass (value) {
    if (Array.isArray(value)) {
      return stringifyArray(value)
    }
    if (isObject(value)) {
      return stringifyObject(value)
    }
    if (typeof value === 'string') {
      return value
    }
    /* istanbul ignore next */
    return ''
  }

  function stringifyArray (value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) { res += ' '; }
        res += stringified;
      }
    }
    return res
  }

  function stringifyObject (value) {
    var res = '';
    for (var key in value) {
      if (value[key]) {
        if (res) { res += ' '; }
        res += key;
      }
    }
    return res
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  var isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );

  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  };

  function getTagNamespace (tag) {
    if (isSVG(tag)) {
      return 'svg'
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math'
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement (tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true
    }
    if (isReservedTag(tag)) {
      return false
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag]
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] = (
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ))
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
    }
  }

  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query (el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
         warn(
          'Cannot find element: ' + el
        );
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
  }

  /*  */

  function createElement$1 (tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm
  }

  function createElementNS (namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  function createTextNode (text) {
    return document.createTextNode(text)
  }

  function createComment (text) {
    return document.createComment(text)
  }

  function insertBefore (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild (node, child) {
    node.removeChild(child);
  }

  function appendChild (node, child) {
    node.appendChild(child);
  }

  function parentNode (node) {
    return node.parentNode
  }

  function nextSibling (node) {
    return node.nextSibling
  }

  function tagName (node) {
    return node.tagName
  }

  function setTextContent (node, text) {
    node.textContent = text;
  }

  function setStyleScope (node, scopeId) {
    node.setAttribute(scopeId, '');
  }

  var nodeOps = /*#__PURE__*/Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  });

  /*  */

  var ref = {
    create: function create (_, vnode) {
      registerRef(vnode);
    },
    update: function update (oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy (vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef (vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) { return }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  function sameVnode (a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  function sameInputType (a, b) {
    if (a.tag !== 'input') { return true }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }

  function createKeyToOldIdx (children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) { map[key] = i; }
    }
    return map
  }

  function createPatchFunction (backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    function emptyNodeAt (elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createRmCb (childElm, listeners) {
      function remove$$1 () {
        if (--remove$$1.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1
    }

    function removeNode (el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (isDef(parent)) {
        nodeOps.removeChild(parent, el);
      }
    }

    function isUnknownElement$$1 (vnode, inVPre) {
      return (
        !inVPre &&
        !vnode.ns &&
        !(
          config.ignoredElements.length &&
          config.ignoredElements.some(function (ignore) {
            return isRegExp(ignore)
              ? ignore.test(vnode.tag)
              : ignore === vnode.tag
          })
        ) &&
        config.isUnknownElement(vnode.tag)
      )
    }

    var creatingElmInVPre = 0;

    function createElm (
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      vnode.isRootInsert = !nested; // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
      }

      var data = vnode.data;
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {
        {
          if (data && data.pre) {
            creatingElmInVPre++;
          }
          if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
            warn(
              'Unknown custom element: <' + tag + '> - did you ' +
              'register the component correctly? For recursive components, ' +
              'make sure to provide the "name" option.',
              vnode.context
            );
          }
        }

        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode);
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue);
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }

        if ( data && data.pre) {
          creatingElmInVPre--;
        }
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i = vnode.data;
      if (isDef(i)) {
        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
          i(vnode, false /* hydrating */);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue);
          insert(parentElm, vnode.elm, refElm);
          if (isTrue(isReactivated)) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true
        }
      }
    }

    function initComponent (vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
      }
      vnode.elm = vnode.componentInstance.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i;
      // hack for #4339: a reactivated component with inner transition
      // does not trigger because the inner node's created hooks are not called
      // again. It's not ideal to involve module-specific logic in here but
      // there doesn't seem to be a better way to do it.
      var innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    function insert (parent, elm, ref$$1) {
      if (isDef(parent)) {
        if (isDef(ref$$1)) {
          if (nodeOps.parentNode(ref$$1) === parent) {
            nodeOps.insertBefore(parent, elm, ref$$1);
          }
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren (vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        {
          checkDuplicateKeys(children);
        }
        for (var i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
      }
    }

    function isPatchable (vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag)
    }

    function invokeCreateHooks (vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (isDef(i.create)) { i.create(emptyNode, vnode); }
        if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope (vnode) {
      var i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }

    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
      }
    }

    function invokeDestroyHook (vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
        for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes (vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else { // Text node
            removeNode(ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook (vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        var i;
        var listeners = cbs.remove.length + 1;
        if (isDef(rm)) {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        } else {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeNode(vnode.elm);
      }
    }

    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      {
        checkDuplicateKeys(newCh);
      }

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            vnodeToMove = oldCh[idxInOld];
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function checkDuplicateKeys (children) {
      var seenKeys = {};
      for (var i = 0; i < children.length; i++) {
        var vnode = children[i];
        var key = vnode.key;
        if (isDef(key)) {
          if (seenKeys[key]) {
            warn(
              ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
              vnode.context
            );
          } else {
            seenKeys[key] = true;
          }
        }
      }
    }

    function findIdxInOld (node, oldCh, start, end) {
      for (var i = start; i < end; i++) {
        var c = oldCh[i];
        if (isDef(c) && sameVnode(node, c)) { return i }
      }
    }

    function patchVnode (
      oldVnode,
      vnode,
      insertedVnodeQueue,
      ownerArray,
      index,
      removeOnly
    ) {
      if (oldVnode === vnode) {
        return
      }

      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // clone reused vnode
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      var elm = vnode.elm = oldVnode.elm;

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return
      }

      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return
      }

      var i;
      var data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
        } else if (isDef(ch)) {
          {
            checkDuplicateKeys(ch);
          }
          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }

    function invokeInsertHook (vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (isTrue(initial) && isDef(vnode.parent)) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }

    var hydrationBailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
      var i;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      inVPre = inVPre || (data && data.pre);
      vnode.elm = elm;

      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true;
        return true
      }
      // assert node match
      {
        if (!assertNodeMatch(elm, vnode, inVPre)) {
          return false
        }
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            // v-html and domProps: innerHTML
            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
              if (i !== elm.innerHTML) {
                /* istanbul ignore if */
                if (
                  typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('server innerHTML: ', i);
                  console.warn('client innerHTML: ', elm.innerHTML);
                }
                return false
              }
            } else {
              // iterate and compare children lists
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                  childrenMatch = false;
                  break
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                /* istanbul ignore if */
                if (
                  typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                }
                return false
              }
            }
          }
        }
        if (isDef(data)) {
          var fullInvoke = false;
          for (var key in data) {
            if (!isRenderedModule(key)) {
              fullInvoke = true;
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break
            }
          }
          if (!fullInvoke && data['class']) {
            // ensure collecting deps for deep class bindings for future updates
            traverse(data['class']);
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true
    }

    function assertNodeMatch (node, vnode, inVPre) {
      if (isDef(vnode.tag)) {
        return vnode.tag.indexOf('vue-component') === 0 || (
          !isUnknownElement$$1(vnode, inVPre) &&
          vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
        )
      } else {
        return node.nodeType === (vnode.isComment ? 8 : 3)
      }
    }

    return function patch (oldVnode, vnode, hydrating, removeOnly) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
        return
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR);
              hydrating = true;
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode
              } else {
                warn(
                  'The client-side rendered virtual DOM tree is not matching ' +
                  'server-rendered content. This is likely caused by incorrect ' +
                  'HTML markup, for example nesting block-level elements inside ' +
                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
                  'full client-side render.'
                );
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }

          // replacing existing element
          var oldElm = oldVnode.elm;
          var parentElm = nodeOps.parentNode(oldElm);

          // create new node
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm)
          );

          // update parent placeholder node element, recursively
          if (isDef(vnode.parent)) {
            var ancestor = vnode.parent;
            var patchable = isPatchable(vnode);
            while (ancestor) {
              for (var i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor);
              }
              ancestor.elm = vnode.elm;
              if (patchable) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, ancestor);
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                var insert = ancestor.data.hook.insert;
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                    insert.fns[i$2]();
                  }
                }
              } else {
                registerRef(ancestor);
              }
              ancestor = ancestor.parent;
            }
          }

          // destroy old node
          if (isDef(parentElm)) {
            removeVnodes([oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm
    }
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives (vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives (oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update (oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        dir.oldArg = oldDir.arg;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function () {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) {
        mergeVNodeHook(vnode, 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives$1 (
    dirs,
    vm
  ) {
    var res = Object.create(null);
    if (!dirs) {
      // $flow-disable-line
      return res
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        // $flow-disable-line
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    // $flow-disable-line
    return res
  }

  function getRawDirName (dir) {
    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
  }

  function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
      } catch (e) {
        handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
      }
    }
  }

  var baseModules = [
    ref,
    directives
  ];

  /*  */

  function updateAttrs (oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr (el, key, value) {
    if (el.tagName.indexOf('-') > -1) {
      baseSetAttr(el, key, value);
    } else if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        // technically allowfullscreen is a boolean attribute for <iframe>,
        // but Flash expects a value of "true" when used on <embed> tag
        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
          ? 'true'
          : key;
        el.setAttribute(key, value);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, convertEnumeratedValue(key, value));
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      baseSetAttr(el, key, value);
    }
  }

  function baseSetAttr (el, key, value) {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && value !== '' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass (oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (
      isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
    ) {
      return
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  /*  */

  /*  */

  /*  */

  /*  */

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents (on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      var event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function createOnceHandler$1 (event, handler, capture) {
    var _target = target$1; // save current target element in closure
    return function onceHandler () {
      var res = handler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, onceHandler, capture, _target);
      }
    }
  }

  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
  // implementation and does not fire microtasks in between event propagation, so
  // safe to exclude.
  var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

  function add$1 (
    name,
    handler,
    capture,
    passive
  ) {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    if (useMicrotaskFix) {
      var attachedTimestamp = currentFlushTimestamp;
      var original = handler;
      handler = original._wrapper = function (e) {
        if (
          // no bubbling, should always fire.
          // this is just a safety net in case event.timeStamp is unreliable in
          // certain weird environments...
          e.target === e.currentTarget ||
          // event is fired after handler attachment
          e.timeStamp >= attachedTimestamp ||
          // bail for environments that have buggy event.timeStamp implementations
          // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
          // #9681 QtWebEngine event.timeStamp is negative value
          e.timeStamp <= 0 ||
          // #9448 bail if event is fired in another document in a multi-page
          // electron/nw.js app, since event.timeStamp will be using a different
          // starting reference
          e.target.ownerDocument !== document
        ) {
          return original.apply(this, arguments)
        }
      };
    }
    target$1.addEventListener(
      name,
      handler,
      supportsPassive
        ? { capture: capture, passive: passive }
        : capture
    );
  }

  function remove$2 (
    name,
    handler,
    capture,
    _target
  ) {
    (_target || target$1).removeEventListener(
      name,
      handler._wrapper || handler,
      capture
    );
  }

  function updateDOMListeners (oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
    target$1 = undefined;
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  var svgContainer;

  function updateDOMProps (oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (!(key in props)) {
        elm[key] = '';
      }
    }

    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) { vnode.children.length = 0; }
        if (cur === oldProps[key]) { continue }
        // #6601 work around Chrome version <= 55 bug where single textNode
        // replaced by innerHTML/textContent retains its parentNode property
        if (elm.childNodes.length === 1) {
          elm.removeChild(elm.childNodes[0]);
        }
      }

      if (key === 'value' && elm.tagName !== 'PROGRESS') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, strCur)) {
          elm.value = strCur;
        }
      } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
        // IE doesn't support innerHTML for SVG elements
        svgContainer = svgContainer || document.createElement('div');
        svgContainer.innerHTML = "<svg>" + cur + "</svg>";
        var svg = svgContainer.firstChild;
        while (elm.firstChild) {
          elm.removeChild(elm.firstChild);
        }
        while (svg.firstChild) {
          elm.appendChild(svg.firstChild);
        }
      } else if (
        // skip the update if old and new VDOM state is the same.
        // `value` is handled separately because the DOM value may be temporarily
        // out of sync with VDOM state due to focus, composition and modifiers.
        // This  #4521 by skipping the unnecesarry `checked` update.
        cur !== oldProps[key]
      ) {
        // some property updates can throw
        // e.g. `value` on <progress> w/ non-finite value
        try {
          elm[key] = cur;
        } catch (e) {}
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue (elm, checkVal) {
    return (!elm.composing && (
      elm.tagName === 'OPTION' ||
      isNotInFocusAndDirty(elm, checkVal) ||
      isDirtyWithModifiers(elm, checkVal)
    ))
  }

  function isNotInFocusAndDirty (elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try { notInFocus = document.activeElement !== elm; } catch (e) {}
    return notInFocus && elm.value !== checkVal
  }

  function isDirtyWithModifiers (elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
      if (modifiers.number) {
        return toNumber(value) !== toNumber(newVal)
      }
      if (modifiers.trim) {
        return value.trim() !== newVal.trim()
      }
    }
    return value !== newVal
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData (data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding (bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle)
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle)
    }
    return bindingStyle
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle (vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (
          childNode && childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        ) {
          extend(res, styleData);
        }
      }
    }

    if ((styleData = normalizeStyleData(vnode.data))) {
      extend(res, styleData);
    }

    var parentNode = vnode;
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res
  }

  /*  */

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    } else {
      var normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (var i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit', 'Moz', 'ms'];

  var emptyStyle;
  var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in emptyStyle)) {
      return prop
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
      var name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name
      }
    }
  });

  function updateStyle (oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) &&
      isUndef(oldData.staticStyle) && isUndef(oldData.style)
    ) {
      return
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  var whitespaceRE = /\s+/;

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition (def$$1) {
    if (!def$$1) {
      return
    }
    /* istanbul ignore else */
    if (typeof def$$1 === 'object') {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1)
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: (name + "-enter"),
      enterToClass: (name + "-enter-to"),
      enterActiveClass: (name + "-enter-active"),
      leaveClass: (name + "-leave"),
      leaveToClass: (name + "-leave-to"),
      leaveActiveClass: (name + "-leave-active")
    }
  });

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : /* istanbul ignore next */ function (fn) { return fn(); };

  function nextFrame (fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass (el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass (el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds (
    el,
    expectedType,
    cb
  ) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) { return cb() }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo (el, expectedType) {
    var styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0
        ? transitionTimeout > animationTimeout
          ? TRANSITION
          : ANIMATION
        : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    }
  }

  function getTimeout (delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i])
    }))
  }

  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
  // in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
  // as a floor function) causing unexpected behaviors
  function toMs (s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000
  }

  /*  */

  function enter (vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
      return
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      context = transitionNode.context;
      transitionNode = transitionNode.parent;
    }

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return
    }

    var startClass = isAppear && appearClass
      ? appearClass
      : enterClass;
    var activeClass = isAppear && appearActiveClass
      ? appearActiveClass
      : enterActiveClass;
    var toClass = isAppear && appearToClass
      ? appearToClass
      : enterToClass;

    var beforeEnterHook = isAppear
      ? (beforeAppear || beforeEnter)
      : beforeEnter;
    var enterHook = isAppear
      ? (typeof appear === 'function' ? appear : enter)
      : enter;
    var afterEnterHook = isAppear
      ? (afterAppear || afterEnter)
      : afterEnter;
    var enterCancelledHook = isAppear
      ? (appearCancelled || enterCancelled)
      : enterCancelled;

    var explicitEnterDuration = toNumber(
      isObject(duration)
        ? duration.enter
        : duration
    );

    if ( explicitEnterDuration != null) {
      checkDuration(explicitEnterDuration, 'enter', vnode);
    }

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode, 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled) {
          addTransitionClass(el, toClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave (vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
      return rm()
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
      return
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(
      isObject(duration)
        ? duration.leave
        : duration
    );

    if ( isDef(explicitLeaveDuration)) {
      checkDuration(explicitLeaveDuration, 'leave', vnode);
    }

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave () {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show && el.parentNode) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  // only used in dev mode
  function checkDuration (val, name, vnode) {
    if (typeof val !== 'number') {
      warn(
        "<transition> explicit " + name + " duration is not a valid number - " +
        "got " + (JSON.stringify(val)) + ".",
        vnode.context
      );
    } else if (isNaN(val)) {
      warn(
        "<transition> explicit " + name + " duration is NaN - " +
        'the duration expression might be incorrect.',
        vnode.context
      );
    }
  }

  function isValidDuration (val) {
    return typeof val === 'number' && !isNaN(val)
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength (fn) {
    if (isUndef(fn)) {
      return false
    }
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(
        Array.isArray(invokerFns)
          ? invokerFns[0]
          : invokerFns
      )
    } else {
      return (fn._length || fn.length) > 1
    }
  }

  function _enter (_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1 (vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var directive = {
    inserted: function inserted (el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        // #6903
        if (oldVnode.elm && !oldVnode.elm._vOptions) {
          mergeVNodeHook(vnode, 'postpatch', function () {
            directive.componentUpdated(el, binding, vnode);
          });
        } else {
          setSelected(el, binding, vnode.context);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },

    componentUpdated: function componentUpdated (el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
          // trigger change event if
          // no matching option found for at least one value
          var needReset = el.multiple
            ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    }
  };

  function setSelected (el, binding, vm) {
    actuallySetSelected(el, binding, vm);
    /* istanbul ignore if */
    if (isIE || isEdge) {
      setTimeout(function () {
        actuallySetSelected(el, binding, vm);
      }, 0);
    }
  }

  function actuallySetSelected (el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
       warn(
        "<select multiple v-model=\"" + (binding.expression) + "\"> " +
        "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
        vm
      );
      return
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption (value, options) {
    return options.every(function (o) { return !looseEqual(o, value); })
  }

  function getValue (option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart (e) {
    e.target.composing = true;
  }

  function onCompositionEnd (e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) { return }
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger (el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode (vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }

  var show = {
    bind: function bind (el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update (el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (!value === !oldValue) { return }
      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind: function unbind (
      el,
      binding,
      vnode,
      oldVnode,
      isDestroy
    ) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: directive,
    show: show
  };

  /*  */

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild (vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData (comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1];
    }
    return data
  }

  function placeholder (h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      })
    }
  }

  function hasParentTransition (vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  function isSameChild (child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

  var isVShowDirective = function (d) { return d.name === 'show'; };

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render (h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(isNotTextNode);
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      // warn multiple elements
      if ( children.length > 1) {
        warn(
          '<transition> can only be used on a single element. Use ' +
          '<transition-group> for lists.',
          this.$parent
        );
      }

      var mode = this.mode;

      // warn invalid mode
      if (
        mode && mode !== 'in-out' && mode !== 'out-in'
      ) {
        warn(
          'invalid <transition> mode: ' + mode,
          this.$parent
        );
      }

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild
      }

      if (this._leaving) {
        return placeholder(h, rawChild)
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      var id = "__transition-" + (this._uid) + "-";
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
        : isPrimitive(child.key)
          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
          : child.key;

      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(isVShowDirective)) {
        child.data.show = true;
      }

      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        // #6687 component root is a comment node
        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
      ) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild.data.transition = extend({}, data);
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild
          }
          var delayedLeave;
          var performLeave = function () { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
        }
      }

      return rawChild
    }
  };

  /*  */

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    beforeMount: function beforeMount () {
      var this$1 = this;

      var update = this._update;
      this._update = function (vnode, hydrating) {
        var restoreActiveInstance = setActiveInstance(this$1);
        // force removing pass
        this$1.__patch__(
          this$1._vnode,
          this$1.kept,
          false, // hydrating
          true // removeOnly (!important, avoids unnecessary moves)
        );
        this$1._vnode = this$1.kept;
        restoreActiveInstance();
        update.call(this$1, vnode, hydrating);
      };
    },

    render: function render (h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c
            ;(c.data || (c.data = {})).transition = transitionData;
          } else {
            var opts = c.componentOptions;
            var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
            warn(("<transition-group> children must be keyed: <" + name + ">"));
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children)
    },

    updated: function updated () {
      var children = this.prevChildren;
      var moveClass = this.moveClass || ((this.name || 'v') + '-move');
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      // assign to this to avoid being removed in tree-shaking
      // $flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
            if (e && e.target !== el) {
              return
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove (el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return (this._hasMove = info.hasTransform)
      }
    }
  };

  function callPendingCbs (c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition (c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation (c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue.options.directives, platformDirectives);
  extend(Vue.options.components, platformComponents);

  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };

  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
    setTimeout(function () {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue);
        } else {
          console[console.info ? 'info' : 'log'](
            'Download the Vue Devtools extension for a better development experience:\n' +
            'https://github.com/vuejs/vue-devtools'
          );
        }
      }
      if (
        config.productionTip !== false &&
        typeof console !== 'undefined'
      ) {
        console[console.info ? 'info' : 'log'](
          "You are running Vue in development mode.\n" +
          "Make sure to turn on production mode when deploying for production.\n" +
          "See more tips at https://vuejs.org/guide/deployment.html"
        );
      }
    }, 0);
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var vueCustomElement = createCommonjsModule(function (module, exports) {
  /**
    * vue-custom-element v3.2.14
    * (c) 2020 Karol Fabjańczuk
    * @license MIT
    */
  (function (global, factory) {
  	 module.exports = factory() ;
  }(commonjsGlobal, (function () {
  /**
   * ES6 Object.getPrototypeOf Polyfill
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
   */

  Object.setPrototypeOf = Object.setPrototypeOf || setPrototypeOf;

  function setPrototypeOf(obj, proto) {
    obj.__proto__ = proto;
    return obj;
  }

  var setPrototypeOf_1 = setPrototypeOf.bind(Object);

  function isES2015() {
    if (typeof Symbol === 'undefined' || typeof Reflect === 'undefined' || typeof Proxy === 'undefined' || Object.isSealed(Proxy)) return false;

    return true;
  }

  var isES2015$1 = isES2015();

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function _CustomElement() {
    return Reflect.construct(HTMLElement, [], this.__proto__.constructor);
  }


  Object.setPrototypeOf(_CustomElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(_CustomElement, HTMLElement);
  function registerCustomElement(tag) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof customElements === 'undefined') {
      return;
    }

    function constructorCallback() {
      if (options.shadow === true && HTMLElement.prototype.attachShadow) {
        this.attachShadow({ mode: 'open' });
      }
      typeof options.constructorCallback === 'function' && options.constructorCallback.call(this);
    }
    function connectedCallback() {
      typeof options.connectedCallback === 'function' && options.connectedCallback.call(this);
    }

    function disconnectedCallback() {
      typeof options.disconnectedCallback === 'function' && options.disconnectedCallback.call(this);
    }

    function attributeChangedCallback(name, oldValue, value) {
      typeof options.attributeChangedCallback === 'function' && options.attributeChangedCallback.call(this, name, oldValue, value);
    }

    function define(tagName, CustomElement) {
      var existingCustomElement = customElements.get(tagName);
      return typeof existingCustomElement !== 'undefined' ? existingCustomElement : customElements.define(tagName, CustomElement);
    }

    if (isES2015$1) {
      var CustomElement = function (_CustomElement2) {
        _inherits(CustomElement, _CustomElement2);

        function CustomElement(self) {
          var _ret;

          _classCallCheck(this, CustomElement);

          var _this = _possibleConstructorReturn(this, (CustomElement.__proto__ || Object.getPrototypeOf(CustomElement)).call(this));

          var me = self ? HTMLElement.call(self) : _this;

          constructorCallback.call(me);
          return _ret = me, _possibleConstructorReturn(_this, _ret);
        }

        _createClass(CustomElement, null, [{
          key: 'observedAttributes',
          get: function get() {
            return options.observedAttributes || [];
          }
        }]);

        return CustomElement;
      }(_CustomElement);

      CustomElement.prototype.connectedCallback = connectedCallback;
      CustomElement.prototype.disconnectedCallback = disconnectedCallback;
      CustomElement.prototype.attributeChangedCallback = attributeChangedCallback;

      define(tag, CustomElement);
      return CustomElement;
    } else {
      var _CustomElement3 = function _CustomElement3(self) {
        var me = self ? HTMLElement.call(self) : this;

        constructorCallback.call(me);
        return me;
      };

      _CustomElement3.observedAttributes = options.observedAttributes || [];

      _CustomElement3.prototype = Object.create(HTMLElement.prototype, {
        constructor: {
          configurable: true,
          writable: true,
          value: _CustomElement3
        }
      });

      _CustomElement3.prototype.connectedCallback = connectedCallback;
      _CustomElement3.prototype.disconnectedCallback = disconnectedCallback;
      _CustomElement3.prototype.attributeChangedCallback = attributeChangedCallback;

      define(tag, _CustomElement3);
      return _CustomElement3;
    }
  }

  var camelizeRE = /-(\w)/g;
  var camelize = function camelize(str) {
    return str.replace(camelizeRE, function (_, c) {
      return c ? c.toUpperCase() : '';
    });
  };
  var hyphenateRE = /([^-])([A-Z])/g;
  var hyphenate = function hyphenate(str) {
    return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
  };

  function toArray(list) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function convertAttributeValue(value, overrideType) {
    if (value === null || value === undefined) {
      return overrideType === Boolean ? false : undefined;
    }
    var propsValue = value;
    var isBoolean = ['true', 'false'].indexOf(value) > -1;
    var valueParsed = parseFloat(propsValue, 10);
    var isNumber = !isNaN(valueParsed) && isFinite(propsValue) && typeof propsValue === 'string' && !propsValue.match(/^0+[^.]\d*$/g);

    if (overrideType && overrideType !== Boolean && (typeof propsValue === 'undefined' ? 'undefined' : _typeof(propsValue)) !== overrideType) {
      propsValue = overrideType(value);
    } else if (isBoolean || overrideType === Boolean) {
      propsValue = propsValue === '' ? true : propsValue === 'true' || propsValue === true;
    } else if (isNumber) {
      propsValue = valueParsed;
    }

    return propsValue;
  }

  function extractProps(collection, props) {
    if (collection && collection.length) {
      collection.forEach(function (prop) {
        var camelCaseProp = camelize(prop);
        props.camelCase.indexOf(camelCaseProp) === -1 && props.camelCase.push(camelCaseProp);
      });
    } else if (collection && (typeof collection === 'undefined' ? 'undefined' : _typeof(collection)) === 'object') {
      for (var prop in collection) {
        var camelCaseProp = camelize(prop);
        props.camelCase.indexOf(camelCaseProp) === -1 && props.camelCase.push(camelCaseProp);

        if (collection[camelCaseProp] && collection[camelCaseProp].type) {
          props.types[prop] = [].concat(collection[camelCaseProp].type)[0];
        }
      }
    }
  }

  function getProps() {
    var componentDefinition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var props = {
      camelCase: [],
      hyphenate: [],
      types: {}
    };

    if (componentDefinition.mixins) {
      componentDefinition.mixins.forEach(function (mixin) {
        extractProps(mixin.props, props);
      });
    }

    if (componentDefinition.extends && componentDefinition.extends.props) {
      var parentProps = componentDefinition.extends.props;


      extractProps(parentProps, props);
    }

    extractProps(componentDefinition.props, props);

    props.camelCase.forEach(function (prop) {
      props.hyphenate.push(hyphenate(prop));
    });

    return props;
  }

  function reactiveProps(element, props) {
    props.camelCase.forEach(function (name, index) {
      Object.defineProperty(element, name, {
        get: function get() {
          return this.__vue_custom_element__[name];
        },
        set: function set(value) {
          if (((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'function') && this.__vue_custom_element__) {
            var propName = props.camelCase[index];
            this.__vue_custom_element__[propName] = value;
          } else {
            var type = props.types[props.camelCase[index]];
            this.setAttribute(props.hyphenate[index], convertAttributeValue(value, type));
          }
        }
      });
    });
  }

  function getPropsData(element, componentDefinition, props) {
    var propsData = componentDefinition.propsData || {};

    props.hyphenate.forEach(function (name, index) {
      var propCamelCase = props.camelCase[index];
      var propValue = element.attributes[name] || element[propCamelCase];

      var type = null;
      if (props.types[propCamelCase]) {
        type = props.types[propCamelCase];
      }

      if (propValue instanceof Attr) {
        propsData[propCamelCase] = convertAttributeValue(propValue.value, type);
      } else if (typeof propValue !== 'undefined') {
        propsData[propCamelCase] = propValue;
      }
    });

    return propsData;
  }

  function getAttributes(children) {
    var attributes = {};

    toArray(children.attributes).forEach(function (attribute) {
      attributes[attribute.nodeName === 'vue-slot' ? 'slot' : attribute.nodeName] = attribute.nodeValue;
    });

    return attributes;
  }

  function getChildNodes(element) {
    if (element.childNodes.length) return element.childNodes;
    if (element.content && element.content.childNodes && element.content.childNodes.length) {
      return element.content.childNodes;
    }

    var placeholder = document.createElement('div');

    placeholder.innerHTML = element.innerHTML;

    return placeholder.childNodes;
  }

  function templateElement(createElement, element, elementOptions) {
    var templateChildren = getChildNodes(element);

    var vueTemplateChildren = toArray(templateChildren).map(function (child) {
      if (child.nodeName === '#text') return child.nodeValue;

      return createElement(child.tagName, {
        attrs: getAttributes(child),
        domProps: {
          innerHTML: child.innerHTML
        }
      });
    });

    elementOptions.slot = element.id;

    return createElement('template', elementOptions, vueTemplateChildren);
  }

  function getSlots() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var createElement = arguments[1];

    var slots = [];
    toArray(children).forEach(function (child) {
      if (child.nodeName === '#text') {
        if (child.nodeValue.trim()) {
          slots.push(createElement('span', child.nodeValue));
        }
      } else if (child.nodeName !== '#comment') {
        var attributes = getAttributes(child);
        var elementOptions = {
          attrs: attributes,
          domProps: {
            innerHTML: child.innerHTML === '' ? child.innerText : child.innerHTML
          }
        };

        if (attributes.slot) {
          elementOptions.slot = attributes.slot;
          attributes.slot = undefined;
        }

        var slotVueElement = child.tagName === 'TEMPLATE' ? templateElement(createElement, child, elementOptions) : createElement(child.tagName, elementOptions);

        slots.push(slotVueElement);
      }
    });

    return slots;
  }

  function customEvent(eventName, detail) {
    var params = { bubbles: false, cancelable: false, detail: detail };
    var event = void 0;
    if (typeof window.CustomEvent === 'function') {
      event = new CustomEvent(eventName, params);
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
    }
    return event;
  }

  function customEmit(element, eventName) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var event = customEvent(eventName, [].concat(args));
    element.dispatchEvent(event);
  }

  function createVueInstance(element, Vue, componentDefinition, props, options) {
    if (!element.__vue_custom_element__) {
      var beforeCreate = function beforeCreate() {
        this.$emit = function emit() {
          var _proto__$$emit;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          customEmit.apply(undefined, [element].concat(args));
          this.__proto__ && (_proto__$$emit = this.__proto__.$emit).call.apply(_proto__$$emit, [this].concat(args));
        };
      };

      var ComponentDefinition = Vue.util.extend({}, componentDefinition);
      var propsData = getPropsData(element, ComponentDefinition, props);
      var vueVersion = Vue.version && parseInt(Vue.version.split('.')[0], 10) || 0;

      ComponentDefinition.beforeCreate = [].concat(ComponentDefinition.beforeCreate || [], beforeCreate);

      if (ComponentDefinition._compiled) {
        var constructorOptions = {};
        var _constructor = ComponentDefinition._Ctor;
        if (_constructor) {
          constructorOptions = Object.keys(_constructor).map(function (key) {
            return _constructor[key];
          })[0].options;
        }
        constructorOptions.beforeCreate = ComponentDefinition.beforeCreate;
      }

      var rootElement = void 0;

      if (vueVersion >= 2) {
        var elementOriginalChildren = element.cloneNode(true).childNodes;
        rootElement = {
          propsData: propsData,
          props: props.camelCase,
          computed: {
            reactiveProps: function reactiveProps$$1() {
              var _this = this;

              var reactivePropsList = {};
              props.camelCase.forEach(function (prop) {
                typeof _this[prop] !== 'undefined' && (reactivePropsList[prop] = _this[prop]);
              });

              return reactivePropsList;
            }
          },
          render: function render(createElement) {
            var data = {
              props: this.reactiveProps
            };

            return createElement(ComponentDefinition, data, getSlots(elementOriginalChildren, createElement));
          }
        };
      } else if (vueVersion === 1) {
        rootElement = ComponentDefinition;
        rootElement.propsData = propsData;
      } else {
        rootElement = ComponentDefinition;
        var propsWithDefault = {};
        Object.keys(propsData).forEach(function (prop) {
          propsWithDefault[prop] = { default: propsData[prop] };
        });
        rootElement.props = propsWithDefault;
      }

      var elementInnerHtml = vueVersion >= 2 ? '<div></div>' : ('<div>' + element.innerHTML + '</div>').replace(/vue-slot=/g, 'slot=');
      if (options.shadow && element.shadowRoot) {
        element.shadowRoot.innerHTML = elementInnerHtml;
        rootElement.el = element.shadowRoot.children[0];
      } else {
        element.innerHTML = elementInnerHtml;
        rootElement.el = element.children[0];
      }

      reactiveProps(element, props);

      if (typeof options.beforeCreateVueInstance === 'function') {
        rootElement = options.beforeCreateVueInstance(rootElement) || rootElement;
      }

      element.__vue_custom_element__ = new Vue(rootElement);
      element.__vue_custom_element_props__ = props;
      element.getVueInstance = function () {
        var vueInstance = element.__vue_custom_element__;
        return vueInstance.$children.length ? vueInstance.$children[0] : vueInstance;
      };

      if (options.shadow && options.shadowCss && element.shadowRoot) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(options.shadowCss));

        element.shadowRoot.appendChild(style);
      }
      element.removeAttribute('vce-cloak');
      element.setAttribute('vce-ready', '');
      customEmit(element, 'vce-ready');
    }
  }

  function install(Vue) {
    Vue.customElement = function vueCustomElement(tag, componentDefinition) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var isAsyncComponent = typeof componentDefinition === 'function';
      var optionsProps = isAsyncComponent && { props: options.props || [] };
      var props = getProps(isAsyncComponent ? optionsProps : componentDefinition);

      var CustomElement = registerCustomElement(tag, {
        constructorCallback: function constructorCallback() {
          typeof options.constructorCallback === 'function' && options.constructorCallback.call(this);
        },
        connectedCallback: function connectedCallback() {
          var _this = this;

          var asyncComponentPromise = isAsyncComponent && componentDefinition();
          var isAsyncComponentPromise = asyncComponentPromise && asyncComponentPromise.then && typeof asyncComponentPromise.then === 'function';

          typeof options.connectedCallback === 'function' && options.connectedCallback.call(this);

          if (isAsyncComponent && !isAsyncComponentPromise) {
            throw new Error('Async component ' + tag + ' do not returns Promise');
          }
          if (!this.__detached__) {
            if (isAsyncComponentPromise) {
              asyncComponentPromise.then(function (lazyLoadedComponent) {
                var lazyLoadedComponentProps = getProps(lazyLoadedComponent);
                createVueInstance(_this, Vue, lazyLoadedComponent, lazyLoadedComponentProps, options);
                typeof options.vueInstanceCreatedCallback === 'function' && options.vueInstanceCreatedCallback.call(_this);
              });
            } else {
              createVueInstance(this, Vue, componentDefinition, props, options);
              typeof options.vueInstanceCreatedCallback === 'function' && options.vueInstanceCreatedCallback.call(this);
            }
          }

          this.__detached__ = false;
        },
        disconnectedCallback: function disconnectedCallback() {
          var _this2 = this;

          this.__detached__ = true;
          typeof options.disconnectedCallback === 'function' && options.disconnectedCallback.call(this);

          options.destroyTimeout !== null && setTimeout(function () {
            if (_this2.__detached__ && _this2.__vue_custom_element__) {
              _this2.__detached__ = false;
              _this2.__vue_custom_element__.$destroy(true);
              delete _this2.__vue_custom_element__;
              delete _this2.__vue_custom_element_props__;
            }
          }, options.destroyTimeout || 3000);
        },
        attributeChangedCallback: function attributeChangedCallback(name, oldValue, value) {
          if (this.__vue_custom_element__ && typeof value !== 'undefined') {
            var nameCamelCase = camelize(name);
            typeof options.attributeChangedCallback === 'function' && options.attributeChangedCallback.call(this, name, oldValue, value);
            var type = this.__vue_custom_element_props__.types[nameCamelCase];
            this.__vue_custom_element__[nameCamelCase] = convertAttributeValue(value, type);
          }
        },


        observedAttributes: props.hyphenate,

        shadow: !!options.shadow && !!HTMLElement.prototype.attachShadow
      });

      return CustomElement;
    };
  }

  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(install);
    if (install.installed) {
      install.installed = false;
    }
  }

  return install;

  })));
  });

  var UserLogo = { render: function () { var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 33.304 33.304","height":"125.872","width":"125.872"}},[_c('defs',[_c('clipPath',{attrs:{"id":"a","clipPathUnits":"userSpaceOnUse"}},[_c('ellipse',{attrs:{"ry":"33.393","rx":"32.935","cy":"50.318","cx":"46.658","fill":"none","stroke":"#000","stroke-width":"1.323"}})])]),_c('g',{attrs:{"transform":"translate(.777 .777)"}},[_c('ellipse',{staticClass:"person",attrs:{"cx":"15.999","cy":"11.684","rx":"5.148","ry":"5.219","fill":"#fff","stroke":"#fff","stroke-width":".55"}}),_c('ellipse',{staticClass:"person",attrs:{"transform":"matrix(.37105 0 0 .37105 -1.336 .185)","clip-path":"url(#a)","cx":"46.723","cy":"73.875","rx":"24.169","ry":"24.505","fill":"#fff","stroke":"#fff","stroke-width":"2.582"}}),_c('circle',{staticClass:"circle",attrs:{"r":"15.329","cy":"15.875","cx":"15.875","fill":"none","stroke":"#fff","stroke-width":"2.646"}})])]) } };

  //
  var script = {
      name: 'LoginForm',
      props: {
          heading: String,
          buttonText: String,
          server: String
      },
      data () {
          return {
              authError: false,
              form: {
                  username: '',
                  password: ''
              },
              showForgotPassword: false,
              resetPasswordSuccess: false
          }
      },
      methods: {
          onSubmitClick () {
              // Clear errors
              this.authError = false;

              Object.keys(this.$refs).forEach(loc => {
                  this.$refs[loc].classList.remove('error');
              });

              // Build request
              // let params = new URLSearchParams()
              // params.append('username', this.form.username)
              // params.append('password', this.form.password)

              // fetch(`${this.server}/resetpassword`, {
              //     method: 'POST',
              //     headers: {
              //         'Content-Type': 'application/json'
              //     },
              //     body: params,
              //     redirect: 'manual'
              // })
              // .then(response => {
              //     if (response.status === 401) {
              //         this.authError = true
              //     } else if (response.type === 'opaqueredirect') {
              //         // Success
              //         window.location.href = response.url
              //     } else if (!response.ok) {
              //         response.json().then(json => {
              //             json.detail.forEach(error => {
              //                 error.loc.forEach(loc => {
              //                     if (this.$refs[loc]) {
              //                         this.$refs[loc].classList.add('error')
              //                     }
              //                 })
              //             })
              //         })
              //     }
              // })
              // .catch(response => {
              //     console.debug('Error signing in or parsing response', response)
              // })
          },
          onSubmitForgotPasswordClick () {
              // Build request
              // let params = new URLSearchParams()
              // params.append('username', this.form.forgotPasswordUsernameOrEmail)

              // fetch(`${this.server}/login`, {
              //     method: 'POST',
              //     headers: {
              //         'Content-Type': 'application/x-www-form-urlencoded'
              //     },
              //     body: params,
              //     redirect: 'manual'
              // })
              // .then(response => {
              //     if (response.status === 401) {
              //         this.authError = true
              //     } else if (response.type === 'opaqueredirect') {
              //         // Success
              //         window.location.href = response.url
              //     } else if (!response.ok) {
              //         response.json().then(json => {
              //             json.detail.forEach(error => {
              //                 error.loc.forEach(loc => {
              //                     if (this.$refs[loc]) {
              //                         this.$refs[loc].classList.add('error')
              //                     }
              //                 })
              //             })
              //         })
              //     }
              // })
              // .catch(response => {
              //     console.debug('Error signing in or parsing response', response)
              // })

              // Debug
              this.resetPasswordSuccess = true;
          }
      },
      components: {
          UserLogo
      }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  const isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return (id, style) => addStyle(id, style);
  }
  let HEAD;
  const styles = {};
  function addStyle(id, css) {
      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          let code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  style.element.setAttribute('media', css.media);
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              const index = style.ids.size - 1;
              const textNode = document.createTextNode(code);
              const nodes = style.element.childNodes;
              if (nodes[index])
                  style.element.removeChild(nodes[index]);
              if (nodes.length)
                  style.element.insertBefore(textNode, nodes[index]);
              else
                  style.element.appendChild(textNode);
          }
      }
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "login-form__wrapper" }, [
      !_vm.showForgotPassword
        ? _c(
            "form",
            {
              staticClass: "form",
              on: {
                submit: function($event) {
                  $event.preventDefault();
                  return _vm.onSubmitClick($event)
                }
              }
            },
            [
              _c("div", { staticClass: "avatar" }, [_c("UserLogo")], 1),
              _vm._v(" "),
              _c("h2", { staticClass: "msg" }, [_vm._v(_vm._s(_vm.heading))]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.form.username,
                      expression: "form.username"
                    }
                  ],
                  ref: "username",
                  staticClass: "form-control",
                  attrs: {
                    type: "text",
                    name: "username",
                    placeholder: "Username",
                    required: true
                  },
                  domProps: { value: _vm.form.username },
                  on: {
                    keyup: function($event) {
                      _vm.authError = false;
                    },
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "username", $event.target.value);
                    }
                  }
                })
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.form.password,
                      expression: "form.password"
                    }
                  ],
                  ref: "password",
                  staticClass: "form-control",
                  attrs: {
                    type: "password",
                    name: "password",
                    placeholder: "Password",
                    required: true
                  },
                  domProps: { value: _vm.form.password },
                  on: {
                    keyup: function($event) {
                      _vm.authError = false;
                    },
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "password", $event.target.value);
                    }
                  }
                })
              ]),
              _vm._v(" "),
              _vm.authError
                ? _c("div", { staticClass: "alert alert-danger" }, [
                    _vm._v("Login failed; Invalid username or password")
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("div", { staticClass: "form-group" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-primary btn-lg btn-block",
                    attrs: { type: "submit" }
                  },
                  [_vm._v(_vm._s(_vm.buttonText))]
                )
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group" }, [
                _c(
                  "a",
                  {
                    attrs: { href: "" },
                    on: {
                      click: function($event) {
                        $event.preventDefault();
                        _vm.showForgotPassword = true;
                      }
                    }
                  },
                  [_vm._v("Forgot password?")]
                )
              ])
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.showForgotPassword
        ? _c(
            "form",
            {
              staticClass: "form",
              on: {
                submit: function($event) {
                  $event.preventDefault();
                  return _vm.onSubmitForgotPasswordClick($event)
                }
              }
            },
            [
              _c("div", { staticClass: "avatar" }, [_c("UserLogo")], 1),
              _vm._v(" "),
              _c("h2", { staticClass: "msg" }, [_vm._v("Reset Password")]),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: !_vm.resetPasswordSuccess,
                      expression: "!resetPasswordSuccess"
                    }
                  ]
                },
                [
                  _c("div", { staticClass: "form-group" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.form.forgotPasswordUsernameOrEmail,
                          expression: "form.forgotPasswordUsernameOrEmail"
                        }
                      ],
                      ref: "forgotPasswordUsernameOrEmail",
                      staticClass: "form-control",
                      attrs: {
                        type: "text",
                        name: "username",
                        placeholder: "Username or email address",
                        required: true
                      },
                      domProps: { value: _vm.form.forgotPasswordUsernameOrEmail },
                      on: {
                        keyup: function($event) {
                          _vm.authError = false;
                        },
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.form,
                            "forgotPasswordUsernameOrEmail",
                            $event.target.value
                          );
                        }
                      }
                    })
                  ]),
                  _vm._v(" "),
                  _vm._m(0)
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.resetPasswordSuccess,
                      expression: "resetPasswordSuccess"
                    }
                  ]
                },
                [
                  _c("h3", { staticClass: "primary" }, [_vm._v("Success")]),
                  _vm._v(" "),
                  _c("p", [
                    _vm._v(
                      "We've sent an email to the address for your user. Follow the instructions in the email to reset your password."
                    )
                  ])
                ]
              ),
              _vm._v(" "),
              _c("div", { staticClass: "form-group" }, [
                _c(
                  "a",
                  {
                    attrs: { href: "" },
                    on: {
                      click: function($event) {
                        $event.preventDefault();
                        _vm.resetPasswordSuccess = false;
                        _vm.showForgotPassword = false;
                      }
                    }
                  },
                  [_vm._v("« Back")]
                )
              ])
            ]
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__ = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "form-group" }, [
        _c(
          "button",
          {
            staticClass: "btn btn-primary btn-lg btn-block",
            attrs: { type: "submit" }
          },
          [_vm._v("Send Email")]
        )
      ])
    }
  ];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-847fddea_0", { source: ".login-form__wrapper {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #212529;\n  width: 350px;\n  padding: 50px 0 0;\n}\n.login-form__wrapper *, .login-form__wrapper ::after, .login-form__wrapper ::before {\n  box-sizing: border-box;\n}\n.login-form__wrapper a {\n  color: #fa225b;\n  text-decoration: none;\n}\n.login-form__wrapper a:hover {\n  text-decoration: underline;\n}\n.login-form__wrapper .primary {\n  color: #fa225b;\n}\n.login-form__wrapper .avatar {\n  position: absolute;\n  margin: 0 auto;\n  left: 0;\n  right: 0;\n  top: -50px;\n  width: 95px;\n  height: 95px;\n  border-radius: 50%;\n  background: #fa225b;\n  padding: 15px;\n  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);\n}\n.login-form__wrapper .avatar svg {\n  width: 100%;\n  height: 100%;\n}\n.login-form__wrapper .msg {\n  font-size: 22px;\n  margin: 35px 0 25px;\n}\n.login-form__wrapper .form {\n  display: block;\n  color: #7a7a7a;\n  border-radius: 2px;\n  font-size: 13px;\n  background: #ececec;\n  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\n  padding: 30px;\n  position: relative;\n}\n.login-form__wrapper .form-group {\n  margin-bottom: 1rem;\n}\n.login-form__wrapper .form-control {\n  display: block;\n  width: 100%;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  border-radius: 2px;\n  min-height: 41px;\n  background: #fff;\n  border: 1px solid #e3e3e3;\n  box-shadow: none !important;\n}\n.login-form__wrapper .form-control:focus {\n  outline: 0;\n}\n.login-form__wrapper .btn {\n  display: block;\n  border-radius: 2px;\n  width: 100%;\n  padding: 0.5rem 1rem;\n  line-height: 1.5;\n  font-size: 16px;\n  font-weight: bold;\n  background: #fa225b;\n  border: none;\n  margin-bottom: 20px;\n  color: #fff;\n}\n.login-form__wrapper .form-control.error, .login-form__wrapper .form-control.vf-invalid {\n  border-color: #d9534f;\n  background: #fff0f4;\n}\n.login-form__wrapper .alert {\n  position: relative;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 1rem;\n  border: 1px solid transparent;\n  border-radius: 0.25rem;\n}\n.login-form__wrapper .alert-danger {\n  color: #721c24;\n  background-color: #f8d7da;\n  border-color: #f5c6cb;\n}\n\n/*# sourceMappingURL=LoginForm.vue.map */", map: {"version":3,"sources":["/Users/dylan/dev/zuar/frontendtoolbox/src/elements/LoginForm/LoginForm.vue","LoginForm.vue"],"names":[],"mappings":"AAuMA;EACA,iKAAA;EACA,mCAAA;EACA,kCAAA;EACA,kBAAA;EACA,cAAA;EACA,YAAA;EACA,iBAAA;ACtMA;ADwMA;EACA,sBAAA;ACtMA;ADyMA;EACA,cAAA;EACA,qBAAA;ACvMA;ADyMA;EACA,0BAAA;ACvMA;AD0MA;EACA,cAAA;ACxMA;AD2MA;EACA,kBAAA;EACA,cAAA;EACA,OAAA;EACA,QAAA;EACA,UAAA;EACA,WAAA;EACA,YAAA;EACA,kBAAA;EACA,mBAAA;EACA,aAAA;EACA,0CAAA;ACzMA;AD2MA;EACA,WAAA;EACA,YAAA;ACzMA;AD6MA;EACA,eAAA;EACA,mBAAA;AC3MA;AD8MA;EACA,cAAA;EACA,cAAA;EACA,kBAAA;EACA,eAAA;EACA,mBAAA;EACA,0CAAA;EACA,aAAA;EACA,kBAAA;AC5MA;AD8MA;EACA,mBAAA;AC5MA;AD8MA;EACA,cAAA;EACA,WAAA;EACA,yBAAA;EACA,eAAA;EACA,gBAAA;EACA,kBAAA;EACA,gBAAA;EACA,gBAAA;EACA,yBAAA;EACA,2BAAA;AC5MA;AD8MA;EACA,UAAA;AC5MA;AD+MA;EACA,cAAA;EACA,kBAAA;EACA,WAAA;EACA,oBAAA;EACA,gBAAA;EACA,eAAA;EACA,iBAAA;EACA,mBAAA;EACA,YAAA;EACA,mBAAA;EACA,WAAA;AC7MA;ADgNA;EACA,qBAAA;EACA,mBAAA;AC9MA;ADiNA;EACA,kBAAA;EACA,wBAAA;EACA,mBAAA;EACA,6BAAA;EACA,sBAAA;AC/MA;ADiNA;EACA,cAAA;EACA,yBAAA;EACA,qBAAA;AC/MA;;AAEA,wCAAwC","file":"LoginForm.vue","sourcesContent":["<template>\n    <div class=\"login-form__wrapper\">\n\n        <!-- Login -->\n        <form\n            class=\"form\"\n            v-on:submit.prevent=\"onSubmitClick\"\n            v-if=\"!showForgotPassword\">\n            <div class=\"avatar\">\n                <UserLogo />\n            </div>\n            <h2 class=\"msg\">{{heading}}</h2>\n            <div class=\"form-group\">\n                <input \n                    type=\"text\" \n                    class=\"form-control\" \n                    name=\"username\" \n                    placeholder=\"Username\"\n                    ref=\"username\"\n                    v-model=\"form.username\"\n                    v-on:keyup=\"authError = false\"\n                    :required=\"true\">\n            </div>\n            <div class=\"form-group\">\n                <input \n                    type=\"password\" \n                    class=\"form-control\"\n                    name=\"password\" \n                    placeholder=\"Password\" \n                    ref=\"password\"\n                    v-model=\"form.password\"\n                    v-on:keyup=\"authError = false\"\n                    :required=\"true\">\n            </div>\n            \n            <div v-if=\"authError\" class=\"alert alert-danger\">Login failed; Invalid username or password</div>\n\n            <div class=\"form-group\">\n                <button \n                    type=\"submit\"\n                    class=\"btn btn-primary btn-lg btn-block\">{{buttonText}}</button>\n            </div>\n\n            <div class=\"form-group\">\n                <a href v-on:click.prevent=\"showForgotPassword=true\">Forgot password?</a>\n            </div>\n        </form>\n\n        <!-- Forgot Password -->\n        <form\n            class=\"form\"\n            v-on:submit.prevent=\"onSubmitForgotPasswordClick\"\n            v-if=\"showForgotPassword\">\n            <div class=\"avatar\">\n                <UserLogo />\n            </div>\n            <h2 class=\"msg\">Reset Password</h2>\n\n            <div v-show=\"!resetPasswordSuccess\">\n                <div class=\"form-group\">\n                    <input \n                        type=\"text\" \n                        class=\"form-control\" \n                        name=\"username\" \n                        placeholder=\"Username or email address\"\n                        ref=\"forgotPasswordUsernameOrEmail\"\n                        v-model=\"form.forgotPasswordUsernameOrEmail\"\n                        v-on:keyup=\"authError = false\"\n                        :required=\"true\">\n                </div>\n                <div class=\"form-group\">\n                    <button \n                        type=\"submit\"\n                        class=\"btn btn-primary btn-lg btn-block\">Send Email</button>\n                </div>\n            </div>\n\n            <div v-show=\"resetPasswordSuccess\">\n                <h3 class=\"primary\">Success</h3>\n                <p>We've sent an email to the address for your user. Follow the instructions in the email to reset your password.</p>\n            </div>\n\n            <div class=\"form-group\">\n                <a href v-on:click.prevent=\"resetPasswordSuccess=false; showForgotPassword=false\">&laquo; Back</a>\n            </div>\n        </form>\n    </div>\n</template>\n\n<script>\n    import UserLogo from '../../assets/icon-user.svg'\n    export default {\n        name: 'LoginForm',\n        props: {\n            heading: String,\n            buttonText: String,\n            server: String\n        },\n        data () {\n            return {\n                authError: false,\n                form: {\n                    username: '',\n                    password: ''\n                },\n                showForgotPassword: false,\n                resetPasswordSuccess: false\n            }\n        },\n        methods: {\n            onSubmitClick () {\n                // Clear errors\n                this.authError = false\n\n                Object.keys(this.$refs).forEach(loc => {\n                    this.$refs[loc].classList.remove('error')\n                })\n\n                // Build request\n                // let params = new URLSearchParams()\n                // params.append('username', this.form.username)\n                // params.append('password', this.form.password)\n\n                // fetch(`${this.server}/resetpassword`, {\n                //     method: 'POST',\n                //     headers: {\n                //         'Content-Type': 'application/json'\n                //     },\n                //     body: params,\n                //     redirect: 'manual'\n                // })\n                // .then(response => {\n                //     if (response.status === 401) {\n                //         this.authError = true\n                //     } else if (response.type === 'opaqueredirect') {\n                //         // Success\n                //         window.location.href = response.url\n                //     } else if (!response.ok) {\n                //         response.json().then(json => {\n                //             json.detail.forEach(error => {\n                //                 error.loc.forEach(loc => {\n                //                     if (this.$refs[loc]) {\n                //                         this.$refs[loc].classList.add('error')\n                //                     }\n                //                 })\n                //             })\n                //         })\n                //     }\n                // })\n                // .catch(response => {\n                //     console.debug('Error signing in or parsing response', response)\n                // })\n            },\n            onSubmitForgotPasswordClick () {\n                // Build request\n                // let params = new URLSearchParams()\n                // params.append('username', this.form.forgotPasswordUsernameOrEmail)\n\n                // fetch(`${this.server}/login`, {\n                //     method: 'POST',\n                //     headers: {\n                //         'Content-Type': 'application/x-www-form-urlencoded'\n                //     },\n                //     body: params,\n                //     redirect: 'manual'\n                // })\n                // .then(response => {\n                //     if (response.status === 401) {\n                //         this.authError = true\n                //     } else if (response.type === 'opaqueredirect') {\n                //         // Success\n                //         window.location.href = response.url\n                //     } else if (!response.ok) {\n                //         response.json().then(json => {\n                //             json.detail.forEach(error => {\n                //                 error.loc.forEach(loc => {\n                //                     if (this.$refs[loc]) {\n                //                         this.$refs[loc].classList.add('error')\n                //                     }\n                //                 })\n                //             })\n                //         })\n                //     }\n                // })\n                // .catch(response => {\n                //     console.debug('Error signing in or parsing response', response)\n                // })\n\n                // Debug\n                this.resetPasswordSuccess = true\n            }\n        },\n        components: {\n            UserLogo\n        }\n    }\n</script>\n\n<style lang=\"scss\">\n    .login-form__wrapper {\n        font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";\n        -webkit-font-smoothing: antialiased;\n        -moz-osx-font-smoothing: grayscale;\n        text-align: center;\n        color: #212529;\n        width: 350px;\n        padding: 50px 0 0;\n\n        *, ::after, ::before {\n            box-sizing: border-box;\n        }\n\n        a {\n            color: #fa225b;\n            text-decoration: none;\n        }\n        a:hover {\n            text-decoration: underline;\n        }\n\n        .primary {\n            color: #fa225b;\n        }\n\n        .avatar {\n            position: absolute;\n            margin: 0 auto;\n            left: 0;\n            right: 0;\n            top: -50px;\n            width: 95px;\n            height: 95px;\n            border-radius: 50%;\n            background: #fa225b;\n            padding: 15px;\n            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);\n\n            svg {\n                width: 100%;\n                height: 100%;\n            }\n        }\n\n        .msg {\n            font-size: 22px;\n            margin: 35px 0 25px;\n        }\n\n        .form {\n            display: block;\n            color: #7a7a7a;\n            border-radius: 2px;\n            font-size: 13px;\n            background: #ececec;\n            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\n            padding: 30px;\n            position: relative;\n        }\n        .form-group {\n            margin-bottom: 1rem;\n        }\n        .form-control {\n            display: block;\n            width: 100%;\n            padding: .375rem .75rem;\n            font-size: 1rem;\n            line-height: 1.5;\n            border-radius: 2px;\n            min-height: 41px;\n            background: #fff;\n            border: 1px solid #e3e3e3;\n            box-shadow: none !important;\n        }\n        .form-control:focus {\n            outline: 0;\n        }\n\n        .btn {\n            display: block;\n            border-radius: 2px;\n            width: 100%;\n            padding: .5rem 1rem;\n            line-height: 1.5;\n            font-size: 16px;\n            font-weight: bold;\n            background: #fa225b;\n            border: none;\n            margin-bottom: 20px;\n            color: #fff;\n        }\n\n        .form-control.error, .form-control.vf-invalid {\n            border-color: #d9534f;\n            background: #fff0f4;\n        }\n\n        .alert {\n            position: relative;\n            padding: .75rem 1.25rem;\n            margin-bottom: 1rem;\n            border: 1px solid transparent;\n            border-radius: .25rem;\n        }\n        .alert-danger {\n            color: #721c24;\n            background-color: #f8d7da;\n            border-color: #f5c6cb;\n        }\n    }\n</style>\n",".login-form__wrapper {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #212529;\n  width: 350px;\n  padding: 50px 0 0;\n}\n.login-form__wrapper *, .login-form__wrapper ::after, .login-form__wrapper ::before {\n  box-sizing: border-box;\n}\n.login-form__wrapper a {\n  color: #fa225b;\n  text-decoration: none;\n}\n.login-form__wrapper a:hover {\n  text-decoration: underline;\n}\n.login-form__wrapper .primary {\n  color: #fa225b;\n}\n.login-form__wrapper .avatar {\n  position: absolute;\n  margin: 0 auto;\n  left: 0;\n  right: 0;\n  top: -50px;\n  width: 95px;\n  height: 95px;\n  border-radius: 50%;\n  background: #fa225b;\n  padding: 15px;\n  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);\n}\n.login-form__wrapper .avatar svg {\n  width: 100%;\n  height: 100%;\n}\n.login-form__wrapper .msg {\n  font-size: 22px;\n  margin: 35px 0 25px;\n}\n.login-form__wrapper .form {\n  display: block;\n  color: #7a7a7a;\n  border-radius: 2px;\n  font-size: 13px;\n  background: #ececec;\n  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\n  padding: 30px;\n  position: relative;\n}\n.login-form__wrapper .form-group {\n  margin-bottom: 1rem;\n}\n.login-form__wrapper .form-control {\n  display: block;\n  width: 100%;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  border-radius: 2px;\n  min-height: 41px;\n  background: #fff;\n  border: 1px solid #e3e3e3;\n  box-shadow: none !important;\n}\n.login-form__wrapper .form-control:focus {\n  outline: 0;\n}\n.login-form__wrapper .btn {\n  display: block;\n  border-radius: 2px;\n  width: 100%;\n  padding: 0.5rem 1rem;\n  line-height: 1.5;\n  font-size: 16px;\n  font-weight: bold;\n  background: #fa225b;\n  border: none;\n  margin-bottom: 20px;\n  color: #fff;\n}\n.login-form__wrapper .form-control.error, .login-form__wrapper .form-control.vf-invalid {\n  border-color: #d9534f;\n  background: #fff0f4;\n}\n.login-form__wrapper .alert {\n  position: relative;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 1rem;\n  border: 1px solid transparent;\n  border-radius: 0.25rem;\n}\n.login-form__wrapper .alert-danger {\n  color: #721c24;\n  background-color: #f8d7da;\n  border-color: #f5c6cb;\n}\n\n/*# sourceMappingURL=LoginForm.vue.map */"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  var vval = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.patchChildren = patchChildren;
  exports.h = h;

  function isUndef(v) {
    return v === null || v === undefined;
  }

  function isDef(v) {
    return v !== null && v !== undefined;
  }

  function sameVval(oldVval, vval) {
    return vval.tag === oldVval.tag && vval.key === oldVval.key;
  }

  function createVm(vval) {
    var Vm = vval.tag;
    vval.vm = new Vm({
      data: vval.args
    });
  }

  function updateVval(vval) {
    var keys = Object.keys(vval.args);

    for (var i = 0; i < keys.length; i++) {
      keys.forEach(function (k) {
        vval.vm[k] = vval.args[k];
      });
    }
  }

  function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key;
    var map = {};

    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) map[key] = i;
    }

    return map;
  }

  function updateChildren(oldCh, newCh) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVval = oldCh[0];
    var oldEndVval = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVval = newCh[0];
    var newEndVval = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVval)) {
        oldStartVval = oldCh[++oldStartIdx];
      } else if (isUndef(oldEndVval)) {
        oldEndVval = oldCh[--oldEndIdx];
      } else if (sameVval(oldStartVval, newStartVval)) {
        patchVval(oldStartVval, newStartVval);
        oldStartVval = oldCh[++oldStartIdx];
        newStartVval = newCh[++newStartIdx];
      } else if (sameVval(oldEndVval, newEndVval)) {
        patchVval(oldEndVval, newEndVval);
        oldEndVval = oldCh[--oldEndIdx];
        newEndVval = newCh[--newEndIdx];
      } else if (sameVval(oldStartVval, newEndVval)) {
        patchVval(oldStartVval, newEndVval);
        oldStartVval = oldCh[++oldStartIdx];
        newEndVval = newCh[--newEndIdx];
      } else if (sameVval(oldEndVval, newStartVval)) {
        patchVval(oldEndVval, newStartVval);
        oldEndVval = oldCh[--oldEndIdx];
        newStartVval = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = isDef(newStartVval.key) ? oldKeyToIdx[newStartVval.key] : null;

        if (isUndef(idxInOld)) {
          createVm(newStartVval);
          newStartVval = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];

          if (sameVval(elmToMove, newStartVval)) {
            patchVval(elmToMove, newStartVval);
            oldCh[idxInOld] = undefined;
            newStartVval = newCh[++newStartIdx];
          } else {
            createVm(newStartVval);
            newStartVval = newCh[++newStartIdx];
          }
        }
      }
    }

    if (oldStartIdx > oldEndIdx) {
      addVvals(newCh, newStartIdx, newEndIdx);
    } else if (newStartIdx > newEndIdx) {
      removeVvals(oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function addVvals(vvals, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      createVm(vvals[startIdx]);
    }
  }

  function removeVvals(vvals, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vvals[startIdx];

      if (isDef(ch)) {
        ch.vm.$destroy();
        ch.vm = null;
      }
    }
  }

  function patchVval(oldVval, vval) {
    if (oldVval === vval) {
      return;
    }

    vval.vm = oldVval.vm;
    updateVval(vval);
  }

  function patchChildren(oldCh, ch) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(oldCh, ch);
    } else if (isDef(ch)) {
      addVvals(ch, 0, ch.length - 1);
    } else if (isDef(oldCh)) {
      removeVvals(oldCh, 0, oldCh.length - 1);
    }
  }

  function h(tag, key, args) {
    return {
      tag: tag,
      key: key,
      args: args
    };
  }
  });

  unwrapExports(vval);
  var vval_1 = vval.patchChildren;
  var vval_2 = vval.h;

  var params = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.pushParams = pushParams;
  exports.popParams = popParams;
  exports.withParams = withParams;
  exports._setTarget = exports.target = void 0;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var stack = [];
  var target = null;
  exports.target = target;

  var _setTarget = function _setTarget(x) {
    exports.target = target = x;
  };

  exports._setTarget = _setTarget;

  function pushParams() {
    if (target !== null) {
      stack.push(target);
    }

    exports.target = target = {};
  }

  function popParams() {
    var lastTarget = target;
    var newTarget = exports.target = target = stack.pop() || null;

    if (newTarget) {
      if (!Array.isArray(newTarget.$sub)) {
        newTarget.$sub = [];
      }

      newTarget.$sub.push(lastTarget);
    }

    return lastTarget;
  }

  function addParams(params) {
    if (_typeof(params) === 'object' && !Array.isArray(params)) {
      exports.target = target = _objectSpread({}, target, {}, params);
    } else {
      throw new Error('params must be an object');
    }
  }

  function withParamsDirect(params, validator) {
    return withParamsClosure(function (add) {
      return function () {
        add(params);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return validator.apply(this, args);
      };
    });
  }

  function withParamsClosure(closure) {
    var validator = closure(addParams);
    return function () {
      pushParams();

      try {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return validator.apply(this, args);
      } finally {
        popParams();
      }
    };
  }

  function withParams(paramsOrClosure, maybeValidator) {
    if (_typeof(paramsOrClosure) === 'object' && maybeValidator !== undefined) {
      return withParamsDirect(paramsOrClosure, maybeValidator);
    }

    return withParamsClosure(paramsOrClosure);
  }
  });

  unwrapExports(params);
  var params_1 = params.pushParams;
  var params_2 = params.popParams;
  var params_3 = params.withParams;
  var params_4 = params._setTarget;
  var params_5 = params.target;

  var lib = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Vuelidate = Vuelidate;
  Object.defineProperty(exports, "withParams", {
    enumerable: true,
    get: function get() {
      return params.withParams;
    }
  });
  exports.default = exports.validationMixin = void 0;





  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var NIL = function NIL() {
    return null;
  };

  var buildFromKeys = function buildFromKeys(keys, fn, keyFn) {
    return keys.reduce(function (build, key) {
      build[keyFn ? keyFn(key) : key] = fn(key);
      return build;
    }, {});
  };

  function isFunction(val) {
    return typeof val === 'function';
  }

  function isObject(val) {
    return val !== null && (_typeof(val) === 'object' || isFunction(val));
  }

  function isPromise(object) {
    return isObject(object) && isFunction(object.then);
  }

  var getPath = function getPath(ctx, obj, path, fallback) {
    if (typeof path === 'function') {
      return path.call(ctx, obj, fallback);
    }

    path = Array.isArray(path) ? path : path.split('.');

    for (var i = 0; i < path.length; i++) {
      if (obj && _typeof(obj) === 'object') {
        obj = obj[path[i]];
      } else {
        return fallback;
      }
    }

    return typeof obj === 'undefined' ? fallback : obj;
  };

  var __isVuelidateAsyncVm = '__isVuelidateAsyncVm';

  function makePendingAsyncVm(Vue, promise) {
    var asyncVm = new Vue({
      data: {
        p: true,
        v: false
      }
    });
    promise.then(function (value) {
      asyncVm.p = false;
      asyncVm.v = value;
    }, function (error) {
      asyncVm.p = false;
      asyncVm.v = false;
      throw error;
    });
    asyncVm[__isVuelidateAsyncVm] = true;
    return asyncVm;
  }

  var validationGetters = {
    $invalid: function $invalid() {
      var _this = this;

      var proxy = this.proxy;
      return this.nestedKeys.some(function (nested) {
        return _this.refProxy(nested).$invalid;
      }) || this.ruleKeys.some(function (rule) {
        return !proxy[rule];
      });
    },
    $dirty: function $dirty() {
      var _this2 = this;

      if (this.dirty) {
        return true;
      }

      if (this.nestedKeys.length === 0) {
        return false;
      }

      return this.nestedKeys.every(function (key) {
        return _this2.refProxy(key).$dirty;
      });
    },
    $anyDirty: function $anyDirty() {
      var _this3 = this;

      if (this.dirty) {
        return true;
      }

      if (this.nestedKeys.length === 0) {
        return false;
      }

      return this.nestedKeys.some(function (key) {
        return _this3.refProxy(key).$anyDirty;
      });
    },
    $error: function $error() {
      return this.$dirty && !this.$pending && this.$invalid;
    },
    $anyError: function $anyError() {
      var _this4 = this;

      if (this.$error) return true;
      return this.nestedKeys.some(function (key) {
        return _this4.refProxy(key).$anyError;
      });
    },
    $pending: function $pending() {
      var _this5 = this;

      return this.ruleKeys.some(function (key) {
        return _this5.getRef(key).$pending;
      }) || this.nestedKeys.some(function (key) {
        return _this5.refProxy(key).$pending;
      });
    },
    $params: function $params() {
      var _this6 = this;

      var vals = this.validations;
      return _objectSpread({}, buildFromKeys(this.nestedKeys, function (key) {
        return vals[key] && vals[key].$params || null;
      }), {}, buildFromKeys(this.ruleKeys, function (key) {
        return _this6.getRef(key).$params;
      }));
    }
  };

  function setDirtyRecursive(newState) {
    this.dirty = newState;
    var proxy = this.proxy;
    var method = newState ? '$touch' : '$reset';
    this.nestedKeys.forEach(function (key) {
      proxy[key][method]();
    });
  }

  var validationMethods = {
    $touch: function $touch() {
      setDirtyRecursive.call(this, true);
    },
    $reset: function $reset() {
      setDirtyRecursive.call(this, false);
    },
    $flattenParams: function $flattenParams() {
      var proxy = this.proxy;
      var params = [];

      for (var key in this.$params) {
        if (this.isNested(key)) {
          var childParams = proxy[key].$flattenParams();

          for (var j = 0; j < childParams.length; j++) {
            childParams[j].path.unshift(key);
          }

          params = params.concat(childParams);
        } else {
          params.push({
            path: [],
            name: key,
            params: this.$params[key]
          });
        }
      }

      return params;
    }
  };
  var getterNames = Object.keys(validationGetters);
  var methodNames = Object.keys(validationMethods);
  var _cachedComponent = null;

  var getComponent = function getComponent(Vue) {
    if (_cachedComponent) {
      return _cachedComponent;
    }

    var VBase = Vue.extend({
      computed: {
        refs: function refs() {
          var oldVval = this._vval;
          this._vval = this.children;
          (0, vval.patchChildren)(oldVval, this._vval);
          var refs = {};

          this._vval.forEach(function (c) {
            refs[c.key] = c.vm;
          });

          return refs;
        }
      },
      beforeCreate: function beforeCreate() {
        this._vval = null;
      },
      beforeDestroy: function beforeDestroy() {
        if (this._vval) {
          (0, vval.patchChildren)(this._vval);
          this._vval = null;
        }
      },
      methods: {
        getModel: function getModel() {
          return this.lazyModel ? this.lazyModel(this.prop) : this.model;
        },
        getModelKey: function getModelKey(key) {
          var model = this.getModel();

          if (model) {
            return model[key];
          }
        },
        hasIter: function hasIter() {
          return false;
        }
      }
    });
    var ValidationRule = VBase.extend({
      data: function data() {
        return {
          rule: null,
          lazyModel: null,
          model: null,
          lazyParentModel: null,
          rootModel: null
        };
      },
      methods: {
        runRule: function runRule(parent) {
          var model = this.getModel();
          (0, params.pushParams)();
          var rawOutput = this.rule.call(this.rootModel, model, parent);
          var output = isPromise(rawOutput) ? makePendingAsyncVm(Vue, rawOutput) : rawOutput;
          var rawParams = (0, params.popParams)();
          var params$1 = rawParams && rawParams.$sub ? rawParams.$sub.length > 1 ? rawParams : rawParams.$sub[0] : null;
          return {
            output: output,
            params: params$1
          };
        }
      },
      computed: {
        run: function run() {
          var _this7 = this;

          var parent = this.lazyParentModel();

          var isArrayDependant = Array.isArray(parent) && parent.__ob__;

          if (isArrayDependant) {
            var arrayDep = parent.__ob__.dep;
            arrayDep.depend();
            var target = arrayDep.constructor.target;

            if (!this._indirectWatcher) {
              var Watcher = target.constructor;
              this._indirectWatcher = new Watcher(this, function () {
                return _this7.runRule(parent);
              }, null, {
                lazy: true
              });
            }

            var model = this.getModel();

            if (!this._indirectWatcher.dirty && this._lastModel === model) {
              this._indirectWatcher.depend();

              return target.value;
            }

            this._lastModel = model;

            this._indirectWatcher.evaluate();

            this._indirectWatcher.depend();
          } else if (this._indirectWatcher) {
            this._indirectWatcher.teardown();

            this._indirectWatcher = null;
          }

          return this._indirectWatcher ? this._indirectWatcher.value : this.runRule(parent);
        },
        $params: function $params() {
          return this.run.params;
        },
        proxy: function proxy() {
          var output = this.run.output;

          if (output[__isVuelidateAsyncVm]) {
            return !!output.v;
          }

          return !!output;
        },
        $pending: function $pending() {
          var output = this.run.output;

          if (output[__isVuelidateAsyncVm]) {
            return output.p;
          }

          return false;
        }
      },
      destroyed: function destroyed() {
        if (this._indirectWatcher) {
          this._indirectWatcher.teardown();

          this._indirectWatcher = null;
        }
      }
    });
    var Validation = VBase.extend({
      data: function data() {
        return {
          dirty: false,
          validations: null,
          lazyModel: null,
          model: null,
          prop: null,
          lazyParentModel: null,
          rootModel: null
        };
      },
      methods: _objectSpread({}, validationMethods, {
        refProxy: function refProxy(key) {
          return this.getRef(key).proxy;
        },
        getRef: function getRef(key) {
          return this.refs[key];
        },
        isNested: function isNested(key) {
          return typeof this.validations[key] !== 'function';
        }
      }),
      computed: _objectSpread({}, validationGetters, {
        nestedKeys: function nestedKeys() {
          return this.keys.filter(this.isNested);
        },
        ruleKeys: function ruleKeys() {
          var _this8 = this;

          return this.keys.filter(function (k) {
            return !_this8.isNested(k);
          });
        },
        keys: function keys() {
          return Object.keys(this.validations).filter(function (k) {
            return k !== '$params';
          });
        },
        proxy: function proxy() {
          var _this9 = this;

          var keyDefs = buildFromKeys(this.keys, function (key) {
            return {
              enumerable: true,
              configurable: true,
              get: function get() {
                return _this9.refProxy(key);
              }
            };
          });
          var getterDefs = buildFromKeys(getterNames, function (key) {
            return {
              enumerable: true,
              configurable: true,
              get: function get() {
                return _this9[key];
              }
            };
          });
          var methodDefs = buildFromKeys(methodNames, function (key) {
            return {
              enumerable: false,
              configurable: true,
              get: function get() {
                return _this9[key];
              }
            };
          });
          var iterDefs = this.hasIter() ? {
            $iter: {
              enumerable: true,
              value: Object.defineProperties({}, _objectSpread({}, keyDefs))
            }
          } : {};
          return Object.defineProperties({}, _objectSpread({}, keyDefs, {}, iterDefs, {
            $model: {
              enumerable: true,
              get: function get() {
                var parent = _this9.lazyParentModel();

                if (parent != null) {
                  return parent[_this9.prop];
                } else {
                  return null;
                }
              },
              set: function set(value) {
                var parent = _this9.lazyParentModel();

                if (parent != null) {
                  parent[_this9.prop] = value;

                  _this9.$touch();
                }
              }
            }
          }, getterDefs, {}, methodDefs));
        },
        children: function children() {
          var _this10 = this;

          return [].concat(_toConsumableArray(this.nestedKeys.map(function (key) {
            return renderNested(_this10, key);
          })), _toConsumableArray(this.ruleKeys.map(function (key) {
            return renderRule(_this10, key);
          }))).filter(Boolean);
        }
      })
    });
    var GroupValidation = Validation.extend({
      methods: {
        isNested: function isNested(key) {
          return typeof this.validations[key]() !== 'undefined';
        },
        getRef: function getRef(key) {
          var vm = this;
          return {
            get proxy() {
              return vm.validations[key]() || false;
            }

          };
        }
      }
    });
    var EachValidation = Validation.extend({
      computed: {
        keys: function keys() {
          var model = this.getModel();

          if (isObject(model)) {
            return Object.keys(model);
          } else {
            return [];
          }
        },
        tracker: function tracker() {
          var _this11 = this;

          var trackBy = this.validations.$trackBy;
          return trackBy ? function (key) {
            return "".concat(getPath(_this11.rootModel, _this11.getModelKey(key), trackBy));
          } : function (x) {
            return "".concat(x);
          };
        },
        getModelLazy: function getModelLazy() {
          var _this12 = this;

          return function () {
            return _this12.getModel();
          };
        },
        children: function children() {
          var _this13 = this;

          var def = this.validations;
          var model = this.getModel();

          var validations = _objectSpread({}, def);

          delete validations['$trackBy'];
          var usedTracks = {};
          return this.keys.map(function (key) {
            var track = _this13.tracker(key);

            if (usedTracks.hasOwnProperty(track)) {
              return null;
            }

            usedTracks[track] = true;
            return (0, vval.h)(Validation, track, {
              validations: validations,
              prop: key,
              lazyParentModel: _this13.getModelLazy,
              model: model[key],
              rootModel: _this13.rootModel
            });
          }).filter(Boolean);
        }
      },
      methods: {
        isNested: function isNested() {
          return true;
        },
        getRef: function getRef(key) {
          return this.refs[this.tracker(key)];
        },
        hasIter: function hasIter() {
          return true;
        }
      }
    });

    var renderNested = function renderNested(vm, key) {
      if (key === '$each') {
        return (0, vval.h)(EachValidation, key, {
          validations: vm.validations[key],
          lazyParentModel: vm.lazyParentModel,
          prop: key,
          lazyModel: vm.getModel,
          rootModel: vm.rootModel
        });
      }

      var validations = vm.validations[key];

      if (Array.isArray(validations)) {
        var root = vm.rootModel;
        var refVals = buildFromKeys(validations, function (path) {
          return function () {
            return getPath(root, root.$v, path);
          };
        }, function (v) {
          return Array.isArray(v) ? v.join('.') : v;
        });
        return (0, vval.h)(GroupValidation, key, {
          validations: refVals,
          lazyParentModel: NIL,
          prop: key,
          lazyModel: NIL,
          rootModel: root
        });
      }

      return (0, vval.h)(Validation, key, {
        validations: validations,
        lazyParentModel: vm.getModel,
        prop: key,
        lazyModel: vm.getModelKey,
        rootModel: vm.rootModel
      });
    };

    var renderRule = function renderRule(vm, key) {
      return (0, vval.h)(ValidationRule, key, {
        rule: vm.validations[key],
        lazyParentModel: vm.lazyParentModel,
        lazyModel: vm.getModel,
        rootModel: vm.rootModel
      });
    };

    _cachedComponent = {
      VBase: VBase,
      Validation: Validation
    };
    return _cachedComponent;
  };

  var _cachedVue = null;

  function getVue(rootVm) {
    if (_cachedVue) return _cachedVue;
    var Vue = rootVm.constructor;

    while (Vue.super) {
      Vue = Vue.super;
    }

    _cachedVue = Vue;
    return Vue;
  }

  var validateModel = function validateModel(model, validations) {
    var Vue = getVue(model);

    var _getComponent = getComponent(Vue),
        Validation = _getComponent.Validation,
        VBase = _getComponent.VBase;

    var root = new VBase({
      computed: {
        children: function children() {
          var vals = typeof validations === 'function' ? validations.call(model) : validations;
          return [(0, vval.h)(Validation, '$v', {
            validations: vals,
            lazyParentModel: NIL,
            prop: '$v',
            model: model,
            rootModel: model
          })];
        }
      }
    });
    return root;
  };

  var validationMixin = {
    data: function data() {
      var vals = this.$options.validations;

      if (vals) {
        this._vuelidate = validateModel(this, vals);
      }

      return {};
    },
    beforeCreate: function beforeCreate() {
      var options = this.$options;
      var vals = options.validations;
      if (!vals) return;
      if (!options.computed) options.computed = {};
      if (options.computed.$v) return;

      options.computed.$v = function () {
        return this._vuelidate ? this._vuelidate.refs.$v.proxy : null;
      };
    },
    beforeDestroy: function beforeDestroy() {
      if (this._vuelidate) {
        this._vuelidate.$destroy();

        this._vuelidate = null;
      }
    }
  };
  exports.validationMixin = validationMixin;

  function Vuelidate(Vue) {
    Vue.mixin(validationMixin);
  }

  var _default = Vuelidate;
  exports.default = _default;
  });

  unwrapExports(lib);
  var lib_1 = lib.Vuelidate;
  var lib_2 = lib.withParams;
  var lib_3 = lib.validationMixin;

  var withParams_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  var withParams =  params.withParams;
  var _default = withParams;
  exports.default = _default;
  });

  unwrapExports(withParams_1);

  var common = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "withParams", {
    enumerable: true,
    get: function get() {
      return _withParams.default;
    }
  });
  exports.regex = exports.ref = exports.len = exports.req = void 0;

  var _withParams = _interopRequireDefault(withParams_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var req = function req(value) {
    if (Array.isArray(value)) return !!value.length;

    if (value === undefined || value === null) {
      return false;
    }

    if (value === false) {
      return true;
    }

    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }

    if (_typeof(value) === 'object') {
      for (var _ in value) {
        return true;
      }

      return false;
    }

    return !!String(value).length;
  };

  exports.req = req;

  var len = function len(value) {
    if (Array.isArray(value)) return value.length;

    if (_typeof(value) === 'object') {
      return Object.keys(value).length;
    }

    return String(value).length;
  };

  exports.len = len;

  var ref = function ref(reference, vm, parentVm) {
    return typeof reference === 'function' ? reference.call(vm, parentVm) : parentVm[reference];
  };

  exports.ref = ref;

  var regex = function regex(type, expr) {
    return (0, _withParams.default)({
      type: type
    }, function (value) {
      return !req(value) || expr.test(value);
    });
  };

  exports.regex = regex;
  });

  unwrapExports(common);
  var common_1 = common.withParams;
  var common_2 = common.regex;
  var common_3 = common.ref;
  var common_4 = common.len;
  var common_5 = common.req;

  var alpha = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.regex)('alpha', /^[a-zA-Z]*$/);

  exports.default = _default;
  });

  unwrapExports(alpha);

  var alphaNum = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.regex)('alphaNum', /^[a-zA-Z0-9]*$/);

  exports.default = _default;
  });

  unwrapExports(alphaNum);

  var numeric = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.regex)('numeric', /^[0-9]*$/);

  exports.default = _default;
  });

  unwrapExports(numeric);

  var between = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(min, max) {
    return (0, common.withParams)({
      type: 'between',
      min: min,
      max: max
    }, function (value) {
      return !(0, common.req)(value) || (!/\s/.test(value) || value instanceof Date) && +min <= +value && +max >= +value;
    });
  };

  exports.default = _default;
  });

  unwrapExports(between);

  var email = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var emailRegex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;

  var _default = (0, common.regex)('email', emailRegex);

  exports.default = _default;
  });

  unwrapExports(email);

  var ipAddress = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.withParams)({
    type: 'ipAddress'
  }, function (value) {
    if (!(0, common.req)(value)) {
      return true;
    }

    if (typeof value !== 'string') {
      return false;
    }

    var nibbles = value.split('.');
    return nibbles.length === 4 && nibbles.every(nibbleValid);
  });

  exports.default = _default;

  var nibbleValid = function nibbleValid(nibble) {
    if (nibble.length > 3 || nibble.length === 0) {
      return false;
    }

    if (nibble[0] === '0' && nibble !== '0') {
      return false;
    }

    if (!nibble.match(/^\d+$/)) {
      return false;
    }

    var numeric = +nibble | 0;
    return numeric >= 0 && numeric <= 255;
  };
  });

  unwrapExports(ipAddress);

  var macAddress = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default() {
    var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ':';
    return (0, common.withParams)({
      type: 'macAddress'
    }, function (value) {
      if (!(0, common.req)(value)) {
        return true;
      }

      if (typeof value !== 'string') {
        return false;
      }

      var parts = typeof separator === 'string' && separator !== '' ? value.split(separator) : value.length === 12 || value.length === 16 ? value.match(/.{2}/g) : null;
      return parts !== null && (parts.length === 6 || parts.length === 8) && parts.every(hexValid);
    });
  };

  exports.default = _default;

  var hexValid = function hexValid(hex) {
    return hex.toLowerCase().match(/^[0-9a-f]{2}$/);
  };
  });

  unwrapExports(macAddress);

  var maxLength = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(length) {
    return (0, common.withParams)({
      type: 'maxLength',
      max: length
    }, function (value) {
      return !(0, common.req)(value) || (0, common.len)(value) <= length;
    });
  };

  exports.default = _default;
  });

  unwrapExports(maxLength);

  var minLength = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(length) {
    return (0, common.withParams)({
      type: 'minLength',
      min: length
    }, function (value) {
      return !(0, common.req)(value) || (0, common.len)(value) >= length;
    });
  };

  exports.default = _default;
  });

  unwrapExports(minLength);

  var required = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.withParams)({
    type: 'required'
  }, function (value) {
    if (typeof value === 'string') {
      return (0, common.req)(value.trim());
    }

    return (0, common.req)(value);
  });

  exports.default = _default;
  });

  unwrapExports(required);

  var requiredIf = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(prop) {
    return (0, common.withParams)({
      type: 'requiredIf',
      prop: prop
    }, function (value, parentVm) {
      return (0, common.ref)(prop, this, parentVm) ? (0, common.req)(value) : true;
    });
  };

  exports.default = _default;
  });

  unwrapExports(requiredIf);

  var requiredUnless = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(prop) {
    return (0, common.withParams)({
      type: 'requiredUnless',
      prop: prop
    }, function (value, parentVm) {
      return !(0, common.ref)(prop, this, parentVm) ? (0, common.req)(value) : true;
    });
  };

  exports.default = _default;
  });

  unwrapExports(requiredUnless);

  var sameAs = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(equalTo) {
    return (0, common.withParams)({
      type: 'sameAs',
      eq: equalTo
    }, function (value, parentVm) {
      return value === (0, common.ref)(equalTo, this, parentVm);
    });
  };

  exports.default = _default;
  });

  unwrapExports(sameAs);

  var url = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  var _default = (0, common.regex)('url', urlRegex);

  exports.default = _default;
  });

  unwrapExports(url);

  var or = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default() {
    for (var _len = arguments.length, validators = new Array(_len), _key = 0; _key < _len; _key++) {
      validators[_key] = arguments[_key];
    }

    return (0, common.withParams)({
      type: 'or'
    }, function () {
      var _this = this;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return validators.length > 0 && validators.reduce(function (valid, fn) {
        return valid || fn.apply(_this, args);
      }, false);
    });
  };

  exports.default = _default;
  });

  unwrapExports(or);

  var and = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default() {
    for (var _len = arguments.length, validators = new Array(_len), _key = 0; _key < _len; _key++) {
      validators[_key] = arguments[_key];
    }

    return (0, common.withParams)({
      type: 'and'
    }, function () {
      var _this = this;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return validators.length > 0 && validators.reduce(function (valid, fn) {
        return valid && fn.apply(_this, args);
      }, true);
    });
  };

  exports.default = _default;
  });

  unwrapExports(and);

  var not = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(validator) {
    return (0, common.withParams)({
      type: 'not'
    }, function (value, vm) {
      return !(0, common.req)(value) || !validator.call(this, value, vm);
    });
  };

  exports.default = _default;
  });

  unwrapExports(not);

  var minValue = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(min) {
    return (0, common.withParams)({
      type: 'minValue',
      min: min
    }, function (value) {
      return !(0, common.req)(value) || (!/\s/.test(value) || value instanceof Date) && +value >= +min;
    });
  };

  exports.default = _default;
  });

  unwrapExports(minValue);

  var maxValue = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = function _default(max) {
    return (0, common.withParams)({
      type: 'maxValue',
      max: max
    }, function (value) {
      return !(0, common.req)(value) || (!/\s/.test(value) || value instanceof Date) && +value <= +max;
    });
  };

  exports.default = _default;
  });

  unwrapExports(maxValue);

  var integer = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.regex)('integer', /(^[0-9]*$)|(^-[0-9]+$)/);

  exports.default = _default;
  });

  unwrapExports(integer);

  var decimal = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;



  var _default = (0, common.regex)('decimal', /^[-]?\d*(\.\d+)?$/);

  exports.default = _default;
  });

  unwrapExports(decimal);

  var validators = createCommonjsModule(function (module, exports) {

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "alpha", {
    enumerable: true,
    get: function get() {
      return _alpha.default;
    }
  });
  Object.defineProperty(exports, "alphaNum", {
    enumerable: true,
    get: function get() {
      return _alphaNum.default;
    }
  });
  Object.defineProperty(exports, "numeric", {
    enumerable: true,
    get: function get() {
      return _numeric.default;
    }
  });
  Object.defineProperty(exports, "between", {
    enumerable: true,
    get: function get() {
      return _between.default;
    }
  });
  Object.defineProperty(exports, "email", {
    enumerable: true,
    get: function get() {
      return _email.default;
    }
  });
  Object.defineProperty(exports, "ipAddress", {
    enumerable: true,
    get: function get() {
      return _ipAddress.default;
    }
  });
  Object.defineProperty(exports, "macAddress", {
    enumerable: true,
    get: function get() {
      return _macAddress.default;
    }
  });
  Object.defineProperty(exports, "maxLength", {
    enumerable: true,
    get: function get() {
      return _maxLength.default;
    }
  });
  Object.defineProperty(exports, "minLength", {
    enumerable: true,
    get: function get() {
      return _minLength.default;
    }
  });
  Object.defineProperty(exports, "required", {
    enumerable: true,
    get: function get() {
      return _required.default;
    }
  });
  Object.defineProperty(exports, "requiredIf", {
    enumerable: true,
    get: function get() {
      return _requiredIf.default;
    }
  });
  Object.defineProperty(exports, "requiredUnless", {
    enumerable: true,
    get: function get() {
      return _requiredUnless.default;
    }
  });
  Object.defineProperty(exports, "sameAs", {
    enumerable: true,
    get: function get() {
      return _sameAs.default;
    }
  });
  Object.defineProperty(exports, "url", {
    enumerable: true,
    get: function get() {
      return _url.default;
    }
  });
  Object.defineProperty(exports, "or", {
    enumerable: true,
    get: function get() {
      return _or.default;
    }
  });
  Object.defineProperty(exports, "and", {
    enumerable: true,
    get: function get() {
      return _and.default;
    }
  });
  Object.defineProperty(exports, "not", {
    enumerable: true,
    get: function get() {
      return _not.default;
    }
  });
  Object.defineProperty(exports, "minValue", {
    enumerable: true,
    get: function get() {
      return _minValue.default;
    }
  });
  Object.defineProperty(exports, "maxValue", {
    enumerable: true,
    get: function get() {
      return _maxValue.default;
    }
  });
  Object.defineProperty(exports, "integer", {
    enumerable: true,
    get: function get() {
      return _integer.default;
    }
  });
  Object.defineProperty(exports, "decimal", {
    enumerable: true,
    get: function get() {
      return _decimal.default;
    }
  });
  exports.helpers = void 0;

  var _alpha = _interopRequireDefault(alpha);

  var _alphaNum = _interopRequireDefault(alphaNum);

  var _numeric = _interopRequireDefault(numeric);

  var _between = _interopRequireDefault(between);

  var _email = _interopRequireDefault(email);

  var _ipAddress = _interopRequireDefault(ipAddress);

  var _macAddress = _interopRequireDefault(macAddress);

  var _maxLength = _interopRequireDefault(maxLength);

  var _minLength = _interopRequireDefault(minLength);

  var _required = _interopRequireDefault(required);

  var _requiredIf = _interopRequireDefault(requiredIf);

  var _requiredUnless = _interopRequireDefault(requiredUnless);

  var _sameAs = _interopRequireDefault(sameAs);

  var _url = _interopRequireDefault(url);

  var _or = _interopRequireDefault(or);

  var _and = _interopRequireDefault(and);

  var _not = _interopRequireDefault(not);

  var _minValue = _interopRequireDefault(minValue);

  var _maxValue = _interopRequireDefault(maxValue);

  var _integer = _interopRequireDefault(integer);

  var _decimal = _interopRequireDefault(decimal);

  var helpers = _interopRequireWildcard(common);

  exports.helpers = helpers;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  });

  unwrapExports(validators);
  var validators_1 = validators.alpha;
  var validators_2 = validators.alphaNum;
  var validators_3 = validators.numeric;
  var validators_4 = validators.between;
  var validators_5 = validators.email;
  var validators_6 = validators.ipAddress;
  var validators_7 = validators.macAddress;
  var validators_8 = validators.maxLength;
  var validators_9 = validators.minLength;
  var validators_10 = validators.required;
  var validators_11 = validators.requiredIf;
  var validators_12 = validators.requiredUnless;
  var validators_13 = validators.sameAs;
  var validators_14 = validators.url;
  var validators_15 = validators.or;
  var validators_16 = validators.and;
  var validators_17 = validators.not;
  var validators_18 = validators.minValue;
  var validators_19 = validators.maxValue;
  var validators_20 = validators.integer;
  var validators_21 = validators.decimal;
  var validators_22 = validators.helpers;

  //
  var script$1 = {
      name: 'SignUpForm',
      props: {
          heading: String,
          buttonText: String,
          server: String
      },
      data () {
          return {
              name: '',
              email: '',
              password: '',
              passwordConfirm: ''
          }
      },
      validations: {
          name: {
              required: validators_10
          },
          email: {
              email: validators_5
          },
          password: {
              required: validators_10,
              minLength: validators_9(6)
          },
          passwordConfirm: {
              required: validators_10,
              minLength: validators_9(6),
              sameAs: validators_13('password')
          }
      },
      methods: {
          onSubmitClick () {
              console.debug('Email is valid:', !this.$v.email.$error);
              // Clear errors
              // this.authError = false

              // Object.keys(this.$refs).forEach(loc => {
              //     this.$refs[loc].classList.remove('error')
              // })

              // // Build request
              // let params = new URLSearchParams()
              // params.append('username', this.form.username)
              // params.append('password', this.form.password)

              // fetch(`${this.server}/login`, {
              //     method: 'POST',
              //     headers: {
              //         'Content-Type': 'application/x-www-form-urlencoded'
              //     },
              //     body: params,
              //     redirect: 'manual'
              // })
              // .then(response => {
              //     if (response.status === 401) {
              //         this.authError = true
              //     } else if (response.type === 'opaqueredirect') {
              //         // Success
              //         window.location.href = response.url
              //     } else if (!response.ok) {
              //         response.json().then(json => {
              //             json.detail.forEach(error => {
              //                 error.loc.forEach(loc => {
              //                     if (this.$refs[loc]) {
              //                         this.$refs[loc].classList.add('error')
              //                     }
              //                 })
              //             })
              //         })
              //     }
              // })
              // .catch(response => {
              //     console.debug('Error signing in or parsing response', response)
              // })
          }
      },
      mixins: [lib_3]
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "sign-up-form__wrapper" }, [
      _c(
        "form",
        {
          staticClass: "form",
          on: {
            submit: function($event) {
              $event.preventDefault();
              return _vm.onSubmitClick($event)
            }
          }
        },
        [
          _c("h2", { staticClass: "msg" }, [_vm._v(_vm._s(_vm.heading))]),
          _vm._v(" "),
          _c("div", { staticClass: "form-group" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model.trim.lazy",
                  value: _vm.$v.name.$model,
                  expression: "$v.name.$model",
                  modifiers: { trim: true, lazy: true }
                }
              ],
              ref: "name",
              staticClass: "form-control",
              class: { error: _vm.$v.name.$error },
              attrs: { type: "text", name: "name", placeholder: "Name" },
              domProps: { value: _vm.$v.name.$model },
              on: {
                change: function($event) {
                  _vm.$set(_vm.$v.name, "$model", $event.target.value.trim());
                },
                blur: function($event) {
                  return _vm.$forceUpdate()
                }
              }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "form-group" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model.trim.lazy",
                  value: _vm.$v.email.$model,
                  expression: "$v.email.$model",
                  modifiers: { trim: true, lazy: true }
                }
              ],
              ref: "email",
              staticClass: "form-control",
              class: { error: _vm.$v.email.$error },
              attrs: { type: "email", name: "email", placeholder: "Email" },
              domProps: { value: _vm.$v.email.$model },
              on: {
                change: function($event) {
                  _vm.$set(_vm.$v.email, "$model", $event.target.value.trim());
                },
                blur: function($event) {
                  return _vm.$forceUpdate()
                }
              }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "form-group" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model.lazy",
                  value: _vm.$v.password.$model,
                  expression: "$v.password.$model",
                  modifiers: { lazy: true }
                }
              ],
              ref: "password",
              staticClass: "form-control",
              class: { error: _vm.$v.password.$error },
              attrs: {
                type: "password",
                name: "password",
                placeholder: "Password"
              },
              domProps: { value: _vm.$v.password.$model },
              on: {
                change: function($event) {
                  return _vm.$set(_vm.$v.password, "$model", $event.target.value)
                }
              }
            }),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model.lazy",
                  value: _vm.$v.passwordConfirm.$model,
                  expression: "$v.passwordConfirm.$model",
                  modifiers: { lazy: true }
                }
              ],
              ref: "passwordConfirm",
              staticClass: "form-control password-confirm",
              class: { error: _vm.$v.passwordConfirm.$error },
              attrs: {
                type: "password",
                name: "passwordConfirm",
                placeholder: "Confirm password"
              },
              domProps: { value: _vm.$v.passwordConfirm.$model },
              on: {
                change: function($event) {
                  return _vm.$set(
                    _vm.$v.passwordConfirm,
                    "$model",
                    $event.target.value
                  )
                }
              }
            }),
            _vm._v(" "),
            _vm.$v.passwordConfirm.$dirty && !_vm.$v.passwordConfirm.sameAs
              ? _c("span", { staticClass: "error-message" }, [
                  _vm._v("Passwords do not match.")
                ])
              : _vm._e(),
            _vm._v(" "),
            !_vm.$v.passwordConfirm.minLength
              ? _c("span", { staticClass: "error-message" }, [
                  _vm._v("Password must be at least 6 characters.")
                ])
              : _vm._e()
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "form-group" }, [
            _c(
              "button",
              {
                staticClass: "btn btn-primary btn-lg btn-block",
                attrs: { type: "submit" }
              },
              [_vm._v(_vm._s(_vm.buttonText))]
            )
          ])
        ]
      )
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-dee6dd4c_0", { source: ".sign-up-form__wrapper {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #212529;\n  width: 350px;\n}\n.sign-up-form__wrapper *, .sign-up-form__wrapper ::after, .sign-up-form__wrapper ::before {\n  box-sizing: border-box;\n}\n.sign-up-form__wrapper .msg {\n  font-size: 22px;\n  margin: 0 0 25px;\n}\n.sign-up-form__wrapper .form {\n  display: block;\n  color: #7a7a7a;\n  border-radius: 2px;\n  font-size: 13px;\n  background: #ececec;\n  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\n  padding: 30px;\n  position: relative;\n}\n.sign-up-form__wrapper .form-group {\n  margin-bottom: 1rem;\n}\n.sign-up-form__wrapper .form-control {\n  display: block;\n  width: 100%;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  border-radius: 2px;\n  min-height: 41px;\n  background: #fff;\n  border: 1px solid #e3e3e3;\n  box-shadow: none !important;\n}\n.sign-up-form__wrapper .form-control:focus {\n  outline: 0;\n}\n.sign-up-form__wrapper .password-confirm {\n  margin-top: -2px;\n  border-top-left-radius: 0px;\n  border-top-right-radius: 0px;\n}\n.sign-up-form__wrapper .btn {\n  display: block;\n  border-radius: 2px;\n  width: 100%;\n  padding: 0.5rem 1rem;\n  line-height: 1.5;\n  font-size: 16px;\n  font-weight: bold;\n  background: #fa225b;\n  border: none;\n  margin-bottom: 20px;\n  color: #fff;\n}\n.sign-up-form__wrapper .form-control.error, .sign-up-form__wrapper .form-control.vf-invalid {\n  border-color: #d9534f;\n  background: #fff0f4;\n}\n.sign-up-form__wrapper .error-message {\n  color: #d9534f;\n  font-size: 0.8rem;\n}\n.sign-up-form__wrapper .alert {\n  position: relative;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 1rem;\n  border: 1px solid transparent;\n  border-radius: 0.25rem;\n}\n.sign-up-form__wrapper .alert-danger {\n  color: #721c24;\n  background-color: #f8d7da;\n  border-color: #f5c6cb;\n}\n\n/*# sourceMappingURL=SignUpForm.vue.map */", map: {"version":3,"sources":["/Users/dylan/dev/zuar/frontendtoolbox/src/elements/SignUpForm/SignUpForm.vue","SignUpForm.vue"],"names":[],"mappings":"AA+IA;EACA,iKAAA;EACA,mCAAA;EACA,kCAAA;EACA,kBAAA;EACA,cAAA;EACA,YAAA;AC9IA;ADgJA;EACA,sBAAA;AC9IA;ADiJA;EACA,eAAA;EACA,gBAAA;AC/IA;ADkJA;EACA,cAAA;EACA,cAAA;EACA,kBAAA;EACA,eAAA;EACA,mBAAA;EACA,0CAAA;EACA,aAAA;EACA,kBAAA;AChJA;ADkJA;EACA,mBAAA;AChJA;ADkJA;EACA,cAAA;EACA,WAAA;EACA,yBAAA;EACA,eAAA;EACA,gBAAA;EACA,kBAAA;EACA,gBAAA;EACA,gBAAA;EACA,yBAAA;EACA,2BAAA;AChJA;ADkJA;EACA,UAAA;AChJA;ADkJA;EACA,gBAAA;EACA,2BAAA;EACA,4BAAA;AChJA;ADkJA;EACA,cAAA;EACA,kBAAA;EACA,WAAA;EACA,oBAAA;EACA,gBAAA;EACA,eAAA;EACA,iBAAA;EACA,mBAAA;EACA,YAAA;EACA,mBAAA;EACA,WAAA;AChJA;ADmJA;EACA,qBAAA;EACA,mBAAA;ACjJA;ADmJA;EACA,cAAA;EACA,iBAAA;ACjJA;ADoJA;EACA,kBAAA;EACA,wBAAA;EACA,mBAAA;EACA,6BAAA;EACA,sBAAA;AClJA;ADoJA;EACA,cAAA;EACA,yBAAA;EACA,qBAAA;AClJA;;AAEA,yCAAyC","file":"SignUpForm.vue","sourcesContent":["<template>\n    <div class=\"sign-up-form__wrapper\">\n        <form\n            class=\"form\"\n            @submit.prevent=\"onSubmitClick\">\n            <h2 class=\"msg\">{{heading}}</h2>\n            <div class=\"form-group\">\n                <input \n                    type=\"text\" \n                    class=\"form-control\" \n                    :class=\"{'error': $v.name.$error}\"\n                    name=\"name\" \n                    placeholder=\"Name\"\n                    ref=\"name\"\n                    v-model.trim.lazy=\"$v.name.$model\" />\n            </div>\n            <div class=\"form-group\">\n                <input \n                    type=\"email\" \n                    class=\"form-control\"\n                    :class=\"{'error': $v.email.$error}\"\n                    name=\"email\" \n                    placeholder=\"Email\"\n                    ref=\"email\"\n                    v-model.trim.lazy=\"$v.email.$model\" />\n            </div>\n            <div class=\"form-group\">\n                <input \n                    type=\"password\"   \n                    class=\"form-control\"\n                    :class=\"{'error': $v.password.$error}\"\n                    name=\"password\" \n                    placeholder=\"Password\" \n                    ref=\"password\"\n                    v-model.lazy=\"$v.password.$model\">\n                <input \n                    type=\"password\" \n                    class=\"form-control password-confirm\"\n                    :class=\"{'error': $v.passwordConfirm.$error}\"\n                    name=\"passwordConfirm\" \n                    placeholder=\"Confirm password\" \n                    ref=\"passwordConfirm\"\n                    v-model.lazy=\"$v.passwordConfirm.$model\">\n                <span class=\"error-message\" v-if=\"$v.passwordConfirm.$dirty && !$v.passwordConfirm.sameAs\">Passwords do not match.</span>\n                <span class=\"error-message\" v-if=\"!$v.passwordConfirm.minLength\">Password must be at least 6 characters.</span>\n            </div>\n            \n            <div class=\"form-group\">\n                <button \n                    type=\"submit\"\n                    class=\"btn btn-primary btn-lg btn-block\">{{buttonText}}</button>\n            </div>\n        </form>\n    </div>\n</template>\n\n<script>\n    import { validationMixin } from 'vuelidate'\n    import { sameAs, required, minLength, email } from 'vuelidate/lib/validators'\n    export default {\n        name: 'SignUpForm',\n        props: {\n            heading: String,\n            buttonText: String,\n            server: String\n        },\n        data () {\n            return {\n                name: '',\n                email: '',\n                password: '',\n                passwordConfirm: ''\n            }\n        },\n        validations: {\n            name: {\n                required\n            },\n            email: {\n                email\n            },\n            password: {\n                required,\n                minLength: minLength(6)\n            },\n            passwordConfirm: {\n                required,\n                minLength: minLength(6),\n                sameAs: sameAs('password')\n            }\n        },\n        methods: {\n            onSubmitClick () {\n                console.debug('Email is valid:', !this.$v.email.$error)\n                // Clear errors\n                // this.authError = false\n\n                // Object.keys(this.$refs).forEach(loc => {\n                //     this.$refs[loc].classList.remove('error')\n                // })\n\n                // // Build request\n                // let params = new URLSearchParams()\n                // params.append('username', this.form.username)\n                // params.append('password', this.form.password)\n\n                // fetch(`${this.server}/login`, {\n                //     method: 'POST',\n                //     headers: {\n                //         'Content-Type': 'application/x-www-form-urlencoded'\n                //     },\n                //     body: params,\n                //     redirect: 'manual'\n                // })\n                // .then(response => {\n                //     if (response.status === 401) {\n                //         this.authError = true\n                //     } else if (response.type === 'opaqueredirect') {\n                //         // Success\n                //         window.location.href = response.url\n                //     } else if (!response.ok) {\n                //         response.json().then(json => {\n                //             json.detail.forEach(error => {\n                //                 error.loc.forEach(loc => {\n                //                     if (this.$refs[loc]) {\n                //                         this.$refs[loc].classList.add('error')\n                //                     }\n                //                 })\n                //             })\n                //         })\n                //     }\n                // })\n                // .catch(response => {\n                //     console.debug('Error signing in or parsing response', response)\n                // })\n            }\n        },\n        mixins: [validationMixin]\n    }\n</script>\n\n<style lang=\"scss\">\n    \n    .sign-up-form__wrapper {\n        font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";\n        -webkit-font-smoothing: antialiased;\n        -moz-osx-font-smoothing: grayscale;\n        text-align: center;\n        color: #212529;\n        width: 350px;\n\n        *, ::after, ::before {\n            box-sizing: border-box;\n        }\n        \n        .msg {\n            font-size: 22px;\n            margin: 0 0 25px;\n        }\n\n        .form {\n            display: block;\n            color: #7a7a7a;\n            border-radius: 2px;\n            font-size: 13px;\n            background: #ececec;\n            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\n            padding: 30px;\n            position: relative;\n        }\n        .form-group {\n            margin-bottom: 1rem;\n        }\n        .form-control {\n            display: block;\n            width: 100%;\n            padding: .375rem .75rem;\n            font-size: 1rem;\n            line-height: 1.5;\n            border-radius: 2px;\n            min-height: 41px;\n            background: #fff;\n            border: 1px solid #e3e3e3;\n            box-shadow: none !important;\n        }\n        .form-control:focus {\n            outline: 0;\n        }\n        .password-confirm {\n            margin-top: -2px;\n            border-top-left-radius: 0px;\n            border-top-right-radius: 0px;\n        }\n        .btn {\n            display: block;\n            border-radius: 2px;\n            width: 100%;\n            padding: .5rem 1rem;\n            line-height: 1.5;\n            font-size: 16px;\n            font-weight: bold;\n            background: #fa225b;\n            border: none;\n            margin-bottom: 20px;\n            color: #fff;\n        }\n\n        .form-control.error, .form-control.vf-invalid {\n            border-color: #d9534f;\n            background: #fff0f4;\n        }\n        .error-message {\n            color: #d9534f;\n            font-size: .8rem;\n        }\n\n        .alert {\n            position: relative;\n            padding: .75rem 1.25rem;\n            margin-bottom: 1rem;\n            border: 1px solid transparent;\n            border-radius: .25rem;\n        }\n        .alert-danger {\n            color: #721c24;\n            background-color: #f8d7da;\n            border-color: #f5c6cb;\n        }\n    }\n</style>\n",".sign-up-form__wrapper {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #212529;\n  width: 350px;\n}\n.sign-up-form__wrapper *, .sign-up-form__wrapper ::after, .sign-up-form__wrapper ::before {\n  box-sizing: border-box;\n}\n.sign-up-form__wrapper .msg {\n  font-size: 22px;\n  margin: 0 0 25px;\n}\n.sign-up-form__wrapper .form {\n  display: block;\n  color: #7a7a7a;\n  border-radius: 2px;\n  font-size: 13px;\n  background: #ececec;\n  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\n  padding: 30px;\n  position: relative;\n}\n.sign-up-form__wrapper .form-group {\n  margin-bottom: 1rem;\n}\n.sign-up-form__wrapper .form-control {\n  display: block;\n  width: 100%;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  border-radius: 2px;\n  min-height: 41px;\n  background: #fff;\n  border: 1px solid #e3e3e3;\n  box-shadow: none !important;\n}\n.sign-up-form__wrapper .form-control:focus {\n  outline: 0;\n}\n.sign-up-form__wrapper .password-confirm {\n  margin-top: -2px;\n  border-top-left-radius: 0px;\n  border-top-right-radius: 0px;\n}\n.sign-up-form__wrapper .btn {\n  display: block;\n  border-radius: 2px;\n  width: 100%;\n  padding: 0.5rem 1rem;\n  line-height: 1.5;\n  font-size: 16px;\n  font-weight: bold;\n  background: #fa225b;\n  border: none;\n  margin-bottom: 20px;\n  color: #fff;\n}\n.sign-up-form__wrapper .form-control.error, .sign-up-form__wrapper .form-control.vf-invalid {\n  border-color: #d9534f;\n  background: #fff0f4;\n}\n.sign-up-form__wrapper .error-message {\n  color: #d9534f;\n  font-size: 0.8rem;\n}\n.sign-up-form__wrapper .alert {\n  position: relative;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 1rem;\n  border: 1px solid transparent;\n  border-radius: 0.25rem;\n}\n.sign-up-form__wrapper .alert-danger {\n  color: #721c24;\n  background-color: #f8d7da;\n  border-color: #f5c6cb;\n}\n\n/*# sourceMappingURL=SignUpForm.vue.map */"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      createInjector,
      undefined,
      undefined
    );

  var vueTranslate_common = createCommonjsModule(function (module, exports) {

  // We need a vue instance to handle reactivity
  var vm = null;

  // The plugin
  var VueTranslate = {

      // Install the method
      install: function (Vue) {
          var _Vue$mixin;

          var version = Vue.version[0];

          if (!vm) {
              vm = new Vue({
                  data: function () {
                      return {
                          current: '',
                          locales: {}
                      };
                  },


                  computed: {
                      // Current selected language
                      lang: function () {
                          return this.current;
                      },


                      // Current locale values
                      locale: function () {
                          if (!this.locales[this.current]) return null;

                          return this.locales[this.current];
                      }
                  },

                  methods: {
                      // Set a language as current
                      setLang: function (val) {
                          if (this.current !== val) {
                              if (this.current === '') {
                                  this.$emit('language:init', val);
                              } else {
                                  this.$emit('language:changed', val);
                              }
                          }

                          this.current = val;

                          this.$emit('language:modified', val);
                      },


                      // Set a locale tu use
                      setLocales: function (locales) {
                          if (!locales) return;

                          var newLocale = Object.create(this.locales);

                          for (var key in locales) {
                              if (!newLocale[key]) newLocale[key] = {};

                              Vue.util.extend(newLocale[key], locales[key]);
                          }

                          this.locales = Object.create(newLocale);

                          this.$emit('locales:loaded', locales);
                      },
                      text: function (t) {
                          if (!this.locale || !this.locale[t]) {
                              return t;
                          }

                          return this.locale[t];
                      },
                      textWithParams: function (t) {
                          var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                          if (!this.locale || !this.locale[t]) {
                              return t;
                          }

                          if (!this.params || this.params === null || typeof this.params === 'undefined') {
                              return t;
                          }

                          Object.keys(params).forEach(function (key) {
                              t = t.replace('%' + key + '%', params[key]);
                          });

                          return t;
                      }
                  }
              });

              Vue.prototype.$translate = vm;
          }

          // Mixin to read locales and add the translation method and directive
          Vue.mixin((_Vue$mixin = {}, _Vue$mixin[version === '1' ? 'init' : 'beforeCreate'] = function () {
              this.$translate.setLocales(this.$options.locales);
          }, _Vue$mixin.methods = {
              // An alias for the .$translate.text method
              t: function (t) {
                  return this.$translate.text(t);
              },
              tWithParams: function (t, params) {
                  return this.$translate.text(t, params);
              }
          }, _Vue$mixin.directives = {
              translate: function (el) {
                  if (!el.$translateKey) el.$translateKey = el.innerText;

                  var text = this.$translate.text(el.$translateKey);

                  el.innerText = text;
              }.bind(vm)
          }, _Vue$mixin));

          // Global method for loading locales
          Vue.locales = function (locales) {
              vm.$translate.setLocales(locales);
          };

          // Global method for setting languages
          Vue.lang = function (lang) {
              vm.$translate.setLang(lang);
          };
      }
  };

  {
      module.exports = VueTranslate; // CommonJS
  }
  });

  //
  Vue.use(vueTranslate_common);
  var script$2 = {
      name: 'SubscribeModal',
      props: {
          server: String,
          openModal: Boolean, // Requested modal state
          email: String, // Subscription Email
          selectedDashboardId: String,
          translations: String,
          locale: String
      },
      data: () => {
          return {
              dashboards: [{name: 'All', id: 0}],
              currentDashboard: {},
              frequencies: ['DAILY', 'WEEKLY', 'MONTHLY'],
              frequencySettingsWeekly: [{value: 0, label: 'MONDAY'}, {value: 1, label: 'TUESDAY'}, {value: 2, label: 'WEDNESDAY'}, {value: 3, label: 'THURSDAY'}, {value: 4, label: 'FRIDAY'}, {value: 5, label: 'SATURDAY'}, {value: 6, label: 'SUNDAY'}],
              frequencySettingsMonthly: Array(31),
              minutes: ['00', '15', '30', '45'],
              hours: Array(12),
              formState: {
                  dashboard: null,
                  frequency: '',
                  dayOfWeek: null,
                  dayOfMonth: null,
                  hour: 8,
                  minute: '',
                  ampm: ''
              },
              disabled: false,
              success: false,
              error: false,
              i18n: {},
              isOpen: false // Actual modal state
          };
      },
      watch: {
          server: function (newServer, oldServer) {
              if (newServer) {
                  this.fetchDashboards();
              }
          },
          selectedDashboardId: function (newSelectedDashboardId) {
              this.setSelectedDashboard(newSelectedDashboardId);
          },
          openModal: function (val) {
          	if (val === this.isOpen) {
          		// Already in requested state
          		return;
          	}
              if (val) {
                  this.open();

                  if (!this.email) {
                      this.error = 'No email found for user. Cannot create subscription.';
                      this.disabled = true;
                  }
              } else {
                  this.close();
                  this.reset();
              }
          },
          translations: function (val) {
              if (this.translations && this.locale) {
                  this.$translate.setLocales(JSON.parse(this.translations));
                  this.$translate.setLang(this.locale);
              }
          },
          locale: function (val) {
              if (this.translations && this.locale) {
                  this.$translate.setLocales(JSON.parse(this.translations));
                  this.$translate.setLang(this.locale);
              }
          }
      },
      mounted () {
          if (this.translations && this.locale) {
              this.$translate.setLocales(JSON.parse(this.translations));
              this.$translate.setLang(this.locale);
          }
      },
      created () {
          if (this.server) {
              this.fetchDashboards();
          }
          this.reset();
      },
      methods: {
          fetchDashboards () {
              fetch(`${this.server}/api/dashboards`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              .then(this.handleResponse)
              .then(data => {
                  // Success
                  this.dashboards.push(...data);
                  if (this.selectedDashboardId) {
                      this.setSelectedDashboard(this.selectedDashboardId);
                  }
              })
              .catch(error => {
                  console.debug('Error fetching dashboards', error);
                  this.error = error.statusText;
                  if (error.detail) {
                      this.error += `: ${error.detail}`;
                  }
                 
              });
          },
          setSelectedDashboard (dashboardId) {
              console.debug('Setting selected dashboard');
              if (dashboardId) {
                  this.dashboards.forEach(dashboard => {
                      if (dashboard.id === dashboardId) {
                          this.formState.dashboard = dashboard;
                          this.currentDashboard = dashboard; // In case user selects 'All'
                          console.debug(' to: ', dashboard);
                      }
                  });
              }
          },
          onCancelClick () {
              this.close();
              this.reset();
          },
          onSaveClick () {
              this.disabled = true;
              
              let subscription = {
                  email: this.email,
                  view_name: this.formState.dashboard.id != 0 ? this.getViewName(this.formState.dashboard.url) : this.getViewName(this.currentDashboard.url),
                  schedule: this.formState.frequency, // daily, weekly, monthly
                  day_of: this.formState.frequency === 'DAILY' ? 0 : this.formState.frequency === 'WEEKLY' ? this.formState.dayOfWeek : this.formState.dayOfMonth,
                  send_at: `${this.formState.hour}:${this.formState.minute} ${this.formState.ampm}`, // "8:00 am"
                  tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  full: this.formState.dashboard.id === 0
              };

              fetch(`${this.server}/auth/subscriptions`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(subscription)
              })
              .then(this.handleResponse)
              .then(json => {
                  let event = new Event('subscription-created.ft', {subscription: json.detail});
                  document.dispatchEvent(event);
                  this.success = true;
                  setTimeout(() => {
                      this.close();
                      this.reset();
                  }, 1000);
              })
              .catch(error => {
                  // response.json().then(json => {
                  //     json.detail.forEach(error => {
                  //         error.loc.forEach(loc => {
                  //             if (this.$refs[loc]) {
                  //                 this.$refs[loc].classList.add('error')
                  //             }
                  //         })
                  //     })
                  // });

                  console.debug('Error creating subscription or parsing response', error);
                  this.error = error.statusText;
                  if (error.detail) {
                      this.error += `: ${error.detail}`;
                  }
                 
              });
          },
          getViewName (url) {
              return url.split('/views/').pop().split('?')[0];
          },
          handleResponse (response) {
              return response.json()
                  .then((json) => {
                      if (!response.ok) {
                          const error = Object.assign({}, json, {
                              status: response.status,
                              statusText: response.statusText,
                          });

                          return Promise.reject(error);
                      }
                      return json;
                  });
          },
          open () {
              document.body.appendChild(this.$refs.modalWrapper);
              this.isOpen = true;
          },
          close () {
              this.$refs.modalTemplate.appendChild(this.$refs.modalWrapper);
              this.isOpen = false;
              if (typeof this.onClose === 'function') {
              	this.onClose();
              }
          },
          reset () {
              this.success = false;
              this.disabled = false;
              this.error = false;
              this.formState.dashboard = this.dashboards[0];
              this.formState.frequency = this.frequencies[0];
              this.formState.dayOfWeek = this.frequencySettingsWeekly[0].value;
              this.formState.dayOfMonth = 1;
              this.formState.hour = 8;
              this.formState.minute = this.minutes[0];
              this.formState.ampm = 'am';
          },
          onBackdropClick (e) {
              if (e.target === this.$refs.modalWrapper) {
                  this.close();
              }
          }
      }
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        directives: [
          { name: "show", rawName: "v-show", value: false, expression: "false" }
        ],
        ref: "modalTemplate"
      },
      [
        _c(
          "div",
          {
            ref: "modalWrapper",
            staticClass: "modal-window subscribe-modal",
            on: { click: _vm.onBackdropClick }
          },
          [
            _c("div", { staticClass: "modal-dialog modal-md" }, [
              _c("div", { staticClass: "modal-content" }, [
                _c("header", { staticClass: "modal-header" }, [
                  _c("h3", { staticClass: "modal-title" }, [
                    _vm._v(_vm._s(_vm.t("SUBSCRIBE")))
                  ])
                ]),
                _vm._v(" "),
                _c("main", { staticClass: "modal-body" }, [
                  _c("div", { staticClass: "container-fluid" }, [
                    _c("div", { staticClass: "row" }, [
                      _c("div", { staticClass: "col" }, [
                        _c(
                          "form",
                          { staticClass: "form", attrs: { novalidate: "" } },
                          [
                            _c("div", { staticClass: "form-group" }, [
                              _c("label", { attrs: { for: "dashboard" } }, [
                                _vm._v(_vm._s(_vm.t("DASHBOARD")))
                              ]),
                              _vm._v(" "),
                              _c(
                                "select",
                                {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.formState.dashboard,
                                      expression: "formState.dashboard"
                                    }
                                  ],
                                  ref: "dashboard",
                                  staticClass: "form-control",
                                  attrs: {
                                    name: "dashboard",
                                    placeholder: "Dashboard",
                                    required: true,
                                    disabled: _vm.disabled
                                  },
                                  on: {
                                    change: function($event) {
                                      var $$selectedVal = Array.prototype.filter
                                        .call($event.target.options, function(o) {
                                          return o.selected
                                        })
                                        .map(function(o) {
                                          var val =
                                            "_value" in o ? o._value : o.value;
                                          return val
                                        });
                                      _vm.$set(
                                        _vm.formState,
                                        "dashboard",
                                        $event.target.multiple
                                          ? $$selectedVal
                                          : $$selectedVal[0]
                                      );
                                    }
                                  }
                                },
                                _vm._l(_vm.dashboards, function(dashboard) {
                                  return _c(
                                    "option",
                                    { domProps: { value: dashboard } },
                                    [
                                      _vm._v(
                                        "\n                                                    " +
                                          _vm._s(_vm.t(dashboard.name)) +
                                          "\n                                                "
                                      )
                                    ]
                                  )
                                }),
                                0
                              )
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "form-group" }, [
                              _c(
                                "div",
                                { staticClass: "form-group-horizontal" },
                                [
                                  _c("div", [
                                    _c("label", { attrs: { for: "frequency" } }, [
                                      _vm._v(_vm._s(_vm.t("FREQUENCY")))
                                    ]),
                                    _vm._v(" "),
                                    _c(
                                      "select",
                                      {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value: _vm.formState.frequency,
                                            expression: "formState.frequency"
                                          }
                                        ],
                                        ref: "frequency",
                                        staticClass: "form-control",
                                        attrs: {
                                          name: "frequency",
                                          placeholder: "Frequency",
                                          required: true,
                                          disabled: _vm.disabled
                                        },
                                        on: {
                                          change: function($event) {
                                            var $$selectedVal = Array.prototype.filter
                                              .call(
                                                $event.target.options,
                                                function(o) {
                                                  return o.selected
                                                }
                                              )
                                              .map(function(o) {
                                                var val =
                                                  "_value" in o
                                                    ? o._value
                                                    : o.value;
                                                return val
                                              });
                                            _vm.$set(
                                              _vm.formState,
                                              "frequency",
                                              $event.target.multiple
                                                ? $$selectedVal
                                                : $$selectedVal[0]
                                            );
                                          }
                                        }
                                      },
                                      _vm._l(_vm.frequencies, function(
                                        frequency
                                      ) {
                                        return _c(
                                          "option",
                                          { domProps: { value: frequency } },
                                          [
                                            _vm._v(
                                              "\n                                                            " +
                                                _vm._s(_vm.t(frequency)) +
                                                "\n                                                        "
                                            )
                                          ]
                                        )
                                      }),
                                      0
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _vm.formState.frequency === "WEEKLY"
                                    ? _c("div", [
                                        _c(
                                          "label",
                                          { attrs: { for: "frequency" } },
                                          [_vm._v(_vm._s(_vm.t("DAY_OF_WEEK")))]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "select",
                                          {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.formState.dayOfWeek,
                                                expression: "formState.dayOfWeek"
                                              }
                                            ],
                                            ref: "frequency",
                                            staticClass: "form-control",
                                            attrs: {
                                              name: "frequency",
                                              placeholder: "Frequency",
                                              required: true,
                                              disabled: _vm.disabled
                                            },
                                            on: {
                                              change: function($event) {
                                                var $$selectedVal = Array.prototype.filter
                                                  .call(
                                                    $event.target.options,
                                                    function(o) {
                                                      return o.selected
                                                    }
                                                  )
                                                  .map(function(o) {
                                                    var val =
                                                      "_value" in o
                                                        ? o._value
                                                        : o.value;
                                                    return val
                                                  });
                                                _vm.$set(
                                                  _vm.formState,
                                                  "dayOfWeek",
                                                  $event.target.multiple
                                                    ? $$selectedVal
                                                    : $$selectedVal[0]
                                                );
                                              }
                                            }
                                          },
                                          _vm._l(
                                            _vm.frequencySettingsWeekly,
                                            function(dayOfWeek) {
                                              return _c(
                                                "option",
                                                {
                                                  domProps: {
                                                    value: dayOfWeek.value
                                                  }
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                                            " +
                                                      _vm._s(
                                                        _vm.t(dayOfWeek.label)
                                                      ) +
                                                      "\n                                                        "
                                                  )
                                                ]
                                              )
                                            }
                                          ),
                                          0
                                        )
                                      ])
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _vm.formState.frequency === "MONTHLY"
                                    ? _c("div", [
                                        _c(
                                          "label",
                                          { attrs: { for: "frequency" } },
                                          [_vm._v(_vm._s(_vm.t("DAY_OF_MONTH")))]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "select",
                                          {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.formState.dayOfMonth,
                                                expression: "formState.dayOfMonth"
                                              }
                                            ],
                                            ref: "frequency",
                                            staticClass: "form-control",
                                            attrs: {
                                              name: "frequency",
                                              placeholder: "Frequency",
                                              required: true,
                                              disabled: _vm.disabled
                                            },
                                            on: {
                                              change: function($event) {
                                                var $$selectedVal = Array.prototype.filter
                                                  .call(
                                                    $event.target.options,
                                                    function(o) {
                                                      return o.selected
                                                    }
                                                  )
                                                  .map(function(o) {
                                                    var val =
                                                      "_value" in o
                                                        ? o._value
                                                        : o.value;
                                                    return val
                                                  });
                                                _vm.$set(
                                                  _vm.formState,
                                                  "dayOfMonth",
                                                  $event.target.multiple
                                                    ? $$selectedVal
                                                    : $$selectedVal[0]
                                                );
                                              }
                                            }
                                          },
                                          _vm._l(
                                            _vm.frequencySettingsMonthly,
                                            function(day, index) {
                                              return _c(
                                                "option",
                                                {
                                                  domProps: { value: index + 1 }
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                                            " +
                                                      _vm._s(index + 1) +
                                                      "\n                                                        "
                                                  )
                                                ]
                                              )
                                            }
                                          ),
                                          0
                                        )
                                      ])
                                    : _vm._e()
                                ]
                              )
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "form-group" }, [
                              _c("label", { attrs: { for: "hour" } }, [
                                _vm._v(_vm._s(_vm.t("SEND_TIME")))
                              ]),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "form-group-horizontal" },
                                [
                                  _c(
                                    "select",
                                    {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.formState.hour,
                                          expression: "formState.hour"
                                        }
                                      ],
                                      ref: "hour",
                                      staticClass: "form-control",
                                      attrs: {
                                        name: "hour",
                                        placeholder: "Hour",
                                        required: true,
                                        disabled: _vm.disabled
                                      },
                                      on: {
                                        change: function($event) {
                                          var $$selectedVal = Array.prototype.filter
                                            .call($event.target.options, function(
                                              o
                                            ) {
                                              return o.selected
                                            })
                                            .map(function(o) {
                                              var val =
                                                "_value" in o ? o._value : o.value;
                                              return val
                                            });
                                          _vm.$set(
                                            _vm.formState,
                                            "hour",
                                            $event.target.multiple
                                              ? $$selectedVal
                                              : $$selectedVal[0]
                                          );
                                        }
                                      }
                                    },
                                    _vm._l(_vm.hours, function(hour, index) {
                                      return _c(
                                        "option",
                                        { domProps: { value: index + 1 } },
                                        [
                                          _vm._v(
                                            "\n                                                        " +
                                              _vm._s(index + 1) +
                                              "\n                                                    "
                                          )
                                        ]
                                      )
                                    }),
                                    0
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "select",
                                    {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.formState.minute,
                                          expression: "formState.minute"
                                        }
                                      ],
                                      ref: "minute",
                                      staticClass: "form-control",
                                      attrs: {
                                        name: "minute",
                                        placeholder: "Minute",
                                        required: true,
                                        disabled: _vm.disabled
                                      },
                                      on: {
                                        change: function($event) {
                                          var $$selectedVal = Array.prototype.filter
                                            .call($event.target.options, function(
                                              o
                                            ) {
                                              return o.selected
                                            })
                                            .map(function(o) {
                                              var val =
                                                "_value" in o ? o._value : o.value;
                                              return val
                                            });
                                          _vm.$set(
                                            _vm.formState,
                                            "minute",
                                            $event.target.multiple
                                              ? $$selectedVal
                                              : $$selectedVal[0]
                                          );
                                        }
                                      }
                                    },
                                    _vm._l(_vm.minutes, function(minute) {
                                      return _c(
                                        "option",
                                        { domProps: { value: minute } },
                                        [
                                          _vm._v(
                                            "\n                                                        " +
                                              _vm._s(minute) +
                                              "\n                                                    "
                                          )
                                        ]
                                      )
                                    }),
                                    0
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "select",
                                    {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.formState.ampm,
                                          expression: "formState.ampm"
                                        }
                                      ],
                                      ref: "ampm",
                                      staticClass: "form-control",
                                      attrs: {
                                        name: "ampm",
                                        placeholder: "AM/PM",
                                        required: true,
                                        disabled: _vm.disabled
                                      },
                                      on: {
                                        change: function($event) {
                                          var $$selectedVal = Array.prototype.filter
                                            .call($event.target.options, function(
                                              o
                                            ) {
                                              return o.selected
                                            })
                                            .map(function(o) {
                                              var val =
                                                "_value" in o ? o._value : o.value;
                                              return val
                                            });
                                          _vm.$set(
                                            _vm.formState,
                                            "ampm",
                                            $event.target.multiple
                                              ? $$selectedVal
                                              : $$selectedVal[0]
                                          );
                                        }
                                      }
                                    },
                                    _vm._l(["am", "pm"], function(ampm) {
                                      return _c(
                                        "option",
                                        { domProps: { value: ampm } },
                                        [
                                          _vm._v(
                                            "\n                                                        " +
                                              _vm._s(ampm) +
                                              "\n                                                    "
                                          )
                                        ]
                                      )
                                    }),
                                    0
                                  )
                                ]
                              )
                            ]),
                            _vm._v(" "),
                            _vm.success
                              ? _c(
                                  "div",
                                  {
                                    staticClass: "alert alert-success",
                                    attrs: { role: "alert" }
                                  },
                                  [
                                    _c("h4", { staticClass: "alert-heading" }, [
                                      _vm._v(_vm._s(_vm.t("CREATED")))
                                    ]),
                                    _vm._v(" "),
                                    _c("p", [
                                      _vm._v(_vm._s(_vm.t("SUB_SUCCESS_CREATED")))
                                    ])
                                  ]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.error
                              ? _c(
                                  "div",
                                  {
                                    staticClass: "alert alert-danger",
                                    attrs: { role: "alert" }
                                  },
                                  [
                                    _c("h4", { staticClass: "alert-heading" }, [
                                      _vm._v(_vm._s(_vm.t("ERROR")))
                                    ]),
                                    _vm._v(" "),
                                    _c("p", [_vm._v(_vm._s(_vm.error))])
                                  ]
                                )
                              : _vm._e()
                          ]
                        )
                      ])
                    ])
                  ])
                ]),
                _vm._v(" "),
                _c("footer", { staticClass: "modal-footer" }, [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-link",
                      on: { click: _vm.onCancelClick }
                    },
                    [_vm._v(_vm._s(_vm.t("CANCEL")))]
                  ),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-primary",
                      attrs: { disabled: _vm.disabled },
                      on: { click: _vm.onSaveClick }
                    },
                    [_vm._v(_vm._s(_vm.t("OK")))]
                  )
                ])
              ])
            ])
          ]
        )
      ]
    )
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = function (inject) {
      if (!inject) return
      inject("data-v-20bbb127_0", { source: "fieldset[disabled] .multiselect{pointer-events:none}.multiselect__spinner{position:absolute;right:1px;top:1px;width:48px;height:35px;background:#fff;display:block}.multiselect__spinner:after,.multiselect__spinner:before{position:absolute;content:\"\";top:50%;left:50%;margin:-8px 0 0 -8px;width:16px;height:16px;border-radius:100%;border:2px solid transparent;border-top-color:#41b883;box-shadow:0 0 0 1px transparent}.multiselect__spinner:before{animation:spinning 2.4s cubic-bezier(.41,.26,.2,.62);animation-iteration-count:infinite}.multiselect__spinner:after{animation:spinning 2.4s cubic-bezier(.51,.09,.21,.8);animation-iteration-count:infinite}.multiselect__loading-enter-active,.multiselect__loading-leave-active{transition:opacity .4s ease-in-out;opacity:1}.multiselect__loading-enter,.multiselect__loading-leave-active{opacity:0}.multiselect,.multiselect__input,.multiselect__single{font-family:inherit;font-size:16px;-ms-touch-action:manipulation;touch-action:manipulation}.multiselect{box-sizing:content-box;display:block;position:relative;width:100%;min-height:40px;text-align:left;color:#35495e}.multiselect *{box-sizing:border-box}.multiselect:focus{outline:none}.multiselect--disabled{background:#ededed;pointer-events:none;opacity:.6}.multiselect--active{z-index:50}.multiselect--active:not(.multiselect--above) .multiselect__current,.multiselect--active:not(.multiselect--above) .multiselect__input,.multiselect--active:not(.multiselect--above) .multiselect__tags{border-bottom-left-radius:0;border-bottom-right-radius:0}.multiselect--active .multiselect__select{transform:rotate(180deg)}.multiselect--above.multiselect--active .multiselect__current,.multiselect--above.multiselect--active .multiselect__input,.multiselect--above.multiselect--active .multiselect__tags{border-top-left-radius:0;border-top-right-radius:0}.multiselect__input,.multiselect__single{position:relative;display:inline-block;min-height:20px;line-height:20px;border:none;border-radius:5px;background:#fff;padding:0 0 0 5px;width:100%;transition:border .1s ease;box-sizing:border-box;margin-bottom:8px;vertical-align:top}.multiselect__input:-ms-input-placeholder{color:#35495e}.multiselect__input::placeholder{color:#35495e}.multiselect__tag~.multiselect__input,.multiselect__tag~.multiselect__single{width:auto}.multiselect__input:hover,.multiselect__single:hover{border-color:#cfcfcf}.multiselect__input:focus,.multiselect__single:focus{border-color:#a8a8a8;outline:none}.multiselect__single{padding-left:5px;margin-bottom:8px}.multiselect__tags-wrap{display:inline}.multiselect__tags{min-height:40px;display:block;padding:8px 40px 0 8px;border-radius:5px;border:1px solid #e8e8e8;background:#fff;font-size:14px}.multiselect__tag{position:relative;display:inline-block;padding:4px 26px 4px 10px;border-radius:5px;margin-right:10px;color:#fff;line-height:1;background:#41b883;margin-bottom:5px;white-space:nowrap;overflow:hidden;max-width:100%;text-overflow:ellipsis}.multiselect__tag-icon{cursor:pointer;margin-left:7px;position:absolute;right:0;top:0;bottom:0;font-weight:700;font-style:normal;width:22px;text-align:center;line-height:22px;transition:all .2s ease;border-radius:5px}.multiselect__tag-icon:after{content:\"\\D7\";color:#266d4d;font-size:14px}.multiselect__tag-icon:focus,.multiselect__tag-icon:hover{background:#369a6e}.multiselect__tag-icon:focus:after,.multiselect__tag-icon:hover:after{color:#fff}.multiselect__current{min-height:40px;overflow:hidden;padding:8px 30px 0 12px;white-space:nowrap;border-radius:5px;border:1px solid #e8e8e8}.multiselect__current,.multiselect__select{line-height:16px;box-sizing:border-box;display:block;margin:0;text-decoration:none;cursor:pointer}.multiselect__select{position:absolute;width:40px;height:38px;right:1px;top:1px;padding:4px 8px;text-align:center;transition:transform .2s ease}.multiselect__select:before{position:relative;right:0;top:65%;color:#999;margin-top:4px;border-color:#999 transparent transparent;border-style:solid;border-width:5px 5px 0;content:\"\"}.multiselect__placeholder{color:#adadad;display:inline-block;margin-bottom:10px;padding-top:2px}.multiselect--active .multiselect__placeholder{display:none}.multiselect__content-wrapper{position:absolute;display:block;background:#fff;width:100%;max-height:240px;overflow:auto;border:1px solid #e8e8e8;border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;z-index:50;-webkit-overflow-scrolling:touch}.multiselect__content{list-style:none;display:inline-block;padding:0;margin:0;min-width:100%;vertical-align:top}.multiselect--above .multiselect__content-wrapper{bottom:100%;border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom:none;border-top:1px solid #e8e8e8}.multiselect__content::webkit-scrollbar{display:none}.multiselect__element{display:block}.multiselect__option{display:block;padding:12px;min-height:40px;line-height:16px;text-decoration:none;text-transform:none;vertical-align:middle;position:relative;cursor:pointer;white-space:nowrap}.multiselect__option:after{top:0;right:0;position:absolute;line-height:40px;padding-right:12px;padding-left:20px;font-size:13px}.multiselect__option--highlight{background:#41b883;outline:none;color:#fff}.multiselect__option--highlight:after{content:attr(data-select);background:#41b883;color:#fff}.multiselect__option--selected{background:#f3f3f3;color:#35495e;font-weight:700}.multiselect__option--selected:after{content:attr(data-selected);color:silver}.multiselect__option--selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect--disabled .multiselect__current,.multiselect--disabled .multiselect__select{background:#ededed;color:#a6a6a6}.multiselect__option--disabled{background:#ededed!important;color:#a6a6a6!important;cursor:text;pointer-events:none}.multiselect__option--group{background:#ededed;color:#35495e}.multiselect__option--group.multiselect__option--highlight{background:#35495e;color:#fff}.multiselect__option--group.multiselect__option--highlight:after{background:#35495e}.multiselect__option--disabled.multiselect__option--highlight{background:#dedede}.multiselect__option--group-selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--group-selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect-enter-active,.multiselect-leave-active{transition:all .15s ease}.multiselect-enter,.multiselect-leave-active{opacity:0}.multiselect__strong{margin-bottom:8px;line-height:20px;display:inline-block;vertical-align:top}[dir=rtl] .multiselect{text-align:right}[dir=rtl] .multiselect__select{right:auto;left:1px}[dir=rtl] .multiselect__tags{padding:8px 8px 0 40px}[dir=rtl] .multiselect__content{text-align:right}[dir=rtl] .multiselect__option:after{right:auto;left:0}[dir=rtl] .multiselect__clear{right:auto;left:12px}[dir=rtl] .multiselect__spinner{right:auto;left:1px}@keyframes spinning{0%{transform:rotate(0)}to{transform:rotate(2turn)}}", map: undefined, media: undefined })
  ,inject("data-v-20bbb127_1", { source: ".subscribe-modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 999;\n  background-color: rgba(0, 0, 0, 0.4);\n  transition: all 0.3s;\n}\n.subscribe-modal *, .subscribe-modal ::after, .subscribe-modal ::before {\n  box-sizing: border-box;\n}\n.subscribe-modal .modal-dialog {\n  max-width: 500px;\n  position: relative;\n  margin: 1.75rem auto;\n  transition: transform 0.3s ease-out;\n}\n.subscribe-modal .modal-content {\n  height: auto;\n  background: #ffffff;\n  pointer-events: all;\n}\n.subscribe-modal .btn-primary:hover {\n  cursor: pointer;\n}\n.subscribe-modal .btn:focus {\n  outline: 0;\n}\n.subscribe-modal .form {\n  position: relative;\n}\n.subscribe-modal .form-group {\n  margin-bottom: 1rem;\n}\n.subscribe-modal .form-group-horizontal {\n  display: flex;\n  flex-direction: row;\n}\n.subscribe-modal .form-group-horizontal > * {\n  margin-left: 0.3rem;\n  width: 100%;\n}\n.subscribe-modal .form-group-horizontal > *:first-child {\n  margin-left: 0;\n}\n.subscribe-modal .form-control {\n  display: block;\n  width: 100%;\n}\n.subscribe-modal .form-control:focus {\n  outline: 0;\n}\n.subscribe-modal .modal-footer {\n  display: flex;\n  justify-content: flex-end;\n}\n\n/*# sourceMappingURL=SubscribeModal.vue.map */", map: {"version":3,"sources":["/Users/dylan/dev/zuar/frontendtoolbox/src/elements/SubscribeModal/SubscribeModal.vue","SubscribeModal.vue"],"names":[],"mappings":"AA2XA;EACA,eAAA;EACA,MAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;EACA,YAAA;EACA,oCAAA;EACA,oBAAA;AC1XA;AD2XA;EACA,sBAAA;ACzXA;AD2XA;EACA,gBAAA;EACA,kBAAA;EACA,oBAAA;EACA,mCAAA;ACzXA;AD2XA;EACA,YAAA;EACA,mBAAA;EACA,mBAAA;ACzXA;AD2XA;EACA,eAAA;ACzXA;AD2XA;EACA,UAAA;ACzXA;AD2XA;EACA,kBAAA;ACzXA;AD2XA;EACA,mBAAA;ACzXA;AD2XA;EACA,aAAA;EACA,mBAAA;ACzXA;AD2XA;EACA,mBAAA;EACA,WAAA;ACzXA;AD2XA;EACA,cAAA;ACzXA;AD2XA;EACA,cAAA;EACA,WAAA;ACzXA;AD2XA;EACA,UAAA;ACzXA;AD2XA;EACA,aAAA;EACA,yBAAA;ACzXA;;AAEA,6CAA6C","file":"SubscribeModal.vue","sourcesContent":["<template>\n\t<div v-show=\"false\" ref=\"modalTemplate\">\n        <div class=\"modal-window subscribe-modal\" ref=\"modalWrapper\" v-on:click=\"onBackdropClick\">\n            <div class=\"modal-dialog modal-md\">\n                <div class=\"modal-content\">\n                    <header class=\"modal-header\">\n                    \t<h3 class=\"modal-title\">{{ t('SUBSCRIBE') }}</h3>\n                \t</header>\n                    <main class=\"modal-body\">\n                        <div class=\"container-fluid\">\n                            <div class=\"row\">\n                                <div class=\"col\">\n                                    <form\n                                        class=\"form\"\n                                        novalidate>\n                                        <div class=\"form-group\">\n                                            <label for=\"dashboard\">{{ t('DASHBOARD') }}</label>\n                                            <select \n                                                class=\"form-control\" \n                                                name=\"dashboard\" \n                                                placeholder=\"Dashboard\"\n                                                ref=\"dashboard\"\n                                                v-model=\"formState.dashboard\"\n                                                :required=\"true\"\n                                                :disabled=\"disabled\">\n                                                <option v-for=\"dashboard in dashboards\" v-bind:value=\"dashboard\">\n                                                    {{ t(dashboard.name) }}\n                                                </option>\n                                            </select>\n                                        </div>\n                                        <div class=\"form-group\">\n                                            <div class=\"form-group-horizontal\">\n                                                <div>\n                                                    <label for=\"frequency\">{{ t('FREQUENCY') }}</label>\n                                                    <select \n                                                        class=\"form-control\" \n                                                        name=\"frequency\" \n                                                        placeholder=\"Frequency\"\n                                                        ref=\"frequency\"\n                                                        v-model=\"formState.frequency\"\n                                                        :required=\"true\"\n                                                        :disabled=\"disabled\">\n                                                        <option v-for=\"frequency in frequencies\" v-bind:value=\"frequency\">\n                                                            {{ t(frequency) }}\n                                                        </option>\n                                                    </select>\n                                                </div>\n                                                <div v-if=\"formState.frequency === 'WEEKLY'\">\n                                                    <label for=\"frequency\">{{ t('DAY_OF_WEEK') }}</label>\n                                                    <select \n                                                        class=\"form-control\" \n                                                        name=\"frequency\" \n                                                        placeholder=\"Frequency\"\n                                                        ref=\"frequency\"\n                                                        v-model=\"formState.dayOfWeek\"\n                                                        :required=\"true\"\n                                                        :disabled=\"disabled\">\n                                                        <option v-for=\"dayOfWeek in frequencySettingsWeekly\" v-bind:value=\"dayOfWeek.value\">\n                                                            {{ t(dayOfWeek.label) }}\n                                                        </option>\n                                                    </select>\n                                                </div>\n                                                <div v-if=\"formState.frequency === 'MONTHLY'\">\n                                                    <label for=\"frequency\">{{ t('DAY_OF_MONTH') }}</label>\n                                                    <select \n                                                        class=\"form-control\" \n                                                        name=\"frequency\" \n                                                        placeholder=\"Frequency\"\n                                                        ref=\"frequency\"\n                                                        v-model=\"formState.dayOfMonth\"\n                                                        :required=\"true\"\n                                                        :disabled=\"disabled\">\n                                                        <option v-for=\"(day, index) in frequencySettingsMonthly\" v-bind:value=\"index+1\">\n                                                            {{ index+1 }}\n                                                        </option>\n                                                    </select>\n                                                </div>\n                                            </div>\n                                        </div>\n\n                                        <div class=\"form-group\">\n                                            <label for=\"hour\">{{ t('SEND_TIME') }}</label>\n                                            <div class=\"form-group-horizontal\">\n                                                <select \n                                                    class=\"form-control\" \n                                                    name=\"hour\" \n                                                    placeholder=\"Hour\"\n                                                    ref=\"hour\"\n                                                    v-model=\"formState.hour\"\n                                                    :required=\"true\"\n                                                    :disabled=\"disabled\">\n                                                    <option v-for=\"(hour, index) in hours\" v-bind:value=\"index+1\">\n                                                        {{ index+1 }}\n                                                    </option>\n                                                </select>\n                                                <select \n                                                    class=\"form-control\" \n                                                    name=\"minute\" \n                                                    placeholder=\"Minute\"\n                                                    ref=\"minute\"\n                                                    v-model=\"formState.minute\"\n                                                    :required=\"true\"\n                                                    :disabled=\"disabled\">\n                                                    <option v-for=\"minute in minutes\" v-bind:value=\"minute\">\n                                                        {{ minute }}\n                                                    </option>\n                                                </select>\n                                                <select \n                                                    class=\"form-control\" \n                                                    name=\"ampm\" \n                                                    placeholder=\"AM/PM\"\n                                                    ref=\"ampm\"\n                                                    v-model=\"formState.ampm\"\n                                                    :required=\"true\"\n                                                    :disabled=\"disabled\">\n                                                    <option v-for=\"ampm in ['am', 'pm']\" v-bind:value=\"ampm\">\n                                                        {{ ampm }}\n                                                    </option>\n                                                </select>\n                                            </div>\n                                        </div>\n\n                                        <div v-if=\"success\" class=\"alert alert-success\" role=\"alert\">\n                                            <h4 class=\"alert-heading\">{{ t('CREATED') }}</h4>\n                                            <p>{{ t('SUB_SUCCESS_CREATED') }}</p>\n                                        </div>\n\n                                        <div v-if=\"error\" class=\"alert alert-danger\" role=\"alert\">\n                                            <h4 class=\"alert-heading\">{{ t('ERROR') }}</h4>\n                                            <p>{{ error }}</p>\n                                        </div>\n\n                                    </form>\n                                </div>\n                            </div>\n                        </div>\n                    </main>\n                    <footer class=\"modal-footer\">\n                        <button v-on:click=\"onCancelClick\" class=\"btn btn-link\">{{ t('CANCEL') }}</button>\n                        <button v-on:click=\"onSaveClick\" class=\"btn btn-primary\" :disabled=\"disabled\">{{ t('OK') }}</button>\n                    </footer>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>\n\n<script>\n    import Vue from 'vue';\n    import VueTranslate from 'vue-translate-plugin';\n    Vue.use(VueTranslate);\n    export default {\n        name: 'SubscribeModal',\n        props: {\n            server: String,\n            openModal: Boolean, // Requested modal state\n            email: String, // Subscription Email\n            selectedDashboardId: String,\n            translations: String,\n            locale: String\n        },\n        data: () => {\n            return {\n                dashboards: [{name: 'All', id: 0}],\n                currentDashboard: {},\n                frequencies: ['DAILY', 'WEEKLY', 'MONTHLY'],\n                frequencySettingsWeekly: [{value: 0, label: 'MONDAY'}, {value: 1, label: 'TUESDAY'}, {value: 2, label: 'WEDNESDAY'}, {value: 3, label: 'THURSDAY'}, {value: 4, label: 'FRIDAY'}, {value: 5, label: 'SATURDAY'}, {value: 6, label: 'SUNDAY'}],\n                frequencySettingsMonthly: Array(31),\n                minutes: ['00', '15', '30', '45'],\n                hours: Array(12),\n                formState: {\n                    dashboard: null,\n                    frequency: '',\n                    dayOfWeek: null,\n                    dayOfMonth: null,\n                    hour: 8,\n                    minute: '',\n                    ampm: ''\n                },\n                disabled: false,\n                success: false,\n                error: false,\n                i18n: {},\n                isOpen: false // Actual modal state\n            };\n        },\n        watch: {\n            server: function (newServer, oldServer) {\n                if (newServer) {\n                    this.fetchDashboards();\n                }\n            },\n            selectedDashboardId: function (newSelectedDashboardId) {\n                this.setSelectedDashboard(newSelectedDashboardId);\n            },\n            openModal: function (val) {\n            \tif (val === this.isOpen) {\n            \t\t// Already in requested state\n            \t\treturn;\n            \t}\n                if (val) {\n                    this.open();\n\n                    if (!this.email) {\n                        this.error = 'No email found for user. Cannot create subscription.';\n                        this.disabled = true;\n                    }\n                } else {\n                    this.close();\n                    this.reset();\n                }\n            },\n            translations: function (val) {\n                if (this.translations && this.locale) {\n                    this.$translate.setLocales(JSON.parse(this.translations));\n                    this.$translate.setLang(this.locale);\n                }\n            },\n            locale: function (val) {\n                if (this.translations && this.locale) {\n                    this.$translate.setLocales(JSON.parse(this.translations));\n                    this.$translate.setLang(this.locale);\n                }\n            }\n        },\n        mounted () {\n            if (this.translations && this.locale) {\n                this.$translate.setLocales(JSON.parse(this.translations));\n                this.$translate.setLang(this.locale);\n            }\n        },\n        created () {\n            if (this.server) {\n                this.fetchDashboards();\n            }\n            this.reset();\n        },\n        methods: {\n            fetchDashboards () {\n                fetch(`${this.server}/api/dashboards`, {\n                    method: 'GET',\n                    headers: {\n                        'Content-Type': 'application/json'\n                    }\n                })\n                .then(this.handleResponse)\n                .then(data => {\n                    // Success\n                    this.dashboards.push(...data);\n                    if (this.selectedDashboardId) {\n                        this.setSelectedDashboard(this.selectedDashboardId);\n                    }\n                })\n                .catch(error => {\n                    console.debug('Error fetching dashboards', error);\n                    this.error = error.statusText;\n                    if (error.detail) {\n                        this.error += `: ${error.detail}`;\n                    }\n                   \n                });\n            },\n            setSelectedDashboard (dashboardId) {\n                console.debug('Setting selected dashboard');\n                if (dashboardId) {\n                    this.dashboards.forEach(dashboard => {\n                        if (dashboard.id === dashboardId) {\n                            this.formState.dashboard = dashboard;\n                            this.currentDashboard = dashboard; // In case user selects 'All'\n                            console.debug(' to: ', dashboard);\n                        }\n                    })\n                }\n            },\n            onCancelClick () {\n                this.close();\n                this.reset();\n            },\n            onSaveClick () {\n                this.disabled = true;\n                \n                let subscription = {\n                    email: this.email,\n                    view_name: this.formState.dashboard.id != 0 ? this.getViewName(this.formState.dashboard.url) : this.getViewName(this.currentDashboard.url),\n                    schedule: this.formState.frequency, // daily, weekly, monthly\n                    day_of: this.formState.frequency === 'DAILY' ? 0 : this.formState.frequency === 'WEEKLY' ? this.formState.dayOfWeek : this.formState.dayOfMonth,\n                    send_at: `${this.formState.hour}:${this.formState.minute} ${this.formState.ampm}`, // \"8:00 am\"\n                    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,\n                    full: this.formState.dashboard.id === 0\n                };\n\n                fetch(`${this.server}/auth/subscriptions`, {\n                    method: 'POST',\n                    headers: {\n                        'Content-Type': 'application/json'\n                    },\n                    body: JSON.stringify(subscription)\n                })\n                .then(this.handleResponse)\n                .then(json => {\n                    let event = new Event('subscription-created.ft', {subscription: json.detail});\n                    document.dispatchEvent(event);\n                    this.success = true;\n                    setTimeout(() => {\n                        this.close();\n                        this.reset();\n                    }, 1000);\n                })\n                .catch(error => {\n                    // response.json().then(json => {\n                    //     json.detail.forEach(error => {\n                    //         error.loc.forEach(loc => {\n                    //             if (this.$refs[loc]) {\n                    //                 this.$refs[loc].classList.add('error')\n                    //             }\n                    //         })\n                    //     })\n                    // });\n\n                    console.debug('Error creating subscription or parsing response', error);\n                    this.error = error.statusText;\n                    if (error.detail) {\n                        this.error += `: ${error.detail}`;\n                    }\n                   \n                });\n            },\n            getViewName (url) {\n                return url.split('/views/').pop().split('?')[0];\n            },\n            handleResponse (response) {\n                return response.json()\n                    .then((json) => {\n                        if (!response.ok) {\n                            const error = Object.assign({}, json, {\n                                status: response.status,\n                                statusText: response.statusText,\n                            });\n\n                            return Promise.reject(error);\n                        }\n                        return json;\n                    });\n            },\n            open () {\n                document.body.appendChild(this.$refs.modalWrapper);\n                this.isOpen = true;\n            },\n            close () {\n                this.$refs.modalTemplate.appendChild(this.$refs.modalWrapper);\n                this.isOpen = false;\n                if (typeof this.onClose === 'function') {\n                \tthis.onClose();\n                }\n            },\n            reset () {\n                this.success = false;\n                this.disabled = false;\n                this.error = false;\n                this.formState.dashboard = this.dashboards[0];\n                this.formState.frequency = this.frequencies[0];\n                this.formState.dayOfWeek = this.frequencySettingsWeekly[0].value;\n                this.formState.dayOfMonth = 1;\n                this.formState.hour = 8;\n                this.formState.minute = this.minutes[0];\n                this.formState.ampm = 'am';\n            },\n            onBackdropClick (e) {\n                if (e.target === this.$refs.modalWrapper) {\n                    this.close();\n                }\n            }\n        }\n    };\n</script>\n\n<style src=\"vue-multiselect/dist/vue-multiselect.min.css\"></style>\n<style lang=\"scss\">\n    \n    .subscribe-modal {\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        z-index: 999;\n        background-color: rgba(0, 0, 0, .4);\n        transition: all 0.3s;\n        *, ::after, ::before {\n\t        box-sizing: border-box;\n\t    }\n\t    .modal-dialog {\n\t        max-width: 500px;\n            position: relative;\n            margin: 1.75rem auto;\n            transition: transform .3s ease-out;\n\t    }\n\t    .modal-content {\n            height: auto;\n\t        background: #ffffff;\n\t        pointer-events: all;\n\t    }\n\t    .btn-primary:hover {\n\t        cursor: pointer;\n\t    }\n\t    .btn:focus {\n\t        outline: 0;\n\t    }\n\t   .form {\n\t        position: relative;\n\t    }\n\t    .form-group {\n\t        margin-bottom: 1rem;\n\t    }\n        .form-group-horizontal {\n            display: flex;\n            flex-direction: row;\n        }\n        .form-group-horizontal > * {\n            margin-left: .3rem;\n            width: 100%;\n        }\n        .form-group-horizontal > *:first-child {\n            margin-left: 0;\n        }\n\t    .form-control {\n\t        display: block;\n\t        width: 100%;\n\t    }\n\t    .form-control:focus {\n\t        outline: 0;\n\t    }\n\t    .modal-footer {\n\t        display: flex;\n\t        justify-content: flex-end;\n\t    }\n    }\n</style>\n",".subscribe-modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 999;\n  background-color: rgba(0, 0, 0, 0.4);\n  transition: all 0.3s;\n}\n.subscribe-modal *, .subscribe-modal ::after, .subscribe-modal ::before {\n  box-sizing: border-box;\n}\n.subscribe-modal .modal-dialog {\n  max-width: 500px;\n  position: relative;\n  margin: 1.75rem auto;\n  transition: transform 0.3s ease-out;\n}\n.subscribe-modal .modal-content {\n  height: auto;\n  background: #ffffff;\n  pointer-events: all;\n}\n.subscribe-modal .btn-primary:hover {\n  cursor: pointer;\n}\n.subscribe-modal .btn:focus {\n  outline: 0;\n}\n.subscribe-modal .form {\n  position: relative;\n}\n.subscribe-modal .form-group {\n  margin-bottom: 1rem;\n}\n.subscribe-modal .form-group-horizontal {\n  display: flex;\n  flex-direction: row;\n}\n.subscribe-modal .form-group-horizontal > * {\n  margin-left: 0.3rem;\n  width: 100%;\n}\n.subscribe-modal .form-group-horizontal > *:first-child {\n  margin-left: 0;\n}\n.subscribe-modal .form-control {\n  display: block;\n  width: 100%;\n}\n.subscribe-modal .form-control:focus {\n  outline: 0;\n}\n.subscribe-modal .modal-footer {\n  display: flex;\n  justify-content: flex-end;\n}\n\n/*# sourceMappingURL=SubscribeModal.vue.map */"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$2 = normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  Vue.use(vueTranslate_common);
  var script$3 = {
      name: 'SubscriptionList',
      props: {
          server: String,
          translations: String,
          locale: String
      },
      data: () => {
          return {
              subscriptions: [],
              openModal: false,
              userToEdit: {}
          }
      },
      created () {
          this.fetchSubscriptions();

          document.addEventListener('subscription-created.ft', (e, p) => {
              console.debug('user-created.ft', e);
              this.subscriptions.push(e.detail.subscription);
          });

          document.addEventListener('subscription-edited.ft', (e, p) => {
              console.debug('user-edited.ft', e);
              Object.assign(this.subscriptions.find(subscription => subscription.id === e.detail.subscription.id), e.detail.subscription);
          });
      },
      methods: {
          fetchSubscriptions () {
              if (!this.server) {
                  return;
              }
              fetch(`${this.server}/auth/subscriptions`)
                  .then(this.handleResponse)
                  .then(json => {
                      console.debug('json', json);
                      this.subscriptions.push(...json);
                  });
          },
          onEditClick (subscription) {
              console.debug('subscription edit click', subscription);
              this.subscriptionToEdit = subscription;
              this.openModal = true;
          },
          onDeleteClick (subscription) {
              fetch(`${this.server}/auth/subscriptions/${subscription.id}`, {
                  method: 'DELETE'
              })
                  .then(this.handleResponse)
                  .then(deletedSubscription => {
                      let i = this.subscriptions.length - 1;
                      while (i >= 0) {
                          if (this.subscriptions[i].id === deletedSubscription.id) {
                              this.subscriptions.splice(i, 1);
                          }
                          i--;
                      }
                  });
          },
          handleResponse (response) {
              return response.json()
                  .then((json) => {
                      if (!response.ok) {
                          const error = Object.assign({}, json, {
                              status: response.status,
                              statusText: response.statusText,
                          });

                          return Promise.reject(error);
                      }
                      return json;
                  });
          },
          onModalClose () {
              this.openModal = false;
          }
      },
      watch: {
          server: function (newServer, oldServer) {
              if (newServer) {
                  this.fetchSubscriptions();
              }
          },
          translations: function (val) {
              if (this.translations && this.locale) {
                  this.$translate.setLocales(JSON.parse(this.translations));
                  this.$translate.setLang(this.locale);
              }
          },
          locale: function (val) {
              if (this.translations && this.locale) {
                  this.$translate.setLocales(JSON.parse(this.translations));
                  this.$translate.setLang(this.locale);
              }
          }
      },
      components: {SubscribeModal: __vue_component__$2}
  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "subscription-list__wrapper" }, [
      _c("table", { staticClass: "table table-striped" }, [
        _c("thead", [
          _c("tr", [
            _c("th", [_vm._v(_vm._s(_vm.t("EMAIL")))]),
            _vm._v(" "),
            _c("th", [_vm._v(_vm._s(_vm.t("DASHBOARD")))]),
            _vm._v(" "),
            _c("th", [_vm._v(_vm._s(_vm.t("ALL")))]),
            _vm._v(" "),
            _c("th", [_vm._v(_vm._s(_vm.t("FREQUENCY_SETTING")))]),
            _vm._v(" "),
            _c("th", [_vm._v(_vm._s(_vm.t("SEND_TIME")))]),
            _vm._v(" "),
            _c("th")
          ])
        ]),
        _vm._v(" "),
        _c(
          "tbody",
          _vm._l(_vm.subscriptions, function(subscription) {
            return _c("tr", [
              _c("td", [_vm._v(_vm._s(subscription.email))]),
              _vm._v(" "),
              _c("td", [_vm._v(_vm._s(subscription.view_name))]),
              _vm._v(" "),
              _c("td", { staticClass: "uppercase" }, [
                _vm._v(_vm._s(_vm.t(subscription.full)))
              ]),
              _vm._v(" "),
              _c("td", [_vm._v(_vm._s(_vm.t(subscription.schedule)))]),
              _vm._v(" "),
              _c("td", [
                _vm._v(
                  _vm._s(subscription.send_at) + " " + _vm._s(subscription.tz)
                )
              ]),
              _vm._v(" "),
              _c("td", [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-secondary btn-small",
                    on: {
                      click: function($event) {
                        return _vm.onDeleteClick(subscription)
                      }
                    }
                  },
                  [_vm._v("Delete")]
                )
              ])
            ])
          }),
          0
        )
      ])
    ])
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = function (inject) {
      if (!inject) return
      inject("data-v-6dc319e6_0", { source: ".subscription-list__wrapper {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #212529;\n}\n.subscription-list__wrapper *, .subscription-list__wrapper ::after, .subscription-list__wrapper ::before {\n  box-sizing: border-box;\n}\n.subscription-list__wrapper .uppercase {\n  text-transform: uppercase;\n}\n.subscription-list__wrapper .table {\n  width: 100%;\n  max-width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n}\n.subscription-list__wrapper .table thead th {\n  vertical-align: bottom;\n  border-bottom: 2px solid #dee2e6;\n  padding: 0.75rem;\n  border-top: 1px solid #dee2e6;\n}\n.subscription-list__wrapper .table th, .subscription-list__wrapper .table td {\n  padding: 0.75rem;\n  vertical-align: top;\n  border-top: 1px solid #dee2e6;\n}\n.subscription-list__wrapper .permissions {\n  font-size: 0.8rem;\n  font-family: Consolas, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", Monaco, \"Courier New\", Courier, monospace;\n}\n.subscription-list__wrapper .btn {\n  border-radius: 2px;\n  padding: 0.5rem 1rem;\n  line-height: 1.5rem;\n  font-size: 1rem;\n  font-weight: bold;\n  border: none;\n  margin-bottom: 20px;\n  color: #fff;\n}\n.subscription-list__wrapper .btn-small {\n  margin-bottom: 0px;\n  padding: 0.1rem 0.3rem;\n  line-height: 0.8rem;\n  font-size: 0.8rem;\n  font-weight: normal;\n}\n.subscription-list__wrapper .btn-secondary {\n  background: transparent;\n  border: solid 1px #fa225b;\n  color: #fa225b;\n}\n.subscription-list__wrapper .btn.btn-secondary:hover {\n  box-shadow: 0 0 4px 1px rgba(250, 34, 91, 0.1);\n}\n.subscription-list__wrapper .btn:hover {\n  cursor: pointer;\n  box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n}\n.subscription-list__wrapper .btn:focus {\n  outline: 0;\n}\n\n/*# sourceMappingURL=SubscriptionList.vue.map */", map: {"version":3,"sources":["/Users/dylan/dev/zuar/frontendtoolbox/src/elements/SubscriptionList/SubscriptionList.vue","SubscriptionList.vue"],"names":[],"mappings":"AA8IA;EACA,iKAAA;EACA,mCAAA;EACA,kCAAA;EACA,kBAAA;EACA,cAAA;AC7IA;AD+IA;EACA,sBAAA;AC7IA;AD+IA;EACA,yBAAA;AC7IA;AD+IA;EACA,WAAA;EACA,eAAA;EACA,yBAAA;EACA,gBAAA;AC7IA;AD+IA;EACA,sBAAA;EACA,gCAAA;EACA,gBAAA;EACA,6BAAA;AC7IA;AD+IA;EACA,gBAAA;EACA,mBAAA;EACA,6BAAA;AC7IA;AD+IA;EACA,iBAAA;EACA,iOAAA;AC7IA;ADgJA;EACA,kBAAA;EACA,oBAAA;EACA,mBAAA;EACA,eAAA;EACA,iBAAA;EACA,YAAA;EACA,mBAAA;EACA,WAAA;AC9IA;ADgJA;EACA,kBAAA;EACA,sBAAA;EACA,mBAAA;EACA,iBAAA;EACA,mBAAA;AC9IA;ADgJA;EACA,uBAAA;EACA,yBAAA;EACA,cAAA;AC9IA;ADgJA;EACA,8CAAA;AC9IA;ADgJA;EACA,eAAA;EACA,+CAAA;AC9IA;ADgJA;EACA,UAAA;AC9IA;;AAEA,+CAA+C","file":"SubscriptionList.vue","sourcesContent":["<template>\n    <div class=\"subscription-list__wrapper\">\n        <table class=\"table table-striped\">\n            <thead>\n                <tr>\n                    <th>{{ t('EMAIL') }}</th>\n                    <th>{{ t('DASHBOARD') }}</th>\n                    <th>{{ t('ALL') }}</th>\n                    <th>{{ t('FREQUENCY_SETTING') }}</th>\n                    <th>{{ t('SEND_TIME') }}</th>\n                    <th></th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr v-for=\"subscription in subscriptions\">\n                    <td>{{subscription.email}}</td>\n                    <td>{{subscription.view_name}}</td>\n                    <td class=\"uppercase\">{{ t(subscription.full) }}</td>\n                    <td>{{ t(subscription.schedule) }}</td>\n                    <td>{{subscription.send_at}} {{subscription.tz}}</td>\n                    <td>\n                        <!-- <button class=\"btn btn-secondary btn-small\" v-on:click=\"onEditClick(subscription)\">Edit</button> -->\n                        <button v-on:click=\"onDeleteClick(subscription)\" class=\"btn btn-secondary btn-small\">Delete</button>\n                    </td>\n                </tr>\n          </tbody>\n        </table>\n        <!-- <user-edit-modal \n            :user-to-edit=\"userToEdit\" \n            :open-modal=\"openModal\" \n            :on-close=\"onModalClose\">\n        </user-edit-modal> -->\n    </div>\n</template>\n\n<script>\n    import Vue from 'vue';\n    import VueTranslate from 'vue-translate-plugin';\n    Vue.use(VueTranslate);\n    import SubscribeModal from '../SubscribeModal/SubscribeModal.vue'\n    export default {\n        name: 'SubscriptionList',\n        props: {\n            server: String,\n            translations: String,\n            locale: String\n        },\n        data: () => {\n            return {\n                subscriptions: [],\n                openModal: false,\n                userToEdit: {}\n            }\n        },\n        created () {\n            this.fetchSubscriptions();\n\n            document.addEventListener('subscription-created.ft', (e, p) => {\n                console.debug('user-created.ft', e)\n                this.subscriptions.push(e.detail.subscription)\n            })\n\n            document.addEventListener('subscription-edited.ft', (e, p) => {\n                console.debug('user-edited.ft', e)\n                Object.assign(this.subscriptions.find(subscription => subscription.id === e.detail.subscription.id), e.detail.subscription)\n            })\n        },\n        methods: {\n            fetchSubscriptions () {\n                if (!this.server) {\n                    return;\n                }\n                fetch(`${this.server}/auth/subscriptions`)\n                    .then(this.handleResponse)\n                    .then(json => {\n                        console.debug('json', json);\n                        this.subscriptions.push(...json);\n                    });\n            },\n            onEditClick (subscription) {\n                console.debug('subscription edit click', subscription);\n                this.subscriptionToEdit = subscription;\n                this.openModal = true;\n            },\n            onDeleteClick (subscription) {\n                fetch(`${this.server}/auth/subscriptions/${subscription.id}`, {\n                    method: 'DELETE'\n                })\n                    .then(this.handleResponse)\n                    .then(deletedSubscription => {\n                        let i = this.subscriptions.length - 1;\n                        while (i >= 0) {\n                            if (this.subscriptions[i].id === deletedSubscription.id) {\n                                this.subscriptions.splice(i, 1);\n                            }\n                            i--;\n                        }\n                    });\n            },\n            handleResponse (response) {\n                return response.json()\n                    .then((json) => {\n                        if (!response.ok) {\n                            const error = Object.assign({}, json, {\n                                status: response.status,\n                                statusText: response.statusText,\n                            });\n\n                            return Promise.reject(error);\n                        }\n                        return json;\n                    });\n            },\n            onModalClose () {\n                this.openModal = false\n            }\n        },\n        watch: {\n            server: function (newServer, oldServer) {\n                if (newServer) {\n                    this.fetchSubscriptions();\n                }\n            },\n            translations: function (val) {\n                if (this.translations && this.locale) {\n                    this.$translate.setLocales(JSON.parse(this.translations));\n                    this.$translate.setLang(this.locale);\n                }\n            },\n            locale: function (val) {\n                if (this.translations && this.locale) {\n                    this.$translate.setLocales(JSON.parse(this.translations));\n                    this.$translate.setLang(this.locale);\n                }\n            }\n        },\n        components: {SubscribeModal}\n    }\n</script>\n\n<style lang=\"scss\">\n    \n    .subscription-list__wrapper {\n        font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";\n        -webkit-font-smoothing: antialiased;\n        -moz-osx-font-smoothing: grayscale;\n        text-align: center;\n        color: #212529;\n\n        *, ::after, ::before {\n            box-sizing: border-box;\n        }\n        .uppercase {\n            text-transform: uppercase;\n        }\n        .table {\n            width: 100%;\n            max-width: 100%;\n            border-collapse: collapse;\n            text-align: left;\n        }\n        .table thead th {\n            vertical-align: bottom;\n            border-bottom: 2px solid #dee2e6;\n            padding: .75rem;\n            border-top: 1px solid #dee2e6;\n        }\n        .table th, .table td {\n            padding: .75rem;\n            vertical-align: top;\n            border-top: 1px solid #dee2e6;\n        }\n        .permissions {\n            font-size: .8rem;\n            font-family: Consolas, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", Monaco, \"Courier New\", Courier, monospace;\n        }\n\n        .btn {\n            border-radius: 2px;\n            padding: .5rem 1rem;\n            line-height: 1.5rem;\n            font-size: 1rem;\n            font-weight: bold;\n            border: none;\n            margin-bottom: 20px;\n            color: #fff;\n        }\n        .btn-small {\n            margin-bottom: 0px;\n            padding: .1rem .3rem;\n            line-height: .8rem;\n            font-size: .8rem;\n            font-weight: normal;\n        }\n        .btn-secondary {\n            background: transparent;\n            border: solid 1px #fa225b;\n            color: #fa225b;\n        }\n        .btn.btn-secondary:hover {\n            box-shadow: 0 0 4px 1px rgba(250, 34, 91, 0.1);\n        }\n        .btn:hover {\n            cursor: pointer;\n            box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n        }\n        .btn:focus {\n            outline: 0;\n        }\n    }\n</style>\n",".subscription-list__wrapper {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #212529;\n}\n.subscription-list__wrapper *, .subscription-list__wrapper ::after, .subscription-list__wrapper ::before {\n  box-sizing: border-box;\n}\n.subscription-list__wrapper .uppercase {\n  text-transform: uppercase;\n}\n.subscription-list__wrapper .table {\n  width: 100%;\n  max-width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n}\n.subscription-list__wrapper .table thead th {\n  vertical-align: bottom;\n  border-bottom: 2px solid #dee2e6;\n  padding: 0.75rem;\n  border-top: 1px solid #dee2e6;\n}\n.subscription-list__wrapper .table th, .subscription-list__wrapper .table td {\n  padding: 0.75rem;\n  vertical-align: top;\n  border-top: 1px solid #dee2e6;\n}\n.subscription-list__wrapper .permissions {\n  font-size: 0.8rem;\n  font-family: Consolas, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", Monaco, \"Courier New\", Courier, monospace;\n}\n.subscription-list__wrapper .btn {\n  border-radius: 2px;\n  padding: 0.5rem 1rem;\n  line-height: 1.5rem;\n  font-size: 1rem;\n  font-weight: bold;\n  border: none;\n  margin-bottom: 20px;\n  color: #fff;\n}\n.subscription-list__wrapper .btn-small {\n  margin-bottom: 0px;\n  padding: 0.1rem 0.3rem;\n  line-height: 0.8rem;\n  font-size: 0.8rem;\n  font-weight: normal;\n}\n.subscription-list__wrapper .btn-secondary {\n  background: transparent;\n  border: solid 1px #fa225b;\n  color: #fa225b;\n}\n.subscription-list__wrapper .btn.btn-secondary:hover {\n  box-shadow: 0 0 4px 1px rgba(250, 34, 91, 0.1);\n}\n.subscription-list__wrapper .btn:hover {\n  cursor: pointer;\n  box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n}\n.subscription-list__wrapper .btn:focus {\n  outline: 0;\n}\n\n/*# sourceMappingURL=SubscriptionList.vue.map */"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$3 = normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      createInjector,
      undefined,
      undefined
    );

  var vueMultiselect_min = createCommonjsModule(function (module, exports) {
  !function(t,e){module.exports=e();}(commonjsGlobal,function(){return function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i});},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=60)}([function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n);},function(t,e,n){var i=n(49)("wks"),r=n(30),o=n(0).Symbol,s="function"==typeof o;(t.exports=function(t){return i[t]||(i[t]=s&&o[t]||(s?o:r)("Symbol."+t))}).store=i;},function(t,e,n){var i=n(5);t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t};},function(t,e,n){var i=n(0),r=n(10),o=n(8),s=n(6),u=n(11),a=function(t,e,n){var l,c,f,p,h=t&a.F,d=t&a.G,v=t&a.S,g=t&a.P,y=t&a.B,m=d?i:v?i[e]||(i[e]={}):(i[e]||{}).prototype,b=d?r:r[e]||(r[e]={}),_=b.prototype||(b.prototype={});d&&(n=e);for(l in n)c=!h&&m&&void 0!==m[l],f=(c?m:n)[l],p=y&&c?u(f,i):g&&"function"==typeof f?u(Function.call,f):f,m&&s(m,l,f,t&a.U),b[l]!=f&&o(b,l,p),g&&_[l]!=f&&(_[l]=f);};i.core=r,a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a;},function(t,e,n){t.exports=!n(7)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a});},function(t,e){t.exports=function(t){return "object"==typeof t?null!==t:"function"==typeof t};},function(t,e,n){var i=n(0),r=n(8),o=n(12),s=n(30)("src"),u=Function.toString,a=(""+u).split("toString");n(10).inspectSource=function(t){return u.call(t)},(t.exports=function(t,e,n,u){var l="function"==typeof n;l&&(o(n,"name")||r(n,"name",e)),t[e]!==n&&(l&&(o(n,s)||r(n,s,t[e]?""+t[e]:a.join(String(e)))),t===i?t[e]=n:u?t[e]?t[e]=n:r(t,e,n):(delete t[e],r(t,e,n)));})(Function.prototype,"toString",function(){return "function"==typeof this&&this[s]||u.call(this)});},function(t,e){t.exports=function(t){try{return !!t()}catch(t){return !0}};},function(t,e,n){var i=n(13),r=n(25);t.exports=n(4)?function(t,e,n){return i.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t};},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)};},function(t,e){var n=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=n);},function(t,e,n){var i=n(14);t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,r){return t.call(e,n,i,r)}}return function(){return t.apply(e,arguments)}};},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)};},function(t,e,n){var i=n(2),r=n(41),o=n(29),s=Object.defineProperty;e.f=n(4)?Object.defineProperty:function(t,e,n){if(i(t),e=o(e,!0),i(n),r)try{return s(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return "value"in n&&(t[e]=n.value),t};},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t};},function(t,e){t.exports={};},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t};},function(t,e,n){var i=n(7);t.exports=function(t,e){return !!t&&i(function(){e?t.call(null,function(){},1):t.call(null);})};},function(t,e,n){var i=n(23),r=n(16);t.exports=function(t){return i(r(t))};},function(t,e,n){var i=n(53),r=Math.min;t.exports=function(t){return t>0?r(i(t),9007199254740991):0};},function(t,e,n){var i=n(11),r=n(23),o=n(28),s=n(19),u=n(64);t.exports=function(t,e){var n=1==t,a=2==t,l=3==t,c=4==t,f=6==t,p=5==t||f,h=e||u;return function(e,u,d){for(var v,g,y=o(e),m=r(y),b=i(u,d,3),_=s(m.length),x=0,w=n?h(e,_):a?h(e,0):void 0;_>x;x++)if((p||x in m)&&(v=m[x],g=b(v,x,y),t))if(n)w[x]=g;else if(g)switch(t){case 3:return !0;case 5:return v;case 6:return x;case 2:w.push(v);}else if(c)return !1;return f?-1:l||c?c:w}};},function(t,e,n){var i=n(5),r=n(0).document,o=i(r)&&i(r.createElement);t.exports=function(t){return o?r.createElement(t):{}};},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");},function(t,e,n){var i=n(9);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return "String"==i(t)?t.split(""):Object(t)};},function(t,e){t.exports=!1;},function(t,e){t.exports=function(t,e){return {enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}};},function(t,e,n){var i=n(13).f,r=n(12),o=n(1)("toStringTag");t.exports=function(t,e,n){t&&!r(t=n?t:t.prototype,o)&&i(t,o,{configurable:!0,value:e});};},function(t,e,n){var i=n(49)("keys"),r=n(30);t.exports=function(t){return i[t]||(i[t]=r(t))};},function(t,e,n){var i=n(16);t.exports=function(t){return Object(i(t))};},function(t,e,n){var i=n(5);t.exports=function(t,e){if(!i(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!i(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")};},function(t,e){var n=0,i=Math.random();t.exports=function(t){return "Symbol(".concat(void 0===t?"":t,")_",(++n+i).toString(36))};},function(t,e,n){var i=n(0),r=n(12),o=n(9),s=n(67),u=n(29),a=n(7),l=n(77).f,c=n(45).f,f=n(13).f,p=n(51).trim,h=i.Number,d=h,v=h.prototype,g="Number"==o(n(44)(v)),y="trim"in String.prototype,m=function(t){var e=u(t,!1);if("string"==typeof e&&e.length>2){e=y?e.trim():p(e,3);var n,i,r,o=e.charCodeAt(0);if(43===o||45===o){if(88===(n=e.charCodeAt(2))||120===n)return NaN}else if(48===o){switch(e.charCodeAt(1)){case 66:case 98:i=2,r=49;break;case 79:case 111:i=8,r=55;break;default:return +e}for(var s,a=e.slice(2),l=0,c=a.length;l<c;l++)if((s=a.charCodeAt(l))<48||s>r)return NaN;return parseInt(a,i)}}return +e};if(!h(" 0o1")||!h("0b1")||h("+0x1")){h=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof h&&(g?a(function(){v.valueOf.call(n);}):"Number"!=o(n))?s(new d(m(e)),n,h):m(e)};for(var b,_=n(4)?l(d):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),x=0;_.length>x;x++)r(d,b=_[x])&&!r(h,b)&&f(h,b,c(d,b));h.prototype=v,v.constructor=h,n(6)(i,"Number",h);}},function(t,e,n){function i(t){return 0!==t&&(!(!Array.isArray(t)||0!==t.length)||!t)}function r(t){return function(){return !t.apply(void 0,arguments)}}function o(t,e){return void 0===t&&(t="undefined"),null===t&&(t="null"),!1===t&&(t="false"),-1!==t.toString().toLowerCase().indexOf(e.trim())}function s(t,e,n,i){return t.filter(function(t){return o(i(t,n),e)})}function u(t){return t.filter(function(t){return !t.$isLabel})}function a(t,e){return function(n){return n.reduce(function(n,i){return i[t]&&i[t].length?(n.push({$groupLabel:i[e],$isLabel:!0}),n.concat(i[t])):n},[])}}function l(t,e,i,r,o){return function(u){return u.map(function(u){var a;if(!u[i])return console.warn("Options passed to vue-multiselect do not contain groups, despite the config."),[];var l=s(u[i],t,e,o);return l.length?(a={},n.i(d.a)(a,r,u[r]),n.i(d.a)(a,i,l),a):[]})}}var c=n(59),f=n(54),p=(n.n(f),n(95)),h=(n.n(p),n(31)),d=(n.n(h),n(58)),v=n(91),g=(n.n(v),n(98)),y=(n.n(g),n(92)),m=(n.n(y),n(88)),b=(n.n(m),n(97)),_=(n.n(b),n(89)),x=(n.n(_),n(96)),w=(n.n(x),n(93)),S=(n.n(w),n(90)),O=(n.n(S),function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(t){return e.reduce(function(t,e){return e(t)},t)}});e.a={data:function(){return {search:"",isOpen:!1,preferredOpenDirection:"below",optimizedHeight:this.maxHeight}},props:{internalSearch:{type:Boolean,default:!0},options:{type:Array,required:!0},multiple:{type:Boolean,default:!1},value:{type:null,default:function(){return []}},trackBy:{type:String},label:{type:String},searchable:{type:Boolean,default:!0},clearOnSelect:{type:Boolean,default:!0},hideSelected:{type:Boolean,default:!1},placeholder:{type:String,default:"Select option"},allowEmpty:{type:Boolean,default:!0},resetAfter:{type:Boolean,default:!1},closeOnSelect:{type:Boolean,default:!0},customLabel:{type:Function,default:function(t,e){return i(t)?"":e?t[e]:t}},taggable:{type:Boolean,default:!1},tagPlaceholder:{type:String,default:"Press enter to create a tag"},tagPosition:{type:String,default:"top"},max:{type:[Number,Boolean],default:!1},id:{default:null},optionsLimit:{type:Number,default:1e3},groupValues:{type:String},groupLabel:{type:String},groupSelect:{type:Boolean,default:!1},blockKeys:{type:Array,default:function(){return []}},preserveSearch:{type:Boolean,default:!1},preselectFirst:{type:Boolean,default:!1}},mounted:function(){!this.multiple&&this.max&&console.warn("[Vue-Multiselect warn]: Max prop should not be used when prop Multiple equals false."),this.preselectFirst&&!this.internalValue.length&&this.options.length&&this.select(this.filteredOptions[0]);},computed:{internalValue:function(){return this.value||0===this.value?Array.isArray(this.value)?this.value:[this.value]:[]},filteredOptions:function(){var t=this.search||"",e=t.toLowerCase().trim(),n=this.options.concat();return n=this.internalSearch?this.groupValues?this.filterAndFlat(n,e,this.label):s(n,e,this.label,this.customLabel):this.groupValues?a(this.groupValues,this.groupLabel)(n):n,n=this.hideSelected?n.filter(r(this.isSelected)):n,this.taggable&&e.length&&!this.isExistingOption(e)&&("bottom"===this.tagPosition?n.push({isTag:!0,label:t}):n.unshift({isTag:!0,label:t})),n.slice(0,this.optionsLimit)},valueKeys:function(){var t=this;return this.trackBy?this.internalValue.map(function(e){return e[t.trackBy]}):this.internalValue},optionKeys:function(){var t=this;return (this.groupValues?this.flatAndStrip(this.options):this.options).map(function(e){return t.customLabel(e,t.label).toString().toLowerCase()})},currentOptionLabel:function(){return this.multiple?this.searchable?"":this.placeholder:this.internalValue.length?this.getOptionLabel(this.internalValue[0]):this.searchable?"":this.placeholder}},watch:{internalValue:function(){this.resetAfter&&this.internalValue.length&&(this.search="",this.$emit("input",this.multiple?[]:null));},search:function(){this.$emit("search-change",this.search,this.id);}},methods:{getValue:function(){return this.multiple?this.internalValue:0===this.internalValue.length?null:this.internalValue[0]},filterAndFlat:function(t,e,n){return O(l(e,n,this.groupValues,this.groupLabel,this.customLabel),a(this.groupValues,this.groupLabel))(t)},flatAndStrip:function(t){return O(a(this.groupValues,this.groupLabel),u)(t)},updateSearch:function(t){this.search=t;},isExistingOption:function(t){return !!this.options&&this.optionKeys.indexOf(t)>-1},isSelected:function(t){var e=this.trackBy?t[this.trackBy]:t;return this.valueKeys.indexOf(e)>-1},isOptionDisabled:function(t){return !!t.$isDisabled},getOptionLabel:function(t){if(i(t))return "";if(t.isTag)return t.label;if(t.$isLabel)return t.$groupLabel;var e=this.customLabel(t,this.label);return i(e)?"":e},select:function(t,e){if(t.$isLabel&&this.groupSelect)return void this.selectGroup(t);if(!(-1!==this.blockKeys.indexOf(e)||this.disabled||t.$isDisabled||t.$isLabel)&&(!this.max||!this.multiple||this.internalValue.length!==this.max)&&("Tab"!==e||this.pointerDirty)){if(t.isTag)this.$emit("tag",t.label,this.id),this.search="",this.closeOnSelect&&!this.multiple&&this.deactivate();else {if(this.isSelected(t))return void("Tab"!==e&&this.removeElement(t));this.$emit("select",t,this.id),this.multiple?this.$emit("input",this.internalValue.concat([t]),this.id):this.$emit("input",t,this.id),this.clearOnSelect&&(this.search="");}this.closeOnSelect&&this.deactivate();}},selectGroup:function(t){var e=this,n=this.options.find(function(n){return n[e.groupLabel]===t.$groupLabel});if(n)if(this.wholeGroupSelected(n)){this.$emit("remove",n[this.groupValues],this.id);var i=this.internalValue.filter(function(t){return -1===n[e.groupValues].indexOf(t)});this.$emit("input",i,this.id);}else {var r=n[this.groupValues].filter(function(t){return !(e.isOptionDisabled(t)||e.isSelected(t))});this.$emit("select",r,this.id),this.$emit("input",this.internalValue.concat(r),this.id);}},wholeGroupSelected:function(t){var e=this;return t[this.groupValues].every(function(t){return e.isSelected(t)||e.isOptionDisabled(t)})},wholeGroupDisabled:function(t){return t[this.groupValues].every(this.isOptionDisabled)},removeElement:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(!this.disabled&&!t.$isDisabled){if(!this.allowEmpty&&this.internalValue.length<=1)return void this.deactivate();var i="object"===n.i(c.a)(t)?this.valueKeys.indexOf(t[this.trackBy]):this.valueKeys.indexOf(t);if(this.$emit("remove",t,this.id),this.multiple){var r=this.internalValue.slice(0,i).concat(this.internalValue.slice(i+1));this.$emit("input",r,this.id);}else this.$emit("input",null,this.id);this.closeOnSelect&&e&&this.deactivate();}},removeLastElement:function(){-1===this.blockKeys.indexOf("Delete")&&0===this.search.length&&Array.isArray(this.internalValue)&&this.internalValue.length&&this.removeElement(this.internalValue[this.internalValue.length-1],!1);},activate:function(){var t=this;this.isOpen||this.disabled||(this.adjustPosition(),this.groupValues&&0===this.pointer&&this.filteredOptions.length&&(this.pointer=1),this.isOpen=!0,this.searchable?(this.preserveSearch||(this.search=""),this.$nextTick(function(){return t.$refs.search.focus()})):this.$el.focus(),this.$emit("open",this.id));},deactivate:function(){this.isOpen&&(this.isOpen=!1,this.searchable?this.$refs.search.blur():this.$el.blur(),this.preserveSearch||(this.search=""),this.$emit("close",this.getValue(),this.id));},toggle:function(){this.isOpen?this.deactivate():this.activate();},adjustPosition:function(){if("undefined"!=typeof window){var t=this.$el.getBoundingClientRect().top,e=window.innerHeight-this.$el.getBoundingClientRect().bottom;e>this.maxHeight||e>t||"below"===this.openDirection||"bottom"===this.openDirection?(this.preferredOpenDirection="below",this.optimizedHeight=Math.min(e-40,this.maxHeight)):(this.preferredOpenDirection="above",this.optimizedHeight=Math.min(t-40,this.maxHeight));}}}};},function(t,e,n){var i=n(54),r=(n.n(i),n(31));n.n(r);e.a={data:function(){return {pointer:0,pointerDirty:!1}},props:{showPointer:{type:Boolean,default:!0},optionHeight:{type:Number,default:40}},computed:{pointerPosition:function(){return this.pointer*this.optionHeight},visibleElements:function(){return this.optimizedHeight/this.optionHeight}},watch:{filteredOptions:function(){this.pointerAdjust();},isOpen:function(){this.pointerDirty=!1;}},methods:{optionHighlight:function(t,e){return {"multiselect__option--highlight":t===this.pointer&&this.showPointer,"multiselect__option--selected":this.isSelected(e)}},groupHighlight:function(t,e){var n=this;if(!this.groupSelect)return ["multiselect__option--group","multiselect__option--disabled"];var i=this.options.find(function(t){return t[n.groupLabel]===e.$groupLabel});return i&&!this.wholeGroupDisabled(i)?["multiselect__option--group",{"multiselect__option--highlight":t===this.pointer&&this.showPointer},{"multiselect__option--group-selected":this.wholeGroupSelected(i)}]:"multiselect__option--disabled"},addPointerElement:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Enter",e=t.key;this.filteredOptions.length>0&&this.select(this.filteredOptions[this.pointer],e),this.pointerReset();},pointerForward:function(){this.pointer<this.filteredOptions.length-1&&(this.pointer++,this.$refs.list.scrollTop<=this.pointerPosition-(this.visibleElements-1)*this.optionHeight&&(this.$refs.list.scrollTop=this.pointerPosition-(this.visibleElements-1)*this.optionHeight),this.filteredOptions[this.pointer]&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerForward()),this.pointerDirty=!0;},pointerBackward:function(){this.pointer>0?(this.pointer--,this.$refs.list.scrollTop>=this.pointerPosition&&(this.$refs.list.scrollTop=this.pointerPosition),this.filteredOptions[this.pointer]&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerBackward()):this.filteredOptions[this.pointer]&&this.filteredOptions[0].$isLabel&&!this.groupSelect&&this.pointerForward(),this.pointerDirty=!0;},pointerReset:function(){this.closeOnSelect&&(this.pointer=0,this.$refs.list&&(this.$refs.list.scrollTop=0));},pointerAdjust:function(){this.pointer>=this.filteredOptions.length-1&&(this.pointer=this.filteredOptions.length?this.filteredOptions.length-1:0),this.filteredOptions.length>0&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerForward();},pointerSet:function(t){this.pointer=t,this.pointerDirty=!0;}}};},function(t,e,n){var i=n(36),r=n(74),o=n(15),s=n(18);t.exports=n(72)(Array,"Array",function(t,e){this._t=s(t),this._i=0,this._k=e;},function(){var t=this._t,e=this._k,n=this._i++;return !t||n>=t.length?(this._t=void 0,r(1)):"keys"==e?r(0,n):"values"==e?r(0,t[n]):r(0,[n,t[n]])},"values"),o.Arguments=o.Array,i("keys"),i("values"),i("entries");},function(t,e,n){var i=n(31),r=(n.n(i),n(32)),o=n(33);e.a={name:"vue-multiselect",mixins:[r.a,o.a],props:{name:{type:String,default:""},selectLabel:{type:String,default:"Press enter to select"},selectGroupLabel:{type:String,default:"Press enter to select group"},selectedLabel:{type:String,default:"Selected"},deselectLabel:{type:String,default:"Press enter to remove"},deselectGroupLabel:{type:String,default:"Press enter to deselect group"},showLabels:{type:Boolean,default:!0},limit:{type:Number,default:99999},maxHeight:{type:Number,default:300},limitText:{type:Function,default:function(t){return "and ".concat(t," more")}},loading:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},openDirection:{type:String,default:""},showNoOptions:{type:Boolean,default:!0},showNoResults:{type:Boolean,default:!0},tabindex:{type:Number,default:0}},computed:{isSingleLabelVisible:function(){return (this.singleValue||0===this.singleValue)&&(!this.isOpen||!this.searchable)&&!this.visibleValues.length},isPlaceholderVisible:function(){return !(this.internalValue.length||this.searchable&&this.isOpen)},visibleValues:function(){return this.multiple?this.internalValue.slice(0,this.limit):[]},singleValue:function(){return this.internalValue[0]},deselectLabelText:function(){return this.showLabels?this.deselectLabel:""},deselectGroupLabelText:function(){return this.showLabels?this.deselectGroupLabel:""},selectLabelText:function(){return this.showLabels?this.selectLabel:""},selectGroupLabelText:function(){return this.showLabels?this.selectGroupLabel:""},selectedLabelText:function(){return this.showLabels?this.selectedLabel:""},inputStyle:function(){if(this.searchable||this.multiple&&this.value&&this.value.length)return this.isOpen?{width:"100%"}:{width:"0",position:"absolute",padding:"0"}},contentStyle:function(){return this.options.length?{display:"inline-block"}:{display:"block"}},isAbove:function(){return "above"===this.openDirection||"top"===this.openDirection||"below"!==this.openDirection&&"bottom"!==this.openDirection&&"above"===this.preferredOpenDirection},showSearchInput:function(){return this.searchable&&(!this.hasSingleSelectedSlot||!this.visibleSingleValue&&0!==this.visibleSingleValue||this.isOpen)}}};},function(t,e,n){var i=n(1)("unscopables"),r=Array.prototype;void 0==r[i]&&n(8)(r,i,{}),t.exports=function(t){r[i][t]=!0;};},function(t,e,n){var i=n(18),r=n(19),o=n(85);t.exports=function(t){return function(e,n,s){var u,a=i(e),l=r(a.length),c=o(s,l);if(t&&n!=n){for(;l>c;)if((u=a[c++])!=u)return !0}else for(;l>c;c++)if((t||c in a)&&a[c]===n)return t||c||0;return !t&&-1}};},function(t,e,n){var i=n(9),r=n(1)("toStringTag"),o="Arguments"==i(function(){return arguments}()),s=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=s(e=Object(t),r))?n:o?i(e):"Object"==(u=i(e))&&"function"==typeof e.callee?"Arguments":u};},function(t,e,n){var i=n(2);t.exports=function(){var t=i(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e};},function(t,e,n){var i=n(0).document;t.exports=i&&i.documentElement;},function(t,e,n){t.exports=!n(4)&&!n(7)(function(){return 7!=Object.defineProperty(n(21)("div"),"a",{get:function(){return 7}}).a});},function(t,e,n){var i=n(9);t.exports=Array.isArray||function(t){return "Array"==i(t)};},function(t,e,n){function i(t){var e,n;this.promise=new t(function(t,i){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=i;}),this.resolve=r(e),this.reject=r(n);}var r=n(14);t.exports.f=function(t){return new i(t)};},function(t,e,n){var i=n(2),r=n(76),o=n(22),s=n(27)("IE_PROTO"),u=function(){},a=function(){var t,e=n(21)("iframe"),i=o.length;for(e.style.display="none",n(40).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),a=t.F;i--;)delete a.prototype[o[i]];return a()};t.exports=Object.create||function(t,e){var n;return null!==t?(u.prototype=i(t),n=new u,u.prototype=null,n[s]=t):n=a(),void 0===e?n:r(n,e)};},function(t,e,n){var i=n(79),r=n(25),o=n(18),s=n(29),u=n(12),a=n(41),l=Object.getOwnPropertyDescriptor;e.f=n(4)?l:function(t,e){if(t=o(t),e=s(e,!0),a)try{return l(t,e)}catch(t){}if(u(t,e))return r(!i.f.call(t,e),t[e])};},function(t,e,n){var i=n(12),r=n(18),o=n(37)(!1),s=n(27)("IE_PROTO");t.exports=function(t,e){var n,u=r(t),a=0,l=[];for(n in u)n!=s&&i(u,n)&&l.push(n);for(;e.length>a;)i(u,n=e[a++])&&(~o(l,n)||l.push(n));return l};},function(t,e,n){var i=n(46),r=n(22);t.exports=Object.keys||function(t){return i(t,r)};},function(t,e,n){var i=n(2),r=n(5),o=n(43);t.exports=function(t,e){if(i(t),r(e)&&e.constructor===t)return e;var n=o.f(t);return (0, n.resolve)(e),n.promise};},function(t,e,n){var i=n(10),r=n(0),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:i.version,mode:n(24)?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"});},function(t,e,n){var i=n(2),r=n(14),o=n(1)("species");t.exports=function(t,e){var n,s=i(t).constructor;return void 0===s||void 0==(n=i(s)[o])?e:r(n)};},function(t,e,n){var i=n(3),r=n(16),o=n(7),s=n(84),u="["+s+"]",a="​",l=RegExp("^"+u+u+"*"),c=RegExp(u+u+"*$"),f=function(t,e,n){var r={},u=o(function(){return !!s[t]()||a[t]()!=a}),l=r[t]=u?e(p):s[t];n&&(r[n]=l),i(i.P+i.F*u,"String",r);},p=f.trim=function(t,e){return t=String(r(t)),1&e&&(t=t.replace(l,"")),2&e&&(t=t.replace(c,"")),t};t.exports=f;},function(t,e,n){var i,r,o,s=n(11),u=n(68),a=n(40),l=n(21),c=n(0),f=c.process,p=c.setImmediate,h=c.clearImmediate,d=c.MessageChannel,v=c.Dispatch,g=0,y={},m=function(){var t=+this;if(y.hasOwnProperty(t)){var e=y[t];delete y[t],e();}},b=function(t){m.call(t.data);};p&&h||(p=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return y[++g]=function(){u("function"==typeof t?t:Function(t),e);},i(g),g},h=function(t){delete y[t];},"process"==n(9)(f)?i=function(t){f.nextTick(s(m,t,1));}:v&&v.now?i=function(t){v.now(s(m,t,1));}:d?(r=new d,o=r.port2,r.port1.onmessage=b,i=s(o.postMessage,o,1)):c.addEventListener&&"function"==typeof postMessage&&!c.importScripts?(i=function(t){c.postMessage(t+"","*");},c.addEventListener("message",b,!1)):i="onreadystatechange"in l("script")?function(t){a.appendChild(l("script")).onreadystatechange=function(){a.removeChild(this),m.call(t);};}:function(t){setTimeout(s(m,t,1),0);}),t.exports={set:p,clear:h};},function(t,e){var n=Math.ceil,i=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?i:n)(t)};},function(t,e,n){var i=n(3),r=n(20)(5),o=!0;"find"in[]&&Array(1).find(function(){o=!1;}),i(i.P+i.F*o,"Array",{find:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),n(36)("find");},function(t,e,n){var i,r,o,s,u=n(24),a=n(0),l=n(11),c=n(38),f=n(3),p=n(5),h=n(14),d=n(61),v=n(66),g=n(50),y=n(52).set,m=n(75)(),b=n(43),_=n(80),x=n(86),w=n(48),S=a.TypeError,O=a.process,L=O&&O.versions,k=L&&L.v8||"",P=a.Promise,T="process"==c(O),V=function(){},E=r=b.f,A=!!function(){try{var t=P.resolve(1),e=(t.constructor={})[n(1)("species")]=function(t){t(V,V);};return (T||"function"==typeof PromiseRejectionEvent)&&t.then(V)instanceof e&&0!==k.indexOf("6.6")&&-1===x.indexOf("Chrome/66")}catch(t){}}(),C=function(t){var e;return !(!p(t)||"function"!=typeof(e=t.then))&&e},D=function(t,e){if(!t._n){t._n=!0;var n=t._c;m(function(){for(var i=t._v,r=1==t._s,o=0;n.length>o;)!function(e){var n,o,s,u=r?e.ok:e.fail,a=e.resolve,l=e.reject,c=e.domain;try{u?(r||(2==t._h&&$(t),t._h=1),!0===u?n=i:(c&&c.enter(),n=u(i),c&&(c.exit(),s=!0)),n===e.promise?l(S("Promise-chain cycle")):(o=C(n))?o.call(n,a,l):a(n)):l(i);}catch(t){c&&!s&&c.exit(),l(t);}}(n[o++]);t._c=[],t._n=!1,e&&!t._h&&j(t);});}},j=function(t){y.call(a,function(){var e,n,i,r=t._v,o=N(t);if(o&&(e=_(function(){T?O.emit("unhandledRejection",r,t):(n=a.onunhandledrejection)?n({promise:t,reason:r}):(i=a.console)&&i.error&&i.error("Unhandled promise rejection",r);}),t._h=T||N(t)?2:1),t._a=void 0,o&&e.e)throw e.v});},N=function(t){return 1!==t._h&&0===(t._a||t._c).length},$=function(t){y.call(a,function(){var e;T?O.emit("rejectionHandled",t):(e=a.onrejectionhandled)&&e({promise:t,reason:t._v});});},F=function(t){var e=this;e._d||(e._d=!0,e=e._w||e,e._v=t,e._s=2,e._a||(e._a=e._c.slice()),D(e,!0));},M=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===t)throw S("Promise can't be resolved itself");(e=C(t))?m(function(){var i={_w:n,_d:!1};try{e.call(t,l(M,i,1),l(F,i,1));}catch(t){F.call(i,t);}}):(n._v=t,n._s=1,D(n,!1));}catch(t){F.call({_w:n,_d:!1},t);}}};A||(P=function(t){d(this,P,"Promise","_h"),h(t),i.call(this);try{t(l(M,this,1),l(F,this,1));}catch(t){F.call(this,t);}},i=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1;},i.prototype=n(81)(P.prototype,{then:function(t,e){var n=E(g(this,P));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=T?O.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&D(this,!1),n.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new i;this.promise=t,this.resolve=l(M,t,1),this.reject=l(F,t,1);},b.f=E=function(t){return t===P||t===s?new o(t):r(t)}),f(f.G+f.W+f.F*!A,{Promise:P}),n(26)(P,"Promise"),n(83)("Promise"),s=n(10).Promise,f(f.S+f.F*!A,"Promise",{reject:function(t){var e=E(this);return (0, e.reject)(t),e.promise}}),f(f.S+f.F*(u||!A),"Promise",{resolve:function(t){return w(u&&this===s?P:this,t)}}),f(f.S+f.F*!(A&&n(73)(function(t){P.all(t).catch(V);})),"Promise",{all:function(t){var e=this,n=E(e),i=n.resolve,r=n.reject,o=_(function(){var n=[],o=0,s=1;v(t,!1,function(t){var u=o++,a=!1;n.push(void 0),s++,e.resolve(t).then(function(t){a||(a=!0,n[u]=t,--s||i(n));},r);}),--s||i(n);});return o.e&&r(o.v),n.promise},race:function(t){var e=this,n=E(e),i=n.reject,r=_(function(){v(t,!1,function(t){e.resolve(t).then(n.resolve,i);});});return r.e&&i(r.v),n.promise}});},function(t,e,n){var i=n(3),r=n(10),o=n(0),s=n(50),u=n(48);i(i.P+i.R,"Promise",{finally:function(t){var e=s(this,r.Promise||o.Promise),n="function"==typeof t;return this.then(n?function(n){return u(e,t()).then(function(){return n})}:t,n?function(n){return u(e,t()).then(function(){throw n})}:t)}});},function(t,e,n){function i(t){n(99);}var r=n(35),o=n(101),s=n(100),u=i,a=s(r.a,o.a,!1,u,null,null);e.a=a.exports;},function(t,e,n){function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}e.a=i;},function(t,e,n){function i(t){return (i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t){return (r="function"==typeof Symbol&&"symbol"===i(Symbol.iterator)?function(t){return i(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":i(t)})(t)}e.a=r;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var i=n(34),r=(n.n(i),n(55)),o=(n.n(r),n(56)),s=(n.n(o),n(57)),u=n(32),a=n(33);n.d(e,"Multiselect",function(){return s.a}),n.d(e,"multiselectMixin",function(){return u.a}),n.d(e,"pointerMixin",function(){return a.a}),e.default=s.a;},function(t,e){t.exports=function(t,e,n,i){if(!(t instanceof e)||void 0!==i&&i in t)throw TypeError(n+": incorrect invocation!");return t};},function(t,e,n){var i=n(14),r=n(28),o=n(23),s=n(19);t.exports=function(t,e,n,u,a){i(e);var l=r(t),c=o(l),f=s(l.length),p=a?f-1:0,h=a?-1:1;if(n<2)for(;;){if(p in c){u=c[p],p+=h;break}if(p+=h,a?p<0:f<=p)throw TypeError("Reduce of empty array with no initial value")}for(;a?p>=0:f>p;p+=h)p in c&&(u=e(u,c[p],p,l));return u};},function(t,e,n){var i=n(5),r=n(42),o=n(1)("species");t.exports=function(t){var e;return r(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!r(e.prototype)||(e=void 0),i(e)&&null===(e=e[o])&&(e=void 0)),void 0===e?Array:e};},function(t,e,n){var i=n(63);t.exports=function(t,e){return new(i(t))(e)};},function(t,e,n){var i=n(8),r=n(6),o=n(7),s=n(16),u=n(1);t.exports=function(t,e,n){var a=u(t),l=n(s,a,""[t]),c=l[0],f=l[1];o(function(){var e={};return e[a]=function(){return 7},7!=""[t](e)})&&(r(String.prototype,t,c),i(RegExp.prototype,a,2==e?function(t,e){return f.call(t,this,e)}:function(t){return f.call(t,this)}));};},function(t,e,n){var i=n(11),r=n(70),o=n(69),s=n(2),u=n(19),a=n(87),l={},c={},e=t.exports=function(t,e,n,f,p){var h,d,v,g,y=p?function(){return t}:a(t),m=i(n,f,e?2:1),b=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");if(o(y)){for(h=u(t.length);h>b;b++)if((g=e?m(s(d=t[b])[0],d[1]):m(t[b]))===l||g===c)return g}else for(v=y.call(t);!(d=v.next()).done;)if((g=r(v,m,d.value,e))===l||g===c)return g};e.BREAK=l,e.RETURN=c;},function(t,e,n){var i=n(5),r=n(82).set;t.exports=function(t,e,n){var o,s=e.constructor;return s!==n&&"function"==typeof s&&(o=s.prototype)!==n.prototype&&i(o)&&r&&r(t,o),t};},function(t,e){t.exports=function(t,e,n){var i=void 0===n;switch(e.length){case 0:return i?t():t.call(n);case 1:return i?t(e[0]):t.call(n,e[0]);case 2:return i?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return i?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return i?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)};},function(t,e,n){var i=n(15),r=n(1)("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(i.Array===t||o[r]===t)};},function(t,e,n){var i=n(2);t.exports=function(t,e,n,r){try{return r?e(i(n)[0],n[1]):e(n)}catch(e){var o=t.return;throw void 0!==o&&i(o.call(t)),e}};},function(t,e,n){var i=n(44),r=n(25),o=n(26),s={};n(8)(s,n(1)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=i(s,{next:r(1,n)}),o(t,e+" Iterator");};},function(t,e,n){var i=n(24),r=n(3),o=n(6),s=n(8),u=n(15),a=n(71),l=n(26),c=n(78),f=n(1)("iterator"),p=!([].keys&&"next"in[].keys()),h=function(){return this};t.exports=function(t,e,n,d,v,g,y){a(n,e,d);var m,b,_,x=function(t){if(!p&&t in L)return L[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},w=e+" Iterator",S="values"==v,O=!1,L=t.prototype,k=L[f]||L["@@iterator"]||v&&L[v],P=k||x(v),T=v?S?x("entries"):P:void 0,V="Array"==e?L.entries||k:k;if(V&&(_=c(V.call(new t)))!==Object.prototype&&_.next&&(l(_,w,!0),i||"function"==typeof _[f]||s(_,f,h)),S&&k&&"values"!==k.name&&(O=!0,P=function(){return k.call(this)}),i&&!y||!p&&!O&&L[f]||s(L,f,P),u[e]=P,u[w]=h,v)if(m={values:S?P:x("values"),keys:g?P:x("keys"),entries:T},y)for(b in m)b in L||o(L,b,m[b]);else r(r.P+r.F*(p||O),e,m);return m};},function(t,e,n){var i=n(1)("iterator"),r=!1;try{var o=[7][i]();o.return=function(){r=!0;},Array.from(o,function(){throw 2});}catch(t){}t.exports=function(t,e){if(!e&&!r)return !1;var n=!1;try{var o=[7],s=o[i]();s.next=function(){return {done:n=!0}},o[i]=function(){return s},t(o);}catch(t){}return n};},function(t,e){t.exports=function(t,e){return {value:e,done:!!t}};},function(t,e,n){var i=n(0),r=n(52).set,o=i.MutationObserver||i.WebKitMutationObserver,s=i.process,u=i.Promise,a="process"==n(9)(s);t.exports=function(){var t,e,n,l=function(){var i,r;for(a&&(i=s.domain)&&i.exit();t;){r=t.fn,t=t.next;try{r();}catch(i){throw t?n():e=void 0,i}}e=void 0,i&&i.enter();};if(a)n=function(){s.nextTick(l);};else if(!o||i.navigator&&i.navigator.standalone)if(u&&u.resolve){var c=u.resolve(void 0);n=function(){c.then(l);};}else n=function(){r.call(i,l);};else {var f=!0,p=document.createTextNode("");new o(l).observe(p,{characterData:!0}),n=function(){p.data=f=!f;};}return function(i){var r={fn:i,next:void 0};e&&(e.next=r),t||(t=r,n()),e=r;}};},function(t,e,n){var i=n(13),r=n(2),o=n(47);t.exports=n(4)?Object.defineProperties:function(t,e){r(t);for(var n,s=o(e),u=s.length,a=0;u>a;)i.f(t,n=s[a++],e[n]);return t};},function(t,e,n){var i=n(46),r=n(22).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,r)};},function(t,e,n){var i=n(12),r=n(28),o=n(27)("IE_PROTO"),s=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=r(t),i(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?s:null};},function(t,e){e.f={}.propertyIsEnumerable;},function(t,e){t.exports=function(t){try{return {e:!1,v:t()}}catch(t){return {e:!0,v:t}}};},function(t,e,n){var i=n(6);t.exports=function(t,e,n){for(var r in e)i(t,r,e[r],n);return t};},function(t,e,n){var i=n(5),r=n(2),o=function(t,e){if(r(t),!i(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,i){try{i=n(11)(Function.call,n(45).f(Object.prototype,"__proto__").set,2),i(t,[]),e=!(t instanceof Array);}catch(t){e=!0;}return function(t,n){return o(t,n),e?t.__proto__=n:i(t,n),t}}({},!1):void 0),check:o};},function(t,e,n){var i=n(0),r=n(13),o=n(4),s=n(1)("species");t.exports=function(t){var e=i[t];o&&e&&!e[s]&&r.f(e,s,{configurable:!0,get:function(){return this}});};},function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff";},function(t,e,n){var i=n(53),r=Math.max,o=Math.min;t.exports=function(t,e){return t=i(t),t<0?r(t+e,0):o(t,e)};},function(t,e,n){var i=n(0),r=i.navigator;t.exports=r&&r.userAgent||"";},function(t,e,n){var i=n(38),r=n(1)("iterator"),o=n(15);t.exports=n(10).getIteratorMethod=function(t){if(void 0!=t)return t[r]||t["@@iterator"]||o[i(t)]};},function(t,e,n){var i=n(3),r=n(20)(2);i(i.P+i.F*!n(17)([].filter,!0),"Array",{filter:function(t){return r(this,t,arguments[1])}});},function(t,e,n){var i=n(3),r=n(37)(!1),o=[].indexOf,s=!!o&&1/[1].indexOf(1,-0)<0;i(i.P+i.F*(s||!n(17)(o)),"Array",{indexOf:function(t){return s?o.apply(this,arguments)||0:r(this,t,arguments[1])}});},function(t,e,n){var i=n(3);i(i.S,"Array",{isArray:n(42)});},function(t,e,n){var i=n(3),r=n(20)(1);i(i.P+i.F*!n(17)([].map,!0),"Array",{map:function(t){return r(this,t,arguments[1])}});},function(t,e,n){var i=n(3),r=n(62);i(i.P+i.F*!n(17)([].reduce,!0),"Array",{reduce:function(t){return r(this,t,arguments.length,arguments[1],!1)}});},function(t,e,n){var i=Date.prototype,r=i.toString,o=i.getTime;new Date(NaN)+""!="Invalid Date"&&n(6)(i,"toString",function(){var t=o.call(this);return t===t?r.call(this):"Invalid Date"});},function(t,e,n){n(4)&&"g"!=/./g.flags&&n(13).f(RegExp.prototype,"flags",{configurable:!0,get:n(39)});},function(t,e,n){n(65)("search",1,function(t,e,n){return [function(n){var i=t(this),r=void 0==n?void 0:n[e];return void 0!==r?r.call(n,i):new RegExp(n)[e](String(i))},n]});},function(t,e,n){n(94);var i=n(2),r=n(39),o=n(4),s=/./.toString,u=function(t){n(6)(RegExp.prototype,"toString",t,!0);};n(7)(function(){return "/a/b"!=s.call({source:"a",flags:"b"})})?u(function(){var t=i(this);return "/".concat(t.source,"/","flags"in t?t.flags:!o&&t instanceof RegExp?r.call(t):void 0)}):"toString"!=s.name&&u(function(){return s.call(this)});},function(t,e,n){n(51)("trim",function(t){return function(){return t(this,3)}});},function(t,e,n){for(var i=n(34),r=n(47),o=n(6),s=n(0),u=n(8),a=n(15),l=n(1),c=l("iterator"),f=l("toStringTag"),p=a.Array,h={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},d=r(h),v=0;v<d.length;v++){var g,y=d[v],m=h[y],b=s[y],_=b&&b.prototype;if(_&&(_[c]||u(_,c,p),_[f]||u(_,f,y),a[y]=p,m))for(g in i)_[g]||o(_,g,i[g],!0);}},function(t,e){},function(t,e){t.exports=function(t,e,n,i,r,o){var s,u=t=t||{},a=typeof t.default;"object"!==a&&"function"!==a||(s=t,u=t.default);var l="function"==typeof u?u.options:u;e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns,l._compiled=!0),n&&(l.functional=!0),r&&(l._scopeId=r);var c;if(o?(c=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),i&&i.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o);},l._ssrRegister=c):i&&(c=i),c){var f=l.functional,p=f?l.render:l.beforeCreate;f?(l._injectStyles=c,l.render=function(t,e){return c.call(e),p(t,e)}):l.beforeCreate=p?[].concat(p,c):[c];}return {esModule:s,exports:u,options:l}};},function(t,e,n){var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"multiselect",class:{"multiselect--active":t.isOpen,"multiselect--disabled":t.disabled,"multiselect--above":t.isAbove},attrs:{tabindex:t.searchable?-1:t.tabindex},on:{focus:function(e){t.activate();},blur:function(e){!t.searchable&&t.deactivate();},keydown:[function(e){return "button"in e||!t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"])?e.target!==e.currentTarget?null:(e.preventDefault(),void t.pointerForward()):null},function(e){return "button"in e||!t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"])?e.target!==e.currentTarget?null:(e.preventDefault(),void t.pointerBackward()):null}],keypress:function(e){return "button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")||!t._k(e.keyCode,"tab",9,e.key,"Tab")?(e.stopPropagation(),e.target!==e.currentTarget?null:void t.addPointerElement(e)):null},keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27,e.key,"Escape"))return null;t.deactivate();}}},[t._t("caret",[n("div",{staticClass:"multiselect__select",on:{mousedown:function(e){e.preventDefault(),e.stopPropagation(),t.toggle();}}})],{toggle:t.toggle}),t._v(" "),t._t("clear",null,{search:t.search}),t._v(" "),n("div",{ref:"tags",staticClass:"multiselect__tags"},[t._t("selection",[n("div",{directives:[{name:"show",rawName:"v-show",value:t.visibleValues.length>0,expression:"visibleValues.length > 0"}],staticClass:"multiselect__tags-wrap"},[t._l(t.visibleValues,function(e,i){return [t._t("tag",[n("span",{key:i,staticClass:"multiselect__tag"},[n("span",{domProps:{textContent:t._s(t.getOptionLabel(e))}}),t._v(" "),n("i",{staticClass:"multiselect__tag-icon",attrs:{"aria-hidden":"true",tabindex:"1"},on:{keypress:function(n){if(!("button"in n)&&t._k(n.keyCode,"enter",13,n.key,"Enter"))return null;n.preventDefault(),t.removeElement(e);},mousedown:function(n){n.preventDefault(),t.removeElement(e);}}})])],{option:e,search:t.search,remove:t.removeElement})]})],2),t._v(" "),t.internalValue&&t.internalValue.length>t.limit?[t._t("limit",[n("strong",{staticClass:"multiselect__strong",domProps:{textContent:t._s(t.limitText(t.internalValue.length-t.limit))}})])]:t._e()],{search:t.search,remove:t.removeElement,values:t.visibleValues,isOpen:t.isOpen}),t._v(" "),n("transition",{attrs:{name:"multiselect__loading"}},[t._t("loading",[n("div",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"multiselect__spinner"})])],2),t._v(" "),t.searchable?n("input",{ref:"search",staticClass:"multiselect__input",style:t.inputStyle,attrs:{name:t.name,id:t.id,type:"text",autocomplete:"nope",placeholder:t.placeholder,disabled:t.disabled,tabindex:t.tabindex},domProps:{value:t.search},on:{input:function(e){t.updateSearch(e.target.value);},focus:function(e){e.preventDefault(),t.activate();},blur:function(e){e.preventDefault(),t.deactivate();},keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27,e.key,"Escape"))return null;t.deactivate();},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"]))return null;e.preventDefault(),t.pointerForward();},function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"]))return null;e.preventDefault(),t.pointerBackward();},function(e){if(!("button"in e)&&t._k(e.keyCode,"delete",[8,46],e.key,["Backspace","Delete"]))return null;e.stopPropagation(),t.removeLastElement();}],keypress:function(e){return "button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?(e.preventDefault(),e.stopPropagation(),e.target!==e.currentTarget?null:void t.addPointerElement(e)):null}}}):t._e(),t._v(" "),t.isSingleLabelVisible?n("span",{staticClass:"multiselect__single",on:{mousedown:function(e){return e.preventDefault(),t.toggle(e)}}},[t._t("singleLabel",[[t._v(t._s(t.currentOptionLabel))]],{option:t.singleValue})],2):t._e(),t._v(" "),t.isPlaceholderVisible?n("span",{staticClass:"multiselect__placeholder",on:{mousedown:function(e){return e.preventDefault(),t.toggle(e)}}},[t._t("placeholder",[t._v("\n          "+t._s(t.placeholder)+"\n        ")])],2):t._e()],2),t._v(" "),n("transition",{attrs:{name:"multiselect"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.isOpen,expression:"isOpen"}],ref:"list",staticClass:"multiselect__content-wrapper",style:{maxHeight:t.optimizedHeight+"px"},attrs:{tabindex:"-1"},on:{focus:t.activate,mousedown:function(t){t.preventDefault();}}},[n("ul",{staticClass:"multiselect__content",style:t.contentStyle},[t._t("beforeList"),t._v(" "),t.multiple&&t.max===t.internalValue.length?n("li",[n("span",{staticClass:"multiselect__option"},[t._t("maxElements",[t._v("Maximum of "+t._s(t.max)+" options selected. First remove a selected option to select another.")])],2)]):t._e(),t._v(" "),!t.max||t.internalValue.length<t.max?t._l(t.filteredOptions,function(e,i){return n("li",{key:i,staticClass:"multiselect__element"},[e&&(e.$isLabel||e.$isDisabled)?t._e():n("span",{staticClass:"multiselect__option",class:t.optionHighlight(i,e),attrs:{"data-select":e&&e.isTag?t.tagPlaceholder:t.selectLabelText,"data-selected":t.selectedLabelText,"data-deselect":t.deselectLabelText},on:{click:function(n){n.stopPropagation(),t.select(e);},mouseenter:function(e){if(e.target!==e.currentTarget)return null;t.pointerSet(i);}}},[t._t("option",[n("span",[t._v(t._s(t.getOptionLabel(e)))])],{option:e,search:t.search})],2),t._v(" "),e&&(e.$isLabel||e.$isDisabled)?n("span",{staticClass:"multiselect__option",class:t.groupHighlight(i,e),attrs:{"data-select":t.groupSelect&&t.selectGroupLabelText,"data-deselect":t.groupSelect&&t.deselectGroupLabelText},on:{mouseenter:function(e){if(e.target!==e.currentTarget)return null;t.groupSelect&&t.pointerSet(i);},mousedown:function(n){n.preventDefault(),t.selectGroup(e);}}},[t._t("option",[n("span",[t._v(t._s(t.getOptionLabel(e)))])],{option:e,search:t.search})],2):t._e()])}):t._e(),t._v(" "),n("li",{directives:[{name:"show",rawName:"v-show",value:t.showNoResults&&0===t.filteredOptions.length&&t.search&&!t.loading,expression:"showNoResults && (filteredOptions.length === 0 && search && !loading)"}]},[n("span",{staticClass:"multiselect__option"},[t._t("noResult",[t._v("No elements found. Consider changing the search query.")],{search:t.search})],2)]),t._v(" "),n("li",{directives:[{name:"show",rawName:"v-show",value:t.showNoOptions&&0===t.options.length&&!t.search&&!t.loading,expression:"showNoOptions && (options.length === 0 && !search && !loading)"}]},[n("span",{staticClass:"multiselect__option"},[t._t("noOptions",[t._v("List is empty.")])],2)]),t._v(" "),t._t("afterList")],2)])])],2)},r=[],o={render:i,staticRenderFns:r};e.a=o;}])});
  });

  var Multiselect = unwrapExports(vueMultiselect_min);
  var vueMultiselect_min_1 = vueMultiselect_min.VueMultiselect;

  //
      var script$4 = {
          name: 'UserEditModal',
          props: {
              openModal: Boolean, // Requested modal state
              onClose: Function,
              userToEdit: Object
          },
          data: () => {
              return {
                  user: {},
                  password: '', // Password change model
                  passwordConfirm: '',
                  passwordMatchError: false,
                  passwordLengthError: false,
                  groups: ['Administrator', 'Editor', 'User'],
                  selectedGroups: [], // Groups tag component model
                  permissions: ['Read', 'Write', 'Edit', 'Delete'],
                  selectedPermissions: [], // Permissions tag component model
                  isOpen: false // Actual modal state
              }
          },
          watch: {
              openModal: function (val) {
              	if (val === this.isOpen) {
              		// Already in requested state
              		return
              	}
                  if (val) {
                  	this.selectedGroups.length = 0;
                  	this.selectedPermissions.length = 0;
                  	if (this.userToEdit.id) {
                  		let userCopy = Object.assign({}, this.userToEdit);
  		        		let {groups, permissions, ...user} = userCopy;
  		        		Object.assign(this.user, user);
  		        		this.selectedGroups.push(...groups);
  		        		this.selectedPermissions.push(...permissions);
  		        		console.debug('Adding groups', this.selectedGroups);
  		        	}
                      this.open();
                  } else {
                      this.close();
                  }
              },
              password: function (val) {
              	this.checkPasswords();
              },
              passwordConfirm: function (val) {
              	this.checkPasswords();
              }
          },
          methods: {
              onCancelClick () {
                  this.close();
              },
              onSaveClick () {
              	console.debug('saving groups', this.selectedGroups);
              	Object.assign(this.userToEdit, this.user);
              	this.userToEdit.groups.length = 0;
              	this.userToEdit.permissions.length = 0;
              	this.userToEdit.groups.push(...this.selectedGroups);
              	this.userToEdit.permissions.push(...this.selectedPermissions);
                  let requestBody = Object.assign({}, this.userToEdit);

                  // TODO - if (user.id) edit : save
                  // fetch(`${this.server}/user`, {
                  //     method: 'PUT',
                  //     headers: {
                  //         'Content-Type': 'application/json'
                  //     },
                  //     body: requestBody
                  // })
                  // .then(response => {
                  //     if (response.ok) {
                  //         // Success
                  //         let event = new Event('user-created.ft', {user: response.detail})
                  //         document.dispatchEvent(event)
                  //         this.close()
                  //     } else {
                  //         response.json().then(json => {
                  //             json.detail.forEach(error => {
                  //                 error.loc.forEach(loc => {
                  //                     if (this.$refs[loc]) {
                  //                         this.$refs[loc].classList.add('error')
                  //                     }
                  //                 })
                  //             })
                  //         })
                  //     }
                  // })
                  // .catch(response => {
                  //     console.debug('Error creating user or parsing response', response)
                  // })

                  // Temp, dev code until API is ready
                  let event;
                  if (this.user.id) {
                  	event = new CustomEvent('user-edited.ft', {detail: {user: Object.assign({id:3}, this.userToEdit)}});
                  } else {
                  	event = new CustomEvent('user-created.ft', {detail: {user: Object.assign({id:3}, this.userToEdit)}});
                  }
                  document.dispatchEvent(event);
                  this.close();
              },
              addGroup (newGroup) {
        			this.user.groups.push(newGroup);
        			this.groups.push(newGroup);
  			},
  			addPermission (newPermission) {
        			this.user.permissions.push(newPermission);
        			this.permissions.push(newPermission);
  			},
  			checkPasswords () {
  				this.$refs.password.classList.remove('error');
  				this.$refs.passwordConfirm.classList.remove('error');
  				this.passwordLengthError = false;
  				this.passwordMatchError = false;
  				if (this.password.length && this.passwordConfirm.length) {
  					if (this.password.length < 6) {
  						this.$refs.password.classList.add('error');
  						this.passwordLengthError = true;
  					}
  					if (this.passwordConfirm.length < 6) {
  						this.$refs.passwordConfirm.classList.add('error');
  					}
  					if (this.passwordConfirm !== this.password) {
  						this.$refs.passwordConfirm.classList.add('error');
  						this.passwordMatchError = true;
  					}
  				}
  			},
              open () {
              	console.debug('Opening modal');
                  document.body.appendChild(this.$refs.modalWrapper);
                  this.isOpen = true;
              },
              close () {
                  this.$refs.modalTemplate.appendChild(this.$refs.modalWrapper);
                  this.isOpen = false;
                  if (typeof this.onClose === 'function') {
                  	this.onClose();
                  }
              }
          },
          components: {
          	Multiselect
          }
      };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        directives: [
          { name: "show", rawName: "v-show", value: false, expression: "false" }
        ],
        ref: "modalTemplate"
      },
      [
        _c("div", { ref: "modalWrapper", staticClass: "modal__wrapper" }, [
          _c("div", { staticClass: "modal-backdrop" }, [
            _c("div", { staticClass: "modal" }, [
              _c("header", { staticClass: "header" }, [
                !_vm.userToEdit.id ? _c("h1", [_vm._v("Add User")]) : _vm._e(),
                _vm._v(" "),
                _vm.userToEdit.id ? _c("h1", [_vm._v("Edit User")]) : _vm._e()
              ]),
              _vm._v(" "),
              _c("main", { staticClass: "main" }, [
                _c("form", { staticClass: "form", attrs: { novalidate: "" } }, [
                  _c("div", { staticClass: "form-group" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.user.name,
                          expression: "user.name"
                        }
                      ],
                      ref: "name",
                      staticClass: "form-control",
                      attrs: {
                        type: "text",
                        name: "name",
                        placeholder: "Name",
                        required: true
                      },
                      domProps: { value: _vm.user.name },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(_vm.user, "name", $event.target.value);
                        }
                      }
                    })
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "form-group" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.user.email,
                          expression: "user.email"
                        }
                      ],
                      ref: "email",
                      staticClass: "form-control",
                      attrs: {
                        type: "text",
                        name: "email",
                        placeholder: "Email",
                        required: true
                      },
                      domProps: { value: _vm.user.email },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(_vm.user, "email", $event.target.value);
                        }
                      }
                    })
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "form-group" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.password,
                          expression: "password"
                        }
                      ],
                      ref: "password",
                      staticClass: "form-control",
                      attrs: {
                        type: "password",
                        name: "password",
                        placeholder: "Password",
                        required: "true"
                      },
                      domProps: { value: _vm.password },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.password = $event.target.value;
                        }
                      }
                    }),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.passwordConfirm,
                          expression: "passwordConfirm"
                        }
                      ],
                      ref: "passwordConfirm",
                      staticClass: "form-control password-confirm",
                      attrs: {
                        type: "password",
                        name: "passwordConfirm",
                        placeholder: "Confirm Password",
                        required: "true"
                      },
                      domProps: { value: _vm.passwordConfirm },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.passwordConfirm = $event.target.value;
                        }
                      }
                    }),
                    _vm._v(" "),
                    _vm.passwordMatchError
                      ? _c("label", { staticClass: "error-message" }, [
                          _vm._v("Passwords do not match.")
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.passwordLengthError
                      ? _c("label", { staticClass: "error-message" }, [
                          _vm._v(
                            "Password must be at least 6 characters in length."
                          )
                        ])
                      : _vm._e()
                  ]),
                  _vm._v(" "),
                  _vm.isOpen
                    ? _c("div", { staticClass: "form-group-row" }, [
                        _c(
                          "div",
                          { staticClass: "form-group" },
                          [
                            _c("multiselect", {
                              attrs: {
                                options: _vm.groups,
                                "tag-placeholder": "Add as new group",
                                placeholder: "Groups",
                                multiple: true,
                                taggable: true
                              },
                              on: { tag: _vm.addGroup },
                              model: {
                                value: _vm.selectedGroups,
                                callback: function($$v) {
                                  _vm.selectedGroups = $$v;
                                },
                                expression: "selectedGroups"
                              }
                            })
                          ],
                          1
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "form-group" },
                          [
                            _c("multiselect", {
                              attrs: {
                                options: _vm.permissions,
                                "tag-placeholder": "Add as new permission",
                                placeholder: "Permissions",
                                multiple: true,
                                taggable: true
                              },
                              on: { tag: _vm.addPermission },
                              model: {
                                value: _vm.selectedPermissions,
                                callback: function($$v) {
                                  _vm.selectedPermissions = $$v;
                                },
                                expression: "selectedPermissions"
                              }
                            })
                          ],
                          1
                        )
                      ])
                    : _vm._e()
                ])
              ]),
              _vm._v(" "),
              _c("footer", { staticClass: "footer" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-link",
                    on: { click: _vm.onCancelClick }
                  },
                  [_vm._v("Cancel")]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "btn btn-primary",
                    on: { click: _vm.onSaveClick }
                  },
                  [_vm._v("Save")]
                )
              ])
            ])
          ])
        ])
      ]
    )
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    const __vue_inject_styles__$4 = function (inject) {
      if (!inject) return
      inject("data-v-1d4986b7_0", { source: "fieldset[disabled] .multiselect{pointer-events:none}.multiselect__spinner{position:absolute;right:1px;top:1px;width:48px;height:35px;background:#fff;display:block}.multiselect__spinner:after,.multiselect__spinner:before{position:absolute;content:\"\";top:50%;left:50%;margin:-8px 0 0 -8px;width:16px;height:16px;border-radius:100%;border:2px solid transparent;border-top-color:#41b883;box-shadow:0 0 0 1px transparent}.multiselect__spinner:before{animation:spinning 2.4s cubic-bezier(.41,.26,.2,.62);animation-iteration-count:infinite}.multiselect__spinner:after{animation:spinning 2.4s cubic-bezier(.51,.09,.21,.8);animation-iteration-count:infinite}.multiselect__loading-enter-active,.multiselect__loading-leave-active{transition:opacity .4s ease-in-out;opacity:1}.multiselect__loading-enter,.multiselect__loading-leave-active{opacity:0}.multiselect,.multiselect__input,.multiselect__single{font-family:inherit;font-size:16px;-ms-touch-action:manipulation;touch-action:manipulation}.multiselect{box-sizing:content-box;display:block;position:relative;width:100%;min-height:40px;text-align:left;color:#35495e}.multiselect *{box-sizing:border-box}.multiselect:focus{outline:none}.multiselect--disabled{background:#ededed;pointer-events:none;opacity:.6}.multiselect--active{z-index:50}.multiselect--active:not(.multiselect--above) .multiselect__current,.multiselect--active:not(.multiselect--above) .multiselect__input,.multiselect--active:not(.multiselect--above) .multiselect__tags{border-bottom-left-radius:0;border-bottom-right-radius:0}.multiselect--active .multiselect__select{transform:rotate(180deg)}.multiselect--above.multiselect--active .multiselect__current,.multiselect--above.multiselect--active .multiselect__input,.multiselect--above.multiselect--active .multiselect__tags{border-top-left-radius:0;border-top-right-radius:0}.multiselect__input,.multiselect__single{position:relative;display:inline-block;min-height:20px;line-height:20px;border:none;border-radius:5px;background:#fff;padding:0 0 0 5px;width:100%;transition:border .1s ease;box-sizing:border-box;margin-bottom:8px;vertical-align:top}.multiselect__input:-ms-input-placeholder{color:#35495e}.multiselect__input::placeholder{color:#35495e}.multiselect__tag~.multiselect__input,.multiselect__tag~.multiselect__single{width:auto}.multiselect__input:hover,.multiselect__single:hover{border-color:#cfcfcf}.multiselect__input:focus,.multiselect__single:focus{border-color:#a8a8a8;outline:none}.multiselect__single{padding-left:5px;margin-bottom:8px}.multiselect__tags-wrap{display:inline}.multiselect__tags{min-height:40px;display:block;padding:8px 40px 0 8px;border-radius:5px;border:1px solid #e8e8e8;background:#fff;font-size:14px}.multiselect__tag{position:relative;display:inline-block;padding:4px 26px 4px 10px;border-radius:5px;margin-right:10px;color:#fff;line-height:1;background:#41b883;margin-bottom:5px;white-space:nowrap;overflow:hidden;max-width:100%;text-overflow:ellipsis}.multiselect__tag-icon{cursor:pointer;margin-left:7px;position:absolute;right:0;top:0;bottom:0;font-weight:700;font-style:normal;width:22px;text-align:center;line-height:22px;transition:all .2s ease;border-radius:5px}.multiselect__tag-icon:after{content:\"\\D7\";color:#266d4d;font-size:14px}.multiselect__tag-icon:focus,.multiselect__tag-icon:hover{background:#369a6e}.multiselect__tag-icon:focus:after,.multiselect__tag-icon:hover:after{color:#fff}.multiselect__current{min-height:40px;overflow:hidden;padding:8px 30px 0 12px;white-space:nowrap;border-radius:5px;border:1px solid #e8e8e8}.multiselect__current,.multiselect__select{line-height:16px;box-sizing:border-box;display:block;margin:0;text-decoration:none;cursor:pointer}.multiselect__select{position:absolute;width:40px;height:38px;right:1px;top:1px;padding:4px 8px;text-align:center;transition:transform .2s ease}.multiselect__select:before{position:relative;right:0;top:65%;color:#999;margin-top:4px;border-color:#999 transparent transparent;border-style:solid;border-width:5px 5px 0;content:\"\"}.multiselect__placeholder{color:#adadad;display:inline-block;margin-bottom:10px;padding-top:2px}.multiselect--active .multiselect__placeholder{display:none}.multiselect__content-wrapper{position:absolute;display:block;background:#fff;width:100%;max-height:240px;overflow:auto;border:1px solid #e8e8e8;border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;z-index:50;-webkit-overflow-scrolling:touch}.multiselect__content{list-style:none;display:inline-block;padding:0;margin:0;min-width:100%;vertical-align:top}.multiselect--above .multiselect__content-wrapper{bottom:100%;border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom:none;border-top:1px solid #e8e8e8}.multiselect__content::webkit-scrollbar{display:none}.multiselect__element{display:block}.multiselect__option{display:block;padding:12px;min-height:40px;line-height:16px;text-decoration:none;text-transform:none;vertical-align:middle;position:relative;cursor:pointer;white-space:nowrap}.multiselect__option:after{top:0;right:0;position:absolute;line-height:40px;padding-right:12px;padding-left:20px;font-size:13px}.multiselect__option--highlight{background:#41b883;outline:none;color:#fff}.multiselect__option--highlight:after{content:attr(data-select);background:#41b883;color:#fff}.multiselect__option--selected{background:#f3f3f3;color:#35495e;font-weight:700}.multiselect__option--selected:after{content:attr(data-selected);color:silver}.multiselect__option--selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect--disabled .multiselect__current,.multiselect--disabled .multiselect__select{background:#ededed;color:#a6a6a6}.multiselect__option--disabled{background:#ededed!important;color:#a6a6a6!important;cursor:text;pointer-events:none}.multiselect__option--group{background:#ededed;color:#35495e}.multiselect__option--group.multiselect__option--highlight{background:#35495e;color:#fff}.multiselect__option--group.multiselect__option--highlight:after{background:#35495e}.multiselect__option--disabled.multiselect__option--highlight{background:#dedede}.multiselect__option--group-selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--group-selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect-enter-active,.multiselect-leave-active{transition:all .15s ease}.multiselect-enter,.multiselect-leave-active{opacity:0}.multiselect__strong{margin-bottom:8px;line-height:20px;display:inline-block;vertical-align:top}[dir=rtl] .multiselect{text-align:right}[dir=rtl] .multiselect__select{right:auto;left:1px}[dir=rtl] .multiselect__tags{padding:8px 8px 0 40px}[dir=rtl] .multiselect__content{text-align:right}[dir=rtl] .multiselect__option:after{right:auto;left:0}[dir=rtl] .multiselect__clear{right:auto;left:12px}[dir=rtl] .multiselect__spinner{right:auto;left:1px}@keyframes spinning{0%{transform:rotate(0)}to{transform:rotate(2turn)}}", map: undefined, media: undefined })
  ,inject("data-v-1d4986b7_1", { source: ".modal__wrapper {\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  z-index: 999;\n}\n.modal__wrapper *, .modal__wrapper ::after, .modal__wrapper ::before {\n  box-sizing: border-box;\n}\n.modal__wrapper .modal-backdrop {\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n  pointer-events: none;\n  transition: all 0.3s;\n}\n.modal__wrapper .modal {\n  width: 600px;\n  height: auto;\n  position: absolute;\n  top: 20%;\n  left: 50%;\n  transform: translate(-50%, -20%);\n  background: #ffffff;\n  border-radius: 3px;\n  pointer-events: all;\n}\n.modal__wrapper .header {\n  padding: 1rem;\n  border-bottom: solid 1px #e3e3e3;\n}\n.modal__wrapper .header h1 {\n  font-size: 1.4rem;\n}\n.modal__wrapper .main {\n  padding: 1rem;\n  background-color: #fffbfc;\n}\n.modal__wrapper .btn {\n  border-radius: 2px;\n  padding: 0.5rem 1rem;\n  line-height: 1.5rem;\n  font-size: 1rem;\n  font-weight: bold;\n  border: none;\n  color: #fff;\n}\n.modal__wrapper .btn-primary {\n  background: #fa225b;\n}\n.modal__wrapper .btn-link {\n  color: #fa225b;\n}\n.modal__wrapper .btn-block {\n  display: block;\n  width: 100%;\n}\n.modal__wrapper .btn:hover {\n  cursor: pointer;\n  box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n}\n.modal__wrapper .btn:focus {\n  outline: 0;\n}\n.modal__wrapper .form {\n  font-size: 13px;\n  position: relative;\n}\n.modal__wrapper .form-group {\n  margin-bottom: 1rem;\n}\n.modal__wrapper .form-control {\n  display: block;\n  width: 100%;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  border-radius: 2px;\n  min-height: 41px;\n  background: #fff;\n  border: 1px solid #e3e3e3;\n  box-shadow: none !important;\n}\n.modal__wrapper .form-control:focus {\n  outline: 0;\n}\n.modal__wrapper .password-confirm {\n  margin-top: -2px;\n  border-top-left-radius: 0px;\n  border-top-right-radius: 0px;\n}\n.modal__wrapper .form-control.error, .modal__wrapper .form-control.vf-invalid {\n  border-color: #d9534f;\n  background: #fff0f4;\n}\n.modal__wrapper .error-message {\n  color: #d9534f;\n  font-size: 0.8rem;\n}\n.modal__wrapper .multiselect__tags {\n  border-radius: 2px;\n}\n.modal__wrapper .footer {\n  display: flex;\n  justify-content: flex-end;\n  border-top: solid 1px #e3e3e3;\n  padding: 1rem;\n}\n.modal__wrapper .footer .btn {\n  margin-left: 1rem;\n}\n\n/*# sourceMappingURL=UserEditModal.vue.map */", map: {"version":3,"sources":["/Users/dylan/dev/zuar/frontendtoolbox/src/elements/UserEditModal/UserEditModal.vue","UserEditModal.vue"],"names":[],"mappings":"AAmPA;EACA,eAAA;EACA,MAAA;EACA,OAAA;EACA,SAAA;EACA,QAAA;EACA,YAAA;AClPA;ADoPA;EACA,sBAAA;AClPA;ADqPA;EACA,WAAA;EACA,YAAA;EACA,oCAAA;EACA,oBAAA;EACA,oBAAA;ACnPA;ADqPA;EACA,YAAA;EACA,YAAA;EACA,kBAAA;EACA,QAAA;EACA,SAAA;EACA,gCAAA;EACA,mBAAA;EACA,kBAAA;EACA,mBAAA;ACnPA;ADqPA;EACA,aAAA;EACA,gCAAA;ACnPA;ADoPA;EACA,iBAAA;AClPA;ADqPA;EACA,aAAA;EACA,yBAAA;ACnPA;ADqPA;EACA,kBAAA;EACA,oBAAA;EACA,mBAAA;EACA,eAAA;EACA,iBAAA;EACA,YAAA;EACA,WAAA;ACnPA;ADqPA;EACA,mBAAA;ACnPA;ADqPA;EACA,cAAA;ACnPA;ADqPA;EACA,cAAA;EACA,WAAA;ACnPA;ADqPA;EACA,eAAA;EACA,+CAAA;ACnPA;ADqPA;EACA,UAAA;ACnPA;ADsPA;EACA,eAAA;EACA,kBAAA;ACpPA;ADsPA;EACA,mBAAA;ACpPA;ADsPA;EACA,cAAA;EACA,WAAA;EACA,yBAAA;EACA,eAAA;EACA,gBAAA;EACA,kBAAA;EACA,gBAAA;EACA,gBAAA;EACA,yBAAA;EACA,2BAAA;ACpPA;ADsPA;EACA,UAAA;ACpPA;ADuPA;EACA,gBAAA;EACA,2BAAA;EACA,4BAAA;ACrPA;ADuPA;EACA,qBAAA;EACA,mBAAA;ACrPA;ADuPA;EACA,cAAA;EACA,iBAAA;ACrPA;ADwPA;EACA,kBAAA;ACtPA;ADyPA;EACA,aAAA;EACA,yBAAA;EACA,6BAAA;EACA,aAAA;ACvPA;ADwPA;EACA,iBAAA;ACtPA;;AAEA,4CAA4C","file":"UserEditModal.vue","sourcesContent":["<template>\n\t<div v-show=\"false\" ref=\"modalTemplate\">\n        <div class=\"modal__wrapper\" ref=\"modalWrapper\">\n            <div class=\"modal-backdrop\">\n                <div class=\"modal\">\n                    <header class=\"header\">\n                    \t<h1 v-if=\"!userToEdit.id\">Add User</h1>\n                    \t<h1 v-if=\"userToEdit.id\">Edit User</h1>\n                \t</header>\n                    <main class=\"main\">\n                        <form\n                            class=\"form\"\n                            novalidate>\n                            <div class=\"form-group\">\n                                <input \n                                    type=\"text\" \n                                    class=\"form-control\" \n                                    name=\"name\" \n                                    placeholder=\"Name\"\n                                    ref=\"name\"\n                                    v-model=\"user.name\"\n                                    :required=\"true\" />\n                            </div>\n                            <div class=\"form-group\">\n                                <input \n                                    type=\"text\" \n                                    class=\"form-control\" \n                                    name=\"email\" \n                                    placeholder=\"Email\"\n                                    ref=\"email\"\n                                    v-model=\"user.email\"\n                                    :required=\"true\" />\n                            </div>\n\n                            <div class=\"form-group\">\n\t\t\t\t                <input \n\t\t\t\t                    type=\"password\" \n\t\t\t\t                    class=\"form-control\"\n\t\t\t\t                    name=\"password\" \n\t\t\t\t                    placeholder=\"Password\" \n\t\t\t\t                    ref=\"password\"\n\t\t\t\t                    v-model=\"password\"\n\t\t\t\t                    required=\"true\">\n\t\t\t\t                <input \n\t\t\t\t                    type=\"password\" \n\t\t\t\t                    class=\"form-control password-confirm\"\n\t\t\t\t                    name=\"passwordConfirm\" \n\t\t\t\t                    placeholder=\"Confirm Password\" \n\t\t\t\t                    ref=\"passwordConfirm\"\n\t\t\t\t                    v-model=\"passwordConfirm\"\n\t\t\t\t                    required=\"true\">\n\t\t\t                    <label class=\"error-message\" v-if=\"passwordMatchError\">Passwords do not match.</label>\n\t\t\t                    <label class=\"error-message\" v-if=\"passwordLengthError\">Password must be at least 6 characters in length.</label>\n\t\t\t\t            </div>\n\n\t\t\t\t            <div class=\"form-group-row\" v-if=\"isOpen\">\n\t\t\t\t\t            <div class=\"form-group\">\n\t                                <multiselect \n\t                                \tv-model=\"selectedGroups\"\n\t                                \t:options=\"groups\"\n\t                                \ttag-placeholder=\"Add as new group\" \n\t                                \tplaceholder=\"Groups\" \n\t                                \t:multiple=\"true\" \n\t                                \t:taggable=\"true\" \n\t                                \t@tag=\"addGroup\"></multiselect>\n\t                            </div>\n\t\t\t\t\t            <div class=\"form-group\">\n\t                                <multiselect \n\t                                \tv-model=\"selectedPermissions\" \n\t                                \t:options=\"permissions\"\n\t                                \ttag-placeholder=\"Add as new permission\"\n\t                                \tplaceholder=\"Permissions\" \n\t                                \t:multiple=\"true\" \n\t                                \t:taggable=\"true\" \n\t                                \t@tag=\"addPermission\"></multiselect>\n\t                            </div>\n                            </div>\n                        </form>\n                    </main>\n                    <footer class=\"footer\">\n                        <button v-on:click=\"onCancelClick\" class=\"btn btn-link\">Cancel</button>\n                        <button v-on:click=\"onSaveClick\" class=\"btn btn-primary\">Save</button>\n                    </footer>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>\n\n<script>\n\timport Multiselect from 'vue-multiselect'\n    export default {\n        name: 'UserEditModal',\n        props: {\n            openModal: Boolean, // Requested modal state\n            onClose: Function,\n            userToEdit: Object\n        },\n        data: () => {\n            return {\n                user: {},\n                password: '', // Password change model\n                passwordConfirm: '',\n                passwordMatchError: false,\n                passwordLengthError: false,\n                groups: ['Administrator', 'Editor', 'User'],\n                selectedGroups: [], // Groups tag component model\n                permissions: ['Read', 'Write', 'Edit', 'Delete'],\n                selectedPermissions: [], // Permissions tag component model\n                isOpen: false // Actual modal state\n            }\n        },\n        watch: {\n            openModal: function (val) {\n            \tif (val === this.isOpen) {\n            \t\t// Already in requested state\n            \t\treturn\n            \t}\n                if (val) {\n                \tthis.selectedGroups.length = 0\n                \tthis.selectedPermissions.length = 0\n                \tif (this.userToEdit.id) {\n                \t\tlet userCopy = Object.assign({}, this.userToEdit)\n\t\t        \t\tlet {groups, permissions, ...user} = userCopy\n\t\t        \t\tObject.assign(this.user, user)\n\t\t        \t\tthis.selectedGroups.push(...groups)\n\t\t        \t\tthis.selectedPermissions.push(...permissions)\n\t\t        \t\tconsole.debug('Adding groups', this.selectedGroups)\n\t\t        \t}\n                    this.open()\n                } else {\n                    this.close()\n                }\n            },\n            password: function (val) {\n            \tthis.checkPasswords()\n            },\n            passwordConfirm: function (val) {\n            \tthis.checkPasswords()\n            }\n        },\n        methods: {\n            onCancelClick () {\n                this.close()\n            },\n            onSaveClick () {\n            \tconsole.debug('saving groups', this.selectedGroups)\n            \tObject.assign(this.userToEdit, this.user)\n            \tthis.userToEdit.groups.length = 0\n            \tthis.userToEdit.permissions.length = 0\n            \tthis.userToEdit.groups.push(...this.selectedGroups)\n            \tthis.userToEdit.permissions.push(...this.selectedPermissions)\n                let requestBody = Object.assign({}, this.userToEdit)\n\n                // TODO - if (user.id) edit : save\n                // fetch(`${this.server}/user`, {\n                //     method: 'PUT',\n                //     headers: {\n                //         'Content-Type': 'application/json'\n                //     },\n                //     body: requestBody\n                // })\n                // .then(response => {\n                //     if (response.ok) {\n                //         // Success\n                //         let event = new Event('user-created.ft', {user: response.detail})\n                //         document.dispatchEvent(event)\n                //         this.close()\n                //     } else {\n                //         response.json().then(json => {\n                //             json.detail.forEach(error => {\n                //                 error.loc.forEach(loc => {\n                //                     if (this.$refs[loc]) {\n                //                         this.$refs[loc].classList.add('error')\n                //                     }\n                //                 })\n                //             })\n                //         })\n                //     }\n                // })\n                // .catch(response => {\n                //     console.debug('Error creating user or parsing response', response)\n                // })\n\n                // Temp, dev code until API is ready\n                let event;\n                if (this.user.id) {\n                \tevent = new CustomEvent('user-edited.ft', {detail: {user: Object.assign({id:3}, this.userToEdit)}})\n                } else {\n                \tevent = new CustomEvent('user-created.ft', {detail: {user: Object.assign({id:3}, this.userToEdit)}})\n                }\n                document.dispatchEvent(event)\n                this.close()\n            },\n            addGroup (newGroup) {\n      \t\t\tthis.user.groups.push(newGroup)\n      \t\t\tthis.groups.push(newGroup)\n\t\t\t},\n\t\t\taddPermission (newPermission) {\n      \t\t\tthis.user.permissions.push(newPermission)\n      \t\t\tthis.permissions.push(newPermission)\n\t\t\t},\n\t\t\tcheckPasswords () {\n\t\t\t\tthis.$refs.password.classList.remove('error')\n\t\t\t\tthis.$refs.passwordConfirm.classList.remove('error')\n\t\t\t\tthis.passwordLengthError = false\n\t\t\t\tthis.passwordMatchError = false\n\t\t\t\tif (this.password.length && this.passwordConfirm.length) {\n\t\t\t\t\tif (this.password.length < 6) {\n\t\t\t\t\t\tthis.$refs.password.classList.add('error')\n\t\t\t\t\t\tthis.passwordLengthError = true\n\t\t\t\t\t}\n\t\t\t\t\tif (this.passwordConfirm.length < 6) {\n\t\t\t\t\t\tthis.$refs.passwordConfirm.classList.add('error')\n\t\t\t\t\t}\n\t\t\t\t\tif (this.passwordConfirm !== this.password) {\n\t\t\t\t\t\tthis.$refs.passwordConfirm.classList.add('error')\n\t\t\t\t\t\tthis.passwordMatchError = true\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t},\n            open () {\n            \tconsole.debug('Opening modal')\n                document.body.appendChild(this.$refs.modalWrapper)\n                this.isOpen = true\n            },\n            close () {\n                this.$refs.modalTemplate.appendChild(this.$refs.modalWrapper)\n                this.isOpen = false\n                if (typeof this.onClose === 'function') {\n                \tthis.onClose()\n                }\n            }\n        },\n        components: {\n        \tMultiselect\n        }\n    }\n</script>\n\n<style src=\"vue-multiselect/dist/vue-multiselect.min.css\"></style>\n<style lang=\"scss\">\n    \n    .modal__wrapper {\n        position: fixed;\n        top: 0;\n        left: 0;\n        bottom: 0;\n        right: 0;\n        z-index: 999;\n\n        *, ::after, ::before {\n\t        box-sizing: border-box;\n\t    }\n\t    \n\t    .modal-backdrop {\n\t        width: 100%;\n\t        height: 100%;\n\t        background-color: rgba(0, 0, 0, .4);\n\t        pointer-events: none;\n\t        transition: all 0.3s;\n\t    }\n\t    .modal {\n\t        width: 600px;\n            height: auto;\n\t        position: absolute;\n\t        top: 20%;\n\t        left: 50%;\n\t        transform: translate(-50%, -20%);\n\t        background: #ffffff;\n\t        border-radius: 3px;\n\t        pointer-events: all;\n\t    }\n\t    .header {\n\t    \tpadding: 1rem;\n\t    \tborder-bottom: solid 1px #e3e3e3;\n\t    \th1 {\n\t    \t\tfont-size: 1.4rem;\n\t    \t}\n\t    }\n\t    .main {\n\t    \tpadding: 1rem;\n\t    \tbackground-color: #fffbfc;\n\t    }\n\t    .btn {\n\t        border-radius: 2px;\n\t        padding: .5rem 1rem;\n\t        line-height: 1.5rem;\n\t        font-size: 1rem;\n\t        font-weight: bold;\n\t        border: none;\n\t        color: #fff;\n\t    }\n\t    .btn-primary {\n\t        background: #fa225b;\n\t    }\n\t    .btn-link {\n\t        color: #fa225b;\n\t    }\n\t    .btn-block {\n\t        display: block;\n\t        width: 100%;\n\t    }\n\t    .btn:hover {\n\t        cursor: pointer;\n\t        box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n\t    }\n\t    .btn:focus {\n\t        outline: 0;\n\t    }\n\n\t   .form {\n\t        font-size: 13px;\n\t        position: relative;\n\t    }\n\t    .form-group {\n\t        margin-bottom: 1rem;\n\t    }\n\t    .form-control {\n\t        display: block;\n\t        width: 100%;\n\t        padding: .375rem .75rem;\n\t        font-size: 1rem;\n\t        line-height: 1.5;\n\t        border-radius: 2px;\n\t        min-height: 41px;\n\t        background: #fff;\n\t        border: 1px solid #e3e3e3;\n\t        box-shadow: none !important;\n\t    }\n\t    .form-control:focus {\n\t        outline: 0;\n\t    }\n\n\t    .password-confirm {\n\t    \tmargin-top: -2px;\n\t    \tborder-top-left-radius: 0px;\n\t    \tborder-top-right-radius: 0px;\n\t    }\n\t    .form-control.error, .form-control.vf-invalid {\n            border-color: #d9534f;\n            background: #fff0f4;\n        }\n        .error-message {\n        \tcolor: #d9534f;\n        \tfont-size: .8rem;\n        }\n\n\t    .multiselect__tags {\n\t    \tborder-radius: 2px;\n\t    }\n\n\t    .footer {\n\t        display: flex;\n\t        justify-content: flex-end;\n\t        border-top: solid 1px #e3e3e3;\n\t        padding: 1rem;\n\t        .btn {\n\t            margin-left: 1rem;\n\t        }\n\t    }\n    }\n</style>\n",".modal__wrapper {\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  z-index: 999;\n}\n.modal__wrapper *, .modal__wrapper ::after, .modal__wrapper ::before {\n  box-sizing: border-box;\n}\n.modal__wrapper .modal-backdrop {\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.4);\n  pointer-events: none;\n  transition: all 0.3s;\n}\n.modal__wrapper .modal {\n  width: 600px;\n  height: auto;\n  position: absolute;\n  top: 20%;\n  left: 50%;\n  transform: translate(-50%, -20%);\n  background: #ffffff;\n  border-radius: 3px;\n  pointer-events: all;\n}\n.modal__wrapper .header {\n  padding: 1rem;\n  border-bottom: solid 1px #e3e3e3;\n}\n.modal__wrapper .header h1 {\n  font-size: 1.4rem;\n}\n.modal__wrapper .main {\n  padding: 1rem;\n  background-color: #fffbfc;\n}\n.modal__wrapper .btn {\n  border-radius: 2px;\n  padding: 0.5rem 1rem;\n  line-height: 1.5rem;\n  font-size: 1rem;\n  font-weight: bold;\n  border: none;\n  color: #fff;\n}\n.modal__wrapper .btn-primary {\n  background: #fa225b;\n}\n.modal__wrapper .btn-link {\n  color: #fa225b;\n}\n.modal__wrapper .btn-block {\n  display: block;\n  width: 100%;\n}\n.modal__wrapper .btn:hover {\n  cursor: pointer;\n  box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n}\n.modal__wrapper .btn:focus {\n  outline: 0;\n}\n.modal__wrapper .form {\n  font-size: 13px;\n  position: relative;\n}\n.modal__wrapper .form-group {\n  margin-bottom: 1rem;\n}\n.modal__wrapper .form-control {\n  display: block;\n  width: 100%;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  border-radius: 2px;\n  min-height: 41px;\n  background: #fff;\n  border: 1px solid #e3e3e3;\n  box-shadow: none !important;\n}\n.modal__wrapper .form-control:focus {\n  outline: 0;\n}\n.modal__wrapper .password-confirm {\n  margin-top: -2px;\n  border-top-left-radius: 0px;\n  border-top-right-radius: 0px;\n}\n.modal__wrapper .form-control.error, .modal__wrapper .form-control.vf-invalid {\n  border-color: #d9534f;\n  background: #fff0f4;\n}\n.modal__wrapper .error-message {\n  color: #d9534f;\n  font-size: 0.8rem;\n}\n.modal__wrapper .multiselect__tags {\n  border-radius: 2px;\n}\n.modal__wrapper .footer {\n  display: flex;\n  justify-content: flex-end;\n  border-top: solid 1px #e3e3e3;\n  padding: 1rem;\n}\n.modal__wrapper .footer .btn {\n  margin-left: 1rem;\n}\n\n/*# sourceMappingURL=UserEditModal.vue.map */"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$4 = undefined;
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$4 = normalizeComponent(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  var script$5 = {
      name: 'UserAddButton',
      props: {
          server: String,
          buttonText: String
      },
      data: () => {
          return {
              user: {
                  groups: [],
                  permissions: []
              },
              openModal: false
          }
      },
      methods: {
          onAddUserClick () {
              this.openModal = true;
          },
          onModalClose () {
              console.debug('modal close callback');
              this.openModal = false;
          }
      },
      components: {UserEditModal: __vue_component__$4}
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "user-add-button__wrapper" },
      [
        _c(
          "button",
          {
            staticClass: "btn btn-block btn-primary",
            on: { click: _vm.onAddUserClick }
          },
          [_vm._v(_vm._s(_vm.buttonText || "Add User"))]
        ),
        _vm._v(" "),
        _c("user-edit-modal", {
          attrs: {
            "user-to-edit": _vm.user,
            "open-modal": _vm.openModal,
            "on-close": _vm.onModalClose
          }
        })
      ],
      1
    )
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    const __vue_inject_styles__$5 = function (inject) {
      if (!inject) return
      inject("data-v-770efacd_0", { source: ".user-add-button__wrapper[data-v-770efacd] {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #212529;\n}\n.user-add-button__wrapper *[data-v-770efacd], .user-add-button__wrapper[data-v-770efacd] ::after, .user-add-button__wrapper[data-v-770efacd] ::before {\n  box-sizing: border-box;\n}\n.user-add-button__wrapper .btn[data-v-770efacd] {\n  border-radius: 2px;\n  padding: 0.5rem 1rem;\n  line-height: 1.5rem;\n  font-size: 1rem;\n  font-weight: bold;\n  border: none;\n  margin-bottom: 20px;\n  color: #fff;\n}\n.user-add-button__wrapper .btn-primary[data-v-770efacd] {\n  background: #fa225b;\n}\n.user-add-button__wrapper .btn-link[data-v-770efacd] {\n  color: #fa225b;\n}\n.user-add-button__wrapper .btn-block[data-v-770efacd] {\n  display: block;\n  width: 100%;\n}\n.user-add-button__wrapper .btn[data-v-770efacd]:hover {\n  cursor: pointer;\n  box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n}\n.user-add-button__wrapper .btn[data-v-770efacd]:focus {\n  outline: 0;\n}\n\n/*# sourceMappingURL=UserAddButton.vue.map */", map: {"version":3,"sources":["/Users/dylan/dev/zuar/frontendtoolbox/src/elements/UserAddButton/UserAddButton.vue","UserAddButton.vue"],"names":[],"mappings":"AAuCA;EACA,iKAAA;EACA,mCAAA;EACA,kCAAA;EACA,kBAAA;EACA,cAAA;ACtCA;ADwCA;EACA,sBAAA;ACtCA;ADyCA;EACA,kBAAA;EACA,oBAAA;EACA,mBAAA;EACA,eAAA;EACA,iBAAA;EACA,YAAA;EACA,mBAAA;EACA,WAAA;ACvCA;ADyCA;EACA,mBAAA;ACvCA;ADyCA;EACA,cAAA;ACvCA;ADyCA;EACA,cAAA;EACA,WAAA;ACvCA;ADyCA;EACA,eAAA;EACA,+CAAA;ACvCA;ADyCA;EACA,UAAA;ACvCA;;AAEA,4CAA4C","file":"UserAddButton.vue","sourcesContent":["<template>\n    <div class=\"user-add-button__wrapper\">\n        <button class=\"btn btn-block btn-primary\" v-on:click=\"onAddUserClick\">{{buttonText || 'Add User'}}</button>\n        <user-edit-modal :user-to-edit=\"user\" :open-modal=\"openModal\" :on-close=\"onModalClose\"></user-edit-modal>\n    </div>\n</template>\n\n<script>\n    import UserEditModal from '../UserEditModal/UserEditModal.vue'\n    export default {\n        name: 'UserAddButton',\n        props: {\n            server: String,\n            buttonText: String\n        },\n        data: () => {\n            return {\n                user: {\n                    groups: [],\n                    permissions: []\n                },\n                openModal: false\n            }\n        },\n        methods: {\n            onAddUserClick () {\n                this.openModal = true\n            },\n            onModalClose () {\n                console.debug('modal close callback')\n                this.openModal = false\n            }\n        },\n        components: {UserEditModal}\n    }\n</script>\n\n<style scoped lang=\"scss\">\n    \n    .user-add-button__wrapper {\n        font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";\n        -webkit-font-smoothing: antialiased;\n        -moz-osx-font-smoothing: grayscale;\n        text-align: center;\n        color: #212529;\n\n        *, ::after, ::before {\n            box-sizing: border-box;\n        }\n\n        .btn {\n            border-radius: 2px;\n            padding: .5rem 1rem;\n            line-height: 1.5rem;\n            font-size: 1rem;\n            font-weight: bold;\n            border: none;\n            margin-bottom: 20px;\n            color: #fff;\n        }\n        .btn-primary {\n            background: #fa225b;\n        }\n        .btn-link {\n            color: #fa225b;\n        }\n        .btn-block {\n            display: block;\n            width: 100%;\n        }\n        .btn:hover {\n            cursor: pointer;\n            box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n        }\n        .btn:focus {\n            outline: 0;\n        }\n    }\n</style>\n",".user-add-button__wrapper {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #212529;\n}\n.user-add-button__wrapper *, .user-add-button__wrapper ::after, .user-add-button__wrapper ::before {\n  box-sizing: border-box;\n}\n.user-add-button__wrapper .btn {\n  border-radius: 2px;\n  padding: 0.5rem 1rem;\n  line-height: 1.5rem;\n  font-size: 1rem;\n  font-weight: bold;\n  border: none;\n  margin-bottom: 20px;\n  color: #fff;\n}\n.user-add-button__wrapper .btn-primary {\n  background: #fa225b;\n}\n.user-add-button__wrapper .btn-link {\n  color: #fa225b;\n}\n.user-add-button__wrapper .btn-block {\n  display: block;\n  width: 100%;\n}\n.user-add-button__wrapper .btn:hover {\n  cursor: pointer;\n  box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n}\n.user-add-button__wrapper .btn:focus {\n  outline: 0;\n}\n\n/*# sourceMappingURL=UserAddButton.vue.map */"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$5 = "data-v-770efacd";
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$5 = normalizeComponent(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  var script$6 = {
      name: 'UserList',
      props: {
          server: String
      },
      data: () => {
          return {
              users: [],
              openModal: false,
              userToEdit: {}
          }
      },
      created () {
          setTimeout(() => {
              this.users = [
                  {
                      id: 1,
                      name: 'Matt Laue',
                      email: 'matt@zuar.com',
                      groups: ['Administrator'],
                      permissions: ['Read', 'Write', 'Edit', 'Delete']
                  },
                  {
                      id: 2,
                      name: 'Dylan Spurgin',
                      email: 'dylan@dylanspurgin.com',
                      groups: ['Editor'],
                      permissions: ['Read', 'Write', 'Edit']
                  }
              ];
          }, 300);
          // fetch(`${this.server}/api/users`)
          //     .then(response => {
          //         console.debug('users', response)
          //     })

          document.addEventListener('user-created.ft', (e, p) => {
              console.debug('user-created.ft', e);
              this.users.push(e.detail.user);
          });

          document.addEventListener('user-edited.ft', (e, p) => {
              console.debug('user-edited.ft', e);
              Object.assign(this.users.find(user => user.id === e.detail.user.id), e.detail.user);
          });
      },
      methods: {
          onEditClick (user) {
              console.debug('edit click', user);
              this.userToEdit = user;
              this.openModal = true;
          },
          onModalClose () {
              this.openModal = false;
          }
      },
      components: {UserEditModal: __vue_component__$4}
  };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$6 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "user-list__wrapper" },
      [
        _c("table", { staticClass: "table" }, [
          _vm._m(0),
          _vm._v(" "),
          _c(
            "tbody",
            _vm._l(_vm.users, function(user) {
              return _c("tr", [
                _c("th", [_vm._v(_vm._s(user.id))]),
                _vm._v(" "),
                _c("td", [_vm._v(_vm._s(user.email))]),
                _vm._v(" "),
                _c("td", [_vm._v(_vm._s(user.name))]),
                _vm._v(" "),
                _c("td", [_vm._v(_vm._s(user.groups.join(", ")))]),
                _vm._v(" "),
                _c("td", { staticClass: "permissions" }, [
                  _vm._v(_vm._s(user.permissions.join(", ")))
                ]),
                _vm._v(" "),
                _c("td", [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-secondary btn-small",
                      on: {
                        click: function($event) {
                          return _vm.onEditClick(user)
                        }
                      }
                    },
                    [_vm._v("Edit")]
                  ),
                  _vm._v(" "),
                  _c("button", { staticClass: "btn btn-secondary btn-small" }, [
                    _vm._v("Delete")
                  ])
                ])
              ])
            }),
            0
          )
        ]),
        _vm._v(" "),
        _c("user-edit-modal", {
          attrs: {
            "user-to-edit": _vm.userToEdit,
            "open-modal": _vm.openModal,
            "on-close": _vm.onModalClose
          }
        })
      ],
      1
    )
  };
  var __vue_staticRenderFns__$6 = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("thead", [
        _c("tr", [
          _c("th", [_vm._v("ID")]),
          _vm._v(" "),
          _c("th", [_vm._v("Email")]),
          _vm._v(" "),
          _c("th", [_vm._v("Name")]),
          _vm._v(" "),
          _c("th", [_vm._v("Groups")]),
          _vm._v(" "),
          _c("th", [_vm._v("Permissions")]),
          _vm._v(" "),
          _c("th", [_vm._v("Actions")])
        ])
      ])
    }
  ];
  __vue_render__$6._withStripped = true;

    /* style */
    const __vue_inject_styles__$6 = function (inject) {
      if (!inject) return
      inject("data-v-549238e4_0", { source: ".user-list__wrapper {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #212529;\n}\n.user-list__wrapper *, .user-list__wrapper ::after, .user-list__wrapper ::before {\n  box-sizing: border-box;\n}\n.user-list__wrapper .table {\n  width: 100%;\n  max-width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n}\n.user-list__wrapper .table thead th {\n  vertical-align: bottom;\n  border-bottom: 2px solid #dee2e6;\n  padding: 0.75rem;\n  border-top: 1px solid #dee2e6;\n}\n.user-list__wrapper .table th, .user-list__wrapper .table td {\n  padding: 0.75rem;\n  vertical-align: top;\n  border-top: 1px solid #dee2e6;\n}\n.user-list__wrapper .permissions {\n  font-size: 0.8rem;\n  font-family: Consolas, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", Monaco, \"Courier New\", Courier, monospace;\n}\n.user-list__wrapper .btn {\n  border-radius: 2px;\n  padding: 0.5rem 1rem;\n  line-height: 1.5rem;\n  font-size: 1rem;\n  font-weight: bold;\n  border: none;\n  margin-bottom: 20px;\n  color: #fff;\n}\n.user-list__wrapper .btn-small {\n  margin-bottom: 0px;\n  padding: 0.1rem 0.3rem;\n  line-height: 0.8rem;\n  font-size: 0.8rem;\n  font-weight: normal;\n}\n.user-list__wrapper .btn-secondary {\n  background: transparent;\n  border: solid 1px #fa225b;\n  color: #fa225b;\n}\n.user-list__wrapper .btn.btn-secondary:hover {\n  box-shadow: 0 0 4px 1px rgba(250, 34, 91, 0.1);\n}\n.user-list__wrapper .btn:hover {\n  cursor: pointer;\n  box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n}\n.user-list__wrapper .btn:focus {\n  outline: 0;\n}\n\n/*# sourceMappingURL=UserList.vue.map */", map: {"version":3,"sources":["/Users/dylan/dev/zuar/frontendtoolbox/src/elements/UserList/UserList.vue","UserList.vue"],"names":[],"mappings":"AAmGA;EACA,iKAAA;EACA,mCAAA;EACA,kCAAA;EACA,kBAAA;EACA,cAAA;AClGA;ADoGA;EACA,sBAAA;AClGA;ADqGA;EACA,WAAA;EACA,eAAA;EACA,yBAAA;EACA,gBAAA;ACnGA;ADqGA;EACA,sBAAA;EACA,gCAAA;EACA,gBAAA;EACA,6BAAA;ACnGA;ADqGA;EACA,gBAAA;EACA,mBAAA;EACA,6BAAA;ACnGA;ADqGA;EACA,iBAAA;EACA,iOAAA;ACnGA;ADsGA;EACA,kBAAA;EACA,oBAAA;EACA,mBAAA;EACA,eAAA;EACA,iBAAA;EACA,YAAA;EACA,mBAAA;EACA,WAAA;ACpGA;ADsGA;EACA,kBAAA;EACA,sBAAA;EACA,mBAAA;EACA,iBAAA;EACA,mBAAA;ACpGA;ADsGA;EACA,uBAAA;EACA,yBAAA;EACA,cAAA;ACpGA;ADsGA;EACA,8CAAA;ACpGA;ADsGA;EACA,eAAA;EACA,+CAAA;ACpGA;ADsGA;EACA,UAAA;ACpGA;;AAEA,uCAAuC","file":"UserList.vue","sourcesContent":["<template>\n    <div class=\"user-list__wrapper\">\n        <table class=\"table\">\n            <thead>\n                <tr>\n                    <th>ID</th>\n                    <th>Email</th>\n                    <th>Name</th>\n                    <th>Groups</th>\n                    <th>Permissions</th>\n                    <th>Actions</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr v-for=\"user in users\">\n                    <th>{{user.id}}</th>\n                    <td>{{user.email}}</td>\n                    <td>{{user.name}}</td>\n                    <td>{{user.groups.join(', ')}}</td>\n                    <td class=\"permissions\">{{user.permissions.join(', ')}}</td>\n                    <td>\n                        <button class=\"btn btn-secondary btn-small\" v-on:click=\"onEditClick(user)\">Edit</button>\n                        <button class=\"btn btn-secondary btn-small\">Delete</button>\n                    </td>\n                </tr>\n          </tbody>\n        </table>\n        <user-edit-modal \n            :user-to-edit=\"userToEdit\" \n            :open-modal=\"openModal\" \n            :on-close=\"onModalClose\">\n        </user-edit-modal>\n    </div>\n</template>\n\n<script>\n    import UserEditModal from '../UserEditModal/UserEditModal.vue'\n    export default {\n        name: 'UserList',\n        props: {\n            server: String\n        },\n        data: () => {\n            return {\n                users: [],\n                openModal: false,\n                userToEdit: {}\n            }\n        },\n        created () {\n            setTimeout(() => {\n                this.users = [\n                    {\n                        id: 1,\n                        name: 'Matt Laue',\n                        email: 'matt@zuar.com',\n                        groups: ['Administrator'],\n                        permissions: ['Read', 'Write', 'Edit', 'Delete']\n                    },\n                    {\n                        id: 2,\n                        name: 'Dylan Spurgin',\n                        email: 'dylan@dylanspurgin.com',\n                        groups: ['Editor'],\n                        permissions: ['Read', 'Write', 'Edit']\n                    }\n                ]\n            }, 300)\n            // fetch(`${this.server}/api/users`)\n            //     .then(response => {\n            //         console.debug('users', response)\n            //     })\n\n            document.addEventListener('user-created.ft', (e, p) => {\n                console.debug('user-created.ft', e)\n                this.users.push(e.detail.user)\n            })\n\n            document.addEventListener('user-edited.ft', (e, p) => {\n                console.debug('user-edited.ft', e)\n                Object.assign(this.users.find(user => user.id === e.detail.user.id), e.detail.user)\n            })\n        },\n        methods: {\n            onEditClick (user) {\n                console.debug('edit click', user)\n                this.userToEdit = user\n                this.openModal = true\n            },\n            onModalClose () {\n                this.openModal = false\n            }\n        },\n        components: {UserEditModal}\n    }\n</script>\n\n<style lang=\"scss\">\n    \n    .user-list__wrapper {\n        font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";\n        -webkit-font-smoothing: antialiased;\n        -moz-osx-font-smoothing: grayscale;\n        text-align: center;\n        color: #212529;\n\n        *, ::after, ::before {\n            box-sizing: border-box;\n        }\n        \n        .table {\n            width: 100%;\n            max-width: 100%;\n            border-collapse: collapse;\n            text-align: left;\n        }\n        .table thead th {\n            vertical-align: bottom;\n            border-bottom: 2px solid #dee2e6;\n            padding: .75rem;\n            border-top: 1px solid #dee2e6;\n        }\n        .table th, .table td {\n            padding: .75rem;\n            vertical-align: top;\n            border-top: 1px solid #dee2e6;\n        }\n        .permissions {\n            font-size: .8rem;\n            font-family: Consolas, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", Monaco, \"Courier New\", Courier, monospace;\n        }\n\n        .btn {\n            border-radius: 2px;\n            padding: .5rem 1rem;\n            line-height: 1.5rem;\n            font-size: 1rem;\n            font-weight: bold;\n            border: none;\n            margin-bottom: 20px;\n            color: #fff;\n        }\n        .btn-small {\n            margin-bottom: 0px;\n            padding: .1rem .3rem;\n            line-height: .8rem;\n            font-size: .8rem;\n            font-weight: normal;\n        }\n        .btn-secondary {\n            background: transparent;\n            border: solid 1px #fa225b;\n            color: #fa225b;\n        }\n        .btn.btn-secondary:hover {\n            box-shadow: 0 0 4px 1px rgba(250, 34, 91, 0.1);\n        }\n        .btn:hover {\n            cursor: pointer;\n            box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n        }\n        .btn:focus {\n            outline: 0;\n        }\n    }\n</style>\n",".user-list__wrapper {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #212529;\n}\n.user-list__wrapper *, .user-list__wrapper ::after, .user-list__wrapper ::before {\n  box-sizing: border-box;\n}\n.user-list__wrapper .table {\n  width: 100%;\n  max-width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n}\n.user-list__wrapper .table thead th {\n  vertical-align: bottom;\n  border-bottom: 2px solid #dee2e6;\n  padding: 0.75rem;\n  border-top: 1px solid #dee2e6;\n}\n.user-list__wrapper .table th, .user-list__wrapper .table td {\n  padding: 0.75rem;\n  vertical-align: top;\n  border-top: 1px solid #dee2e6;\n}\n.user-list__wrapper .permissions {\n  font-size: 0.8rem;\n  font-family: Consolas, \"Andale Mono WT\", \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", \"DejaVu Sans Mono\", \"Bitstream Vera Sans Mono\", \"Liberation Mono\", \"Nimbus Mono L\", Monaco, \"Courier New\", Courier, monospace;\n}\n.user-list__wrapper .btn {\n  border-radius: 2px;\n  padding: 0.5rem 1rem;\n  line-height: 1.5rem;\n  font-size: 1rem;\n  font-weight: bold;\n  border: none;\n  margin-bottom: 20px;\n  color: #fff;\n}\n.user-list__wrapper .btn-small {\n  margin-bottom: 0px;\n  padding: 0.1rem 0.3rem;\n  line-height: 0.8rem;\n  font-size: 0.8rem;\n  font-weight: normal;\n}\n.user-list__wrapper .btn-secondary {\n  background: transparent;\n  border: solid 1px #fa225b;\n  color: #fa225b;\n}\n.user-list__wrapper .btn.btn-secondary:hover {\n  box-shadow: 0 0 4px 1px rgba(250, 34, 91, 0.1);\n}\n.user-list__wrapper .btn:hover {\n  cursor: pointer;\n  box-shadow: 0 0 10px 4px rgba(250, 34, 91, 0.1);\n}\n.user-list__wrapper .btn:focus {\n  outline: 0;\n}\n\n/*# sourceMappingURL=UserList.vue.map */"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$6 = undefined;
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$6 = normalizeComponent(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      false,
      createInjector,
      undefined,
      undefined
    );

  Vue.use(vueCustomElement);
  Vue.customElement('login-form', __vue_component__);
  Vue.customElement('sign-up-form', __vue_component__$1);
  Vue.customElement('subscribe-modal', __vue_component__$2);
  Vue.customElement('subscription-list', __vue_component__$3);
  Vue.customElement('user-add-button', __vue_component__$5);
  Vue.customElement('user-edit-modal', __vue_component__$4);
  Vue.customElement('user-list', __vue_component__$6);

}());
