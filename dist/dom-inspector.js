/*
 * DomInspector v1.0.0
 * (c) 2017 luoye <luoyefe@gmail.com>
 */
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
__$styleInject(".dom-inspector {\r\n    position: fixed;\r\n    pointer-events: none;\r\n}\r\n\r\n.dom-inspector>div {\r\n\tposition: absolute;\r\n}\r\n\r\n.dom-inspector .tips {\r\n\tbackground-color: #333740;\r\n\tfont-size: 0;\r\n\tline-height: 18px;\r\n\tpadding: 3px 10px;\r\n\tposition: fixed;\r\n\tborder-radius: 4px;\r\n\tdisplay: none;\r\n}\r\n\r\n.dom-inspector .tips.reverse{\r\n\r\n}\r\n\r\n.dom-inspector .tips .triangle {\r\n\twidth: 0;\r\n\theight: 0;\r\n\tposition: absolute;\r\n\tborder-top: 8px solid #333740;\r\n\tborder-right: 8px solid transparent;\r\n\tborder-bottom: 8px solid transparent;\r\n\tborder-left: 8px solid transparent;\r\n\tleft: 10px;\r\n\ttop: 24px;\r\n}\r\n\r\n.dom-inspector .tips.reverse .triangle {\r\n\tborder-top: 8px solid transparent;\r\n\tborder-right: 8px solid transparent;\r\n\tborder-bottom: 8px solid #333740;\r\n\tborder-left: 8px solid transparent;\r\n\tleft: 10px;\r\n\ttop: -16px;\r\n}\r\n\r\n.dom-inspector .tips>div {\r\n\tdisplay: inline-block;\r\n\tvertical-align: middle;\r\n\tfont-size: 12px;\r\n\tfont-family: Consolas, Menlo, Monaco, Courier, monospace;\r\n\toverflow: auto;\r\n}\r\n\r\n.dom-inspector .tips .tag {\r\n\tcolor: #e776e0;\r\n}\r\n\r\n.dom-inspector .tips .id {\r\n\tcolor: #eba062;\r\n}\r\n\r\n.dom-inspector .tips .class {\r\n\tcolor: #8dd2fb;\r\n}\r\n\r\n.dom-inspector .tips .line {\r\n\tcolor: #fff;\r\n}\r\n\r\n.dom-inspector .tips .size {\r\n\tcolor: #fff;\r\n}\r\n\r\n.dom-inspector-theme-default {\r\n\r\n}\r\n\r\n.dom-inspector-theme-default .margin {\r\n\tbackground-color: rgba(255, 81, 81, 0.75);\r\n}\r\n\r\n.dom-inspector-theme-default .border {\r\n\tbackground-color: rgba(255, 241, 81, 0.75);\r\n}\r\n\r\n.dom-inspector-theme-default .padding {\r\n\tbackground-color: rgba(81, 255, 126, 0.75);\r\n}\r\n\r\n.dom-inspector-theme-default .content {\r\n\tbackground-color: rgba(81, 101, 255, 0.75);\r\n}\r\n", undefined);

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

function isNull(obj) {
	return Object.prototype.toString.call(obj).replace(/\[object[\s]/, '').replace(']', '').toLowerCase() === 'null';
}

function isDOM() {
	var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	return obj instanceof HTMLElement;
}

function $(selector, parent) {
	if (!parent) return document.querySelector(selector);
	if (isDOM(parent)) return parent.querySelector(selector);
	return document.querySelector(selector);
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
function getElementInfo$1(ele) {
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

var sep = 'DomInspector: ';

var proxy = ['log', 'warn', 'error'];

var exportObj = {};

proxy.forEach(function (item) {
	exportObj[item] = function funcName() {
		return console[item].call(this, sep + (arguments.length <= 0 ? undefined : arguments[0]), (arguments.length <= 1 ? undefined : arguments[1]) || '');
	};
});

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

var DomInspector = function () {
	function DomInspector() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		classCallCheck(this, DomInspector);

		this._doc = window.document;
		this.root = options.root ? isDOM(options.root) ? options.root : $(options.root) : $('body');
		if (isNull(this.root)) {
			exportObj.warn('Root element is null. Auto select body as root');
			this.root = $('body');
		}
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
			if (this.destroyed) return exportObj.warn('Inspector instance has been destroyed! Please redeclare it.');
			this.overlay.parent.style.display = 'block';
			this.root.addEventListener('mousemove', this._throttleOnMove);
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.root.removeEventListener('mousemove', this._throttleOnMove);
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
		value: function getXPath(ele) {
			if (!isDOM(ele) && !this.target) return exportObj.warn('Target element is not found. Warning function name:%c getXPath', 'color: #ff5151');
			if (!ele) ele = this.target;
		}
	}, {
		key: 'getSelector',
		value: function getSelector(ele) {
			if (!isDOM(ele) && !this.target) return exportObj.warn('Target element is not found. Warning function name:%c getCssPath', 'color: #ff5151');
			var path = [];
			if (!ele) ele = this.target;
			while (ele.nodeType === Node.ELEMENT_NODE) {
				var currentSelector = ele.nodeName.toLowerCase();
				if (ele.id) {
					currentSelector += '#' + ele.id;
				} else {
					var sib = ele;
					var nth = 0;
					while (sib) {
						if (sib.nodeName.toLowerCase() === currentSelector) nth += 1;
						sib = sib.previousElementSibling;
					}
					if (nth !== 1) currentSelector += ':nth-of-type(' + nth + ')';
				}
				path.unshift(currentSelector);
				ele = ele.parentNode;
			}
			return path.join('>');
		}
	}, {
		key: 'getElementInfo',
		value: function getElementInfo(ele) {
			if (!isDOM(ele) && !this.target) return exportObj.warn('Target element is not found. Warning function name:%c getElementInfo', 'color: #ff5151');
			return getElementInfo$1(ele || this.target);
		}
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
			var elementInfo = getElementInfo$1(e.target);
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
