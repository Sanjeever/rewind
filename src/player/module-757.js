Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var a = function () {
  function t(e, n) {
    babelHelpers.classCallCheck(this, t);
    this._data = e || [];
    this._keyExtractor = n;
    this._listeners = [];
    n || (this._keyExtractor = function (t, e) {
      return JSON.stringify(t) + '_' + e;
    });
  }
  babelHelpers.createClass(t, [{
    key: "push",
    value: function (t) {
      this._data.push(t);
      this._listeners.forEach(function (e) {
        e && e.onPush && e.onPush(t);
      });
    }
  }, {
    key: "unshift",
    value: function (t) {
      this._data.unshift(t);
      this._listeners.forEach(function (e) {
        e && e.onUnshift && e.onUnshift(t);
      });
    }
  }, {
    key: "splice",
    value: function (t, e) {
      for (var n, i = arguments.length, s = new Array(i > 2 ? i - 2 : 0), a = 2; a < i; a++) s[a - 2] = arguments[a];
      (n = this._data).splice.apply(n, [t, e].concat(s));
      this._listeners.forEach(function (n) {
        n && n.onSplice && n.onSplice.apply(n, [t, e].concat(s));
      });
    }
  }, {
    key: "size",
    value: function () {
      return this._data.length;
    }
  }, {
    key: "set",
    value: function (t, e) {
      this._data[t] = e;
      this._listeners.forEach(function (n) {
        n && n.onSplice && n.onSet(t, e);
      });
    }
  }, {
    key: "setDirty",
    value: function () {
      this._listeners.forEach(function (t) {
        t && t.onSetDirty && t.onSetDirty();
      });
    }
  }, {
    key: "get",
    value: function (t) {
      return this._data[t];
    }
  }, {
    key: "getKey",
    value: function (t, e) {
      return this._keyExtractor(t, e);
    }
  }, {
    key: "_addListener",
    value: function (t) {
      this._listeners.push(t);
    }
  }, {
    key: "_removeListener",
    value: function (t) {
      var e = this._listeners.indexOf(t);
      e > -1 && this._listeners.splice(e, 1);
    }
  }]);
  return t;
}();
exports.default = a;
