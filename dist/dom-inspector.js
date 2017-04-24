(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.DomInspector = factory());
}(this, (function () { 'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}
__$styleInject(".dom-inspector {\r\n    position: fixed;\r\n    border-style: solid;\r\n    pointer-events: none;\r\n}\r\n\r\n.dom-inspector-theme-default {\r\n    background-color: rgba(160, 210, 255, 0.75);\r\n    border-color: #ffefbd;\r\n}\r\n", undefined);

function mixin(target, source) {
	var targetCopy = target;
	Object.keys(source).forEach(function (item) {
		if ({}.hasOwnProperty.call(source, item)) {
			targetCopy[item] = source[item];
		}
	});
	return targetCopy;
}

function throttle(func) {
	var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

	var timeout = void 0;
	var elapsed = void 0;
	var lastRunTime = Date.now(); // 上次运行时间
	return function none() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var _this = this;

		clearTimeout(timeout);

		elapsed = Date.now() - lastRunTime;

		function later() {
			lastRunTime = Date.now();
			timeout = null;
			func.apply(_this, args);
		}

		if (elapsed > wait) {
			later();
		} else {
			timeout = setTimeout(later, wait - elapsed);
		}
	};
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

function $(slector) {
	return document.documentElement.querySelector(slector);
}

function isDOM() {
	var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	try {
		// 现代浏览器
		return obj instanceof HTMLElement;
	} catch (e) {
		// ie7+
		return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.nodeType === 1 && _typeof(obj.style) === 'object' && _typeof(obj.ownerDocument) === 'object';
	}
}

function findPos(ele) {
	var computedStyle = getComputedStyle(ele);
	var _x = ele.getBoundingClientRect().left - parseFloat(computedStyle['margin-left']);
	var _y = ele.getBoundingClientRect().top - parseFloat(computedStyle['margin-top']);
	var el = ele.parent;
	while (el) {
		computedStyle = getComputedStyle(el);
		_x += el.frameElement.getBoundingClientRect().left - parseFloat(computedStyle['margin-left']);
		_y += el.frameElement.getBoundingClientRect().top - parseFloat(computedStyle['margin-top']);
		el = el.parent;
	}
	return {
		top: _y,
		left: _x
	};
}

/**
 * @param  { Dom Element }
 * @return { Object }
 */
function getElementInfo(ele) {
	var result = {};
	var requiredValue = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'z-index'];

	var computedStyle = getComputedStyle(ele);
	requiredValue.forEach(function (item) {
		result[item] = parseFloat(computedStyle[item]) || 0;
	});

	mixin(result, {
		width: ele.offsetWidth - result['border-left-width'] - result['border-right-width'] - result['padding-left'] - result['padding-right'],
		height: ele.offsetHeight - result['border-top-width'] - result['border-bottom-width'] - result['padding-top'] - result['padding-bottom']
	});
	mixin(result, findPos(ele));
	return result;
}

var logger = {
	log: console.log,
	warn: console.warn,
	error: console.error
};

var DomInspector = function () {
	function DomInspector() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		classCallCheck(this, DomInspector);

		this._doc = window.document;
		this.root = options.root ? isDOM(options.root) ? options.root : $(options.root) : $('body');
		this.theme = options.theme || 'dom-inspector-theme-default';
		this.overlay = '';
		this.overlayId = '';
		this._throttleOnMove = throttle(this._onMove.bind(this), 100);
		this.destroyed = false;
		this._init();
	}

	createClass(DomInspector, [{
		key: 'enable',
		value: function enable() {
			if (this.destroyed) return logger.warn('Inspector instance has been destroyed! Please redeclare it.');
			this.overlay.style.display = 'block';
			this.root.addEventListener('mousemove', this._throttleOnMove);
		}
	}, {
		key: 'disable',
		value: function disable() {
			this.overlay.style.display = 'none';
			this.overlay.style.width = 0;
			this.overlay.style.height = 0;
			this.root.removeEventListener('mousemove', this._throttleOnMove);
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this.destroyed = true;
			this.disable();
			this.overlay.remove();
		}
	}, {
		key: 'getXPath',
		value: function getXPath(ele) {}
	}, {
		key: 'getCssPath',
		value: function getCssPath(ele) {}
	}, {
		key: 'getSelector',
		value: function getSelector(ele) {}
	}, {
		key: '_init',
		value: function _init() {
			this.overlayId = 'dom-inspector-' + Date.now();
			this.overlay = this._createElement('div', {
				id: this.overlayId,
				class: 'dom-inspector ' + this.theme
			});
			$('body').appendChild(this.overlay);
		}
	}, {
		key: '_createElement',
		value: function _createElement(tag, attr) {
			var ele = this._doc.createElement(tag);
			Object.keys(attr).forEach(function (item) {
				ele.setAttribute(item, attr[item]);
			});
			return ele;
		}
	}, {
		key: '_onMove',
		value: function _onMove(e) {
			var _this = this;

			this.target = e.target;
			var elementInfo = getElementInfo(e.target);
			// console.log(e.target, elementInfo);
			Object.keys(elementInfo).forEach(function (item) {
				if (item === 'z-index' && _this.overlay.style['z-index'] <= elementInfo[item]) {
					return _this.overlay.style[item] = elementInfo[item] + 1;
				}
				_this.overlay.style[item] = elementInfo[item] + 'px';
			});
		}
	}]);
	return DomInspector;
}();

return DomInspector;

})));
//# sourceMappingURL=dom-inspector.js.map
