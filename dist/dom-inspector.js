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
__$styleInject(".dom-inspector {\n    position: fixed;\n    pointer-events: none;\n}\n\n.dom-inspector>div {\n\tposition: absolute;\n}\n\n.dom-inspector .tips {\n\tbackground-color: #333740;\n\tfont-size: 0;\n\tline-height: 18px;\n\tpadding: 3px 10px;\n\tposition: fixed;\n\tborder-radius: 4px;\n\tdisplay: none;\n}\n\n.dom-inspector .tips.reverse{\n\n}\n\n.dom-inspector .tips .triangle {\n\twidth: 0;\n\theight: 0;\n\tposition: absolute;\n\tborder-top: 8px solid #333740;\n\tborder-right: 8px solid transparent;\n\tborder-bottom: 8px solid transparent;\n\tborder-left: 8px solid transparent;\n\tleft: 10px;\n\ttop: 24px;\n}\n\n.dom-inspector .tips.reverse .triangle {\n\tborder-top: 8px solid transparent;\n\tborder-right: 8px solid transparent;\n\tborder-bottom: 8px solid #333740;\n\tborder-left: 8px solid transparent;\n\tleft: 10px;\n\ttop: -16px;\n}\n\n.dom-inspector .tips>div {\n\tdisplay: inline-block;\n\tvertical-align: middle;\n\tfont-size: 12px;\n\tfont-family: Consolas, Menlo, Monaco, Courier, monospace;\n\toverflow: auto;\n}\n\n.dom-inspector .tips .tag {\n\tcolor: #e776e0;\n}\n\n.dom-inspector .tips .id {\n\tcolor: #eba062;\n}\n\n.dom-inspector .tips .class {\n\tcolor: #8dd2fb;\n}\n\n.dom-inspector .tips .line {\n\tcolor: #fff;\n}\n\n.dom-inspector .tips .size {\n\tcolor: #fff;\n}\n\n.dom-inspector-theme-default {\n\n}\n\n.dom-inspector-theme-default .margin {\n\tbackground-color: rgba(255, 81, 81, 0.75);\n}\n\n.dom-inspector-theme-default .border {\n\tbackground-color: rgba(255, 241, 81, 0.75);\n}\n\n.dom-inspector-theme-default .padding {\n\tbackground-color: rgba(81, 255, 126, 0.75);\n}\n\n.dom-inspector-theme-default .content {\n\tbackground-color: rgba(81, 101, 255, 0.75);\n}\n", undefined);

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















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

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

function $(selector, parent) {
	if (!parent) return document.documentElement.querySelector(selector);
	if (isDOM(parent)) return parent.querySelector(selector);
	return document.documentElement.querySelector(selector);
}

function addRule(selector, cssObj) {
	Object.keys(cssObj).forEach(function (item) {
		selector.style[item] = cssObj[item];
	});
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
		this.overlay = {};
		this.overlayId = '';
		this.target = '';
		this.destroyed = false;
		this._cachedTarget = '';
		this._throttleOnMove = throttle(this._onMove.bind(this), 100);
		this._init();
	}

	createClass(DomInspector, [{
		key: 'enable',
		value: function enable() {
			if (this.destroyed) return logger.warn('Inspector instance has been destroyed! Please redeclare it.');
			this.overlay.parent.style.display = 'block';
			this.root.addEventListener('mousemove', this._throttleOnMove);
		}
	}, {
		key: 'disable',
		value: function disable() {
			this.overlay.parent.style.display = 'none';
			this.overlay.parent.style.width = 0;
			this.overlay.parent.style.height = 0;
			this.target = null;
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

			var parent = this._createElement('div', {
				id: this.overlayId,
				class: 'dom-inspector ' + this.theme
			});

			this.overlay = {
				parent: parent,
				content: this._createSurroundEle(parent, 'content'),
				paddingTop: this._createSurroundEle(parent, 'padding padding-top'),
				paddingRight: this._createSurroundEle(parent, 'padding padding-right'),
				paddingBottom: this._createSurroundEle(parent, 'padding padding-bottom'),
				paddingLeft: this._createSurroundEle(parent, 'padding padding-left'),
				borderTop: this._createSurroundEle(parent, 'border border-top'),
				borderRight: this._createSurroundEle(parent, 'border border-right'),
				borderBottom: this._createSurroundEle(parent, 'border border-bottom'),
				borderLeft: this._createSurroundEle(parent, 'border border-left'),
				marginTop: this._createSurroundEle(parent, 'margin margin-top'),
				marginRight: this._createSurroundEle(parent, 'margin margin-right'),
				marginBottom: this._createSurroundEle(parent, 'margin margin-bottom'),
				marginLeft: this._createSurroundEle(parent, 'margin margin-left'),
				tips: this._createSurroundEle(parent, 'tips', '<div class="tag"></div><div class="id"></div><div class="class"></div><div class="line">&nbsp;|&nbsp;</div><div class="size"></div><div class="triangle"></div>')
			};

			$('body').appendChild(parent);
		}
	}, {
		key: '_createElement',
		value: function _createElement(tag, attr, content) {
			var ele = this._doc.createElement(tag);
			Object.keys(attr).forEach(function (item) {
				ele.setAttribute(item, attr[item]);
			});
			if (content) ele.innerHTML = content;
			return ele;
		}
	}, {
		key: '_createSurroundEle',
		value: function _createSurroundEle(parent, className, content) {
			var ele = this._createElement('div', {
				class: className
			}, content);
			parent.appendChild(ele);
			return ele;
		}
	}, {
		key: '_onMove',
		value: function _onMove(e) {
			this.target = e.target;
			if (this.target === this._cachedTarget) return null;
			this._cachedTarget = this.target;
			var elementInfo = getElementInfo(e.target);
			var contentLevel = {
				width: elementInfo.width,
				height: elementInfo.height
			};
			var paddingLevel = {
				width: elementInfo['padding-left'] + contentLevel.width + elementInfo['padding-right'],
				height: elementInfo['padding-top'] + contentLevel.height + elementInfo['padding-bottom']
			};
			var borderLevel = {
				width: elementInfo['border-left-width'] + paddingLevel.width + elementInfo['border-right-width'],
				height: elementInfo['border-top-width'] + paddingLevel.height + elementInfo['border-bottom-width']
			};
			var marginLevel = {
				width: elementInfo['margin-left'] + borderLevel.width + elementInfo['margin-right'],
				height: elementInfo['margin-top'] + borderLevel.height + elementInfo['margin-bottom']
			};

			// 保证 overlay 最大 z-index
			if (this.overlay.parent.style['z-index'] <= elementInfo['z-index']) this.overlay.parent.style['z-index'] = elementInfo['z-index'] + 1;

			// so crazy
			addRule(this.overlay.parent, { width: marginLevel.width + 'px', height: marginLevel.height + 'px', top: elementInfo.top + 'px', left: elementInfo.left + 'px' });
			addRule(this.overlay.content, { width: contentLevel.width + 'px', height: contentLevel.height + 'px', top: elementInfo['margin-top'] + elementInfo['border-top-width'] + elementInfo['padding-top'] + 'px', left: elementInfo['margin-left'] + elementInfo['border-left-width'] + elementInfo['padding-left'] + 'px' });
			addRule(this.overlay.paddingTop, { width: paddingLevel.width + 'px', height: elementInfo['padding-top'] + 'px', top: elementInfo['margin-top'] + elementInfo['border-top-width'] + 'px', left: elementInfo['margin-left'] + elementInfo['border-left-width'] + 'px' });
			addRule(this.overlay.paddingRight, { width: elementInfo['padding-right'] + 'px', height: paddingLevel.height - elementInfo['padding-top'] + 'px', top: elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width'] + 'px', right: elementInfo['margin-right'] + elementInfo['border-right-width'] + 'px' });
			addRule(this.overlay.paddingBottom, { width: paddingLevel.width - elementInfo['padding-right'] + 'px', height: elementInfo['padding-bottom'] + 'px', bottom: elementInfo['margin-bottom'] + elementInfo['border-bottom-width'] + 'px', right: elementInfo['padding-right'] + elementInfo['margin-right'] + elementInfo['border-right-width'] + 'px' });
			addRule(this.overlay.paddingLeft, { width: elementInfo['padding-left'] + 'px', height: paddingLevel.height - elementInfo['padding-top'] - elementInfo['padding-bottom'] + 'px', top: elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width'] + 'px', left: elementInfo['margin-left'] + elementInfo['border-left-width'] + 'px' });
			addRule(this.overlay.borderTop, { width: borderLevel.width + 'px', height: elementInfo['border-top-width'] + 'px', top: elementInfo['margin-top'] + 'px', left: elementInfo['margin-left'] + 'px' });
			addRule(this.overlay.borderRight, { width: elementInfo['border-right-width'] + 'px', height: borderLevel.height - elementInfo['border-top-width'] + 'px', top: elementInfo['margin-top'] + elementInfo['border-top-width'] + 'px', right: elementInfo['margin-right'] + 'px' });
			addRule(this.overlay.borderBottom, { width: borderLevel.width - elementInfo['border-right-width'] + 'px', height: elementInfo['border-bottom-width'] + 'px', bottom: elementInfo['margin-bottom'] + 'px', right: elementInfo['margin-right'] + elementInfo['border-right-width'] + 'px' });
			addRule(this.overlay.borderLeft, { width: elementInfo['border-left-width'] + 'px', height: borderLevel.height - elementInfo['border-top-width'] - elementInfo['border-bottom-width'] + 'px', top: elementInfo['margin-top'] + elementInfo['border-top-width'] + 'px', left: elementInfo['margin-left'] + 'px' });
			addRule(this.overlay.marginTop, { width: marginLevel.width + 'px', height: elementInfo['margin-top'] + 'px', top: 0, left: 0 });
			addRule(this.overlay.marginRight, { width: elementInfo['margin-right'] + 'px', height: marginLevel.height - elementInfo['margin-top'] + 'px', top: elementInfo['margin-top'] + 'px', right: 0 });
			addRule(this.overlay.marginBottom, { width: marginLevel.width - elementInfo['margin-right'] + 'px', height: elementInfo['margin-bottom'] + 'px', bottom: 0, right: elementInfo['margin-right'] + 'px' });
			addRule(this.overlay.marginLeft, { width: elementInfo['margin-left'] + 'px', height: marginLevel.height - elementInfo['margin-top'] - elementInfo['margin-bottom'] + 'px', top: elementInfo['margin-top'] + 'px', left: 0 });

			$('.tag', this.overlay.tips).innerHTML = this.target.tagName.toLowerCase();
			$('.id', this.overlay.tips).innerHTML = this.target.id ? '#' + this.target.id : '';
			$('.class', this.overlay.tips).innerHTML = [].concat(toConsumableArray(this.target.classList)).map(function (item) {
				return '.' + item;
			}).join('');
			$('.size', this.overlay.tips).innerHTML = marginLevel.width + 'x' + marginLevel.height;

			var tipsTop = 0;
			if (elementInfo.top >= 24 + 8) {
				this.overlay.tips.classList.remove('reverse');
				tipsTop = elementInfo.top - 24 - 8;
			} else {
				this.overlay.tips.classList.add('reverse');
				tipsTop = marginLevel.height + elementInfo.top + 8;
			}
			addRule(this.overlay.tips, { top: tipsTop + 'px', left: elementInfo.left + 'px', display: 'block' });
		}
	}]);
	return DomInspector;
}();

return DomInspector;

})));
//# sourceMappingURL=dom-inspector.js.map
