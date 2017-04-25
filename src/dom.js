import { mixin } from './utils.js';

export function isDOM(obj = {}) {
	try {
		// 现代浏览器
		return obj instanceof HTMLElement;
	} catch (e) {
		// ie7+
		return (typeof obj === 'object') && (obj.nodeType === 1) && (typeof obj.style === 'object') && (typeof obj.ownerDocument === 'object');
	}
}

export function $(selector, parent) {
	if (!parent) return document.documentElement.querySelector(selector);
	if (isDOM(parent)) return parent.querySelector(selector);
	return document.documentElement.querySelector(selector);
}

export function addRule(selector, cssObj) {
	const sheet = document.styleSheets[0];
	const propText = typeof cssObj === 'string' ? cssObj : Object.keys(cssObj).map(item => `${item}: ${item === 'content' ? `'${cssObj[item]}'` : cssObj[item]}`).join(';');
	sheet.insertRule(`${selector} {${propText}}`, sheet.cssRules.length);
}

function findPos(ele) {
	let computedStyle = getComputedStyle(ele);
	let _x = ele.getBoundingClientRect().left - parseFloat(computedStyle['margin-left']);
	let _y = ele.getBoundingClientRect().top - parseFloat(computedStyle['margin-top']);
	let el = ele.parent;
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
export function getElementInfo(ele) {
	const result = {};
	const requiredValue = [
		'border-top-width',
		'border-right-width',
		'border-bottom-width',
		'border-left-width',
		'margin-top',
		'margin-right',
		'margin-bottom',
		'margin-left',
		'padding-top',
		'padding-right',
		'padding-bottom',
		'padding-left',
		'z-index'
	];

	const computedStyle = getComputedStyle(ele);
	requiredValue.forEach(item => {
		result[item] = parseFloat(computedStyle[item]) || 0;
	});

	mixin(result, {
		width: ele.offsetWidth - result['border-left-width'] - result['border-right-width'] - result['padding-left'] - result['padding-right'],
		height: ele.offsetHeight - result['border-top-width'] - result['border-bottom-width'] - result['padding-top'] - result['padding-bottom']
	});
	mixin(result, findPos(ele));
	return result;
}


export default $;
