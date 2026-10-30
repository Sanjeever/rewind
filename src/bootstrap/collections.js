var i;
i = function () {
  'use strict';

  function t(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
  }
  function n(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      r.enumerable = r.enumerable || false;
      r.configurable = true;
      "value" in r && (r.writable = true);
      Object.defineProperty(e, r.key, r);
    }
  }
  function r(e, t, r) {
    t && n(e.prototype, t);
    r && n(e, r);
    return e;
  }
  function o(e, t) {
    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
    e.prototype = Object.create(t && t.prototype, {
      constructor: {
        value: e,
        writable: true,
        configurable: true
      }
    });
    t && c(e, t);
  }
  function i(e) {
    return (i = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
      return e.__proto__ || Object.getPrototypeOf(e);
    })(e);
  }
  function c(e, t) {
    return (c = Object.setPrototypeOf || function (e, t) {
      e.__proto__ = t;
      return e;
    })(e, t);
  }
  function a() {
    if ("undefined" == typeof Reflect || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if ("function" == typeof Proxy) return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function l(e) {
    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e;
  }
  function u(e, t) {
    for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = i(e)););
    return e;
  }
  function f(e, t, n) {
    return (f = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (e, t, n) {
      var r = u(e, t);
      if (r) {
        var o = Object.getOwnPropertyDescriptor(r, t);
        return o.get ? o.get.call(n) : o.value;
      }
    })(e, t, n || e);
  }
  var s = function () {
      function e() {
        t(this, e);
        Object.defineProperty(this, 'listeners', {
          value: {},
          writable: true,
          configurable: true
        });
      }
      r(e, [{
        key: "addEventListener",
        value: function (e, t, n) {
          e in this.listeners || (this.listeners[e] = []);
          this.listeners[e].push({
            callback: t,
            options: n
          });
        }
      }, {
        key: "removeEventListener",
        value: function (e, t) {
          if (e in this.listeners) for (var n = this.listeners[e], r = 0, o = n.length; r < o; r++) if (n[r].callback === t) return void n.splice(r, 1);
        }
      }, {
        key: "dispatchEvent",
        value: function (e) {
          if (e.type in this.listeners) {
            for (var t = this.listeners[e.type].slice(), n = 0, r = t.length; n < r; n++) {
              var o = t[n];
              try {
                o.callback.call(this, e);
              } catch (e) {
                Promise.resolve().then(function () {
                  throw e;
                });
              }
              o.options && o.options.once && this.removeEventListener(e.type, o.callback);
            }
            return !e.defaultPrevented;
          }
        }
      }]);
      return e;
    }(),
    b = function (e) {
      o(b, s);
      var n,
        c,
        u = (n = b, c = a(), function () {
          var e,
            t,
            r = i(n);
          if (c) {
            var o = i(this).constructor;
            e = Reflect.construct(r, arguments, o);
          } else e = r.apply(this, arguments);
          return !(t = e) || "object" != typeof t && "function" != typeof t ? l(this) : t;
        });
      function b() {
        var e;
        t(this, b);
        (e = u.call(this)).listeners || s.call(l(e));
        Object.defineProperty(l(e), 'aborted', {
          value: false,
          writable: true,
          configurable: true
        });
        Object.defineProperty(l(e), 'onabort', {
          value: null,
          writable: true,
          configurable: true
        });
        return e;
      }
      r(b, [{
        key: "toString",
        value: function () {
          return '[object AbortSignal]';
        }
      }, {
        key: "dispatchEvent",
        value: function (e) {
          'abort' === e.type && (this.aborted = true, 'function' == typeof this.onabort && this.onabort.call(this, e));
          f(i(b.prototype), "dispatchEvent", this).call(this, e);
        }
      }]);
      return b;
    }(),
    p = function () {
      function e() {
        t(this, e);
        Object.defineProperty(this, 'signal', {
          value: new b(),
          writable: true,
          configurable: true
        });
      }
      r(e, [{
        key: "abort",
        value: function () {
          var e;
          try {
            e = new Event('abort');
          } catch (t) {
            'undefined' != typeof document ? document.createEvent ? (e = document.createEvent('Event')).initEvent('abort', false, false) : (e = document.createEventObject()).type = 'abort' : e = {
              type: 'abort',
              bubbles: false,
              cancelable: false
            };
          }
          this.signal.dispatchEvent(e);
        }
      }, {
        key: "toString",
        value: function () {
          return '[object AbortController]';
        }
      }]);
      return e;
    }();
  function y(e) {
    return !!e.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL || 'function' == typeof e.Request && !e.Request.prototype.hasOwnProperty('signal') || !e.AbortController;
  }
  function v(e) {
    'function' == typeof e && (e = {
      fetch: e
    });
    var t = e,
      n = t.fetch,
      r = t.Request,
      o = void 0 === r ? n.Request : r,
      i = t.AbortController,
      c = t.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL,
      a = void 0 !== c && c;
    if (!y({
      fetch: n,
      Request: o,
      AbortController: i,
      __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL: a
    })) return {
      fetch: n,
      Request: l
    };
    var l = o;
    (l && !l.prototype.hasOwnProperty('signal') || a) && ((l = function (e, t) {
      var n;
      t && t.signal && (n = t.signal, delete t.signal);
      var r = new o(e, t);
      n && Object.defineProperty(r, 'signal', {
        writable: false,
        enumerable: false,
        configurable: true,
        value: n
      });
      return r;
    }).prototype = o.prototype);
    var u = n;
    return {
      fetch: function (e, t) {
        var n = l && l.prototype.isPrototypeOf(e) ? e.signal : t ? t.signal : void 0;
        if (n) {
          var r;
          try {
            r = new DOMException('Aborted', 'AbortError');
          } catch (e) {
            (r = new Error('Aborted')).name = 'AbortError';
          }
          if (n.aborted) return Promise.reject(r);
          var o = new Promise(function (e, t) {
            n.addEventListener('abort', function () {
              return t(r);
            }, {
              once: true
            });
          });
          t && t.signal && delete t.signal;
          return Promise.race([o, u(e, t)]);
        }
        return u(e, t);
      },
      Request: l
    };
  }
  'undefined' == typeof Symbol || "function" == typeof Symbol && !Symbol.toStringTag || (p.prototype["function" == typeof Symbol ? Symbol.toStringTag : "@@toStringTag"] = 'AbortController', b.prototype["function" == typeof Symbol ? Symbol.toStringTag : "@@toStringTag"] = 'AbortSignal');
  (function (e) {
    if (y(e) && e.fetch) {
      var t = v(e),
        n = t.fetch,
        r = t.Request;
      e.fetch = n;
      e.Request = r;
      Object.defineProperty(e, 'AbortController', {
        writable: true,
        enumerable: false,
        configurable: true,
        value: p
      });
      Object.defineProperty(e, 'AbortSignal', {
        writable: true,
        enumerable: false,
        configurable: true,
        value: b
      });
    }
  })('undefined' != typeof self ? self : global);
};
'function' == typeof define && define.amd ? define(i) : i();
