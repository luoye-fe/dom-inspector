import './style.css';
import { $, getElementInfo, isDOM, addRule } from './dom.js';
import { throttle } from './utils.js';
import logger from './logger.js';

class DomInspector {
	constructor(options = {}) {
		this._doc = window.document;
		this.root = options.root ? (isDOM(options.root) ? options.root : $(options.root)) : $('body');
		this.theme = options.theme || 'dom-inspector-theme-default';
		this.overlay = '';
		this.overlayId = '';
		this._throttleOnMove = throttle(this._onMove.bind(this), 100);
		this.destroyed = false;
		this._init();
	}
	enable() {
		if (this.destroyed) return logger.warn('Inspector instance has been destroyed! Please redeclare it.');
		this.overlay.style.display = 'block';
		this.root.addEventListener('mousemove', this._throttleOnMove);
	}
	disable() {
		this.overlay.style.display = 'none';
		this.overlay.style.width = 0;
		this.overlay.style.height = 0;
		this.root.removeEventListener('mousemove', this._throttleOnMove);
	}
	destroy() {
		this.destroyed = true;
		this.disable();
		this.overlay.remove();
	}
	getXPath(ele) {

	}
	getCssPath(ele) {

	}
	getSelector(ele) {

	}
	_init() {
		this.overlayId = `dom-inspector-${Date.now()}`;
		this.overlay = this._createElement('div', {
			id: this.overlayId,
			class: `dom-inspector ${this.theme}`
		}, '<div class="margin"></div><div class="border"></div><div class="padding"></div><div class="content"></div>');
		$('body').appendChild(this.overlay);
	}
	_createElement(tag, attr, content) {
		const ele = this._doc.createElement(tag);
		Object.keys(attr).forEach(item => {
			ele.setAttribute(item, attr[item]);
		});
		if (content) ele.innerHTML = content;
		return ele;
	}
	_onMove(e) {
		this.target = e.target;
		const elementInfo = getElementInfo(e.target);
		const marginEle = $('.margin', this.overlay);
		const borderEle = $('.border', this.overlay);
		const paddingEle = $('.padding', this.overlay);
		const contentEle = $('.content', this.overlay);

		// 保证 overlay 最大 z-index
		if (this.overlay.style['z-index'] <= elementInfo['z-index']) this.overlay.style['z-index'] = elementInfo['z-index'] + 1;

		this.overlay.style.width = `${elementInfo.width + elementInfo['padding-left'] + elementInfo['padding-right'] + elementInfo['border-left-width'] + elementInfo['border-right-width'] + elementInfo['margin-left'] + elementInfo['margin-right']}px`;
		this.overlay.style.height = `${elementInfo.height + elementInfo['padding-top'] + elementInfo['padding-bottom'] + elementInfo['border-top-width'] + elementInfo['border-bottom-width'] + elementInfo['margin-top'] + elementInfo['margin-bottom']}px`;
		this.overlay.style.top = `${elementInfo.top}px`;
		this.overlay.style.left = `${elementInfo.left}px`;

		marginEle.style.width = `${elementInfo.width + elementInfo['padding-left'] + elementInfo['padding-right'] + elementInfo['border-left-width'] + elementInfo['border-right-width'] + elementInfo['margin-left'] + elementInfo['margin-right']}px`;
		marginEle.style.height = `${elementInfo.height + elementInfo['padding-top'] + elementInfo['padding-bottom'] + elementInfo['border-top-width'] + elementInfo['border-bottom-width'] + elementInfo['margin-top'] + elementInfo['margin-bottom']}px`;

		borderEle.style.width = `${elementInfo.width + elementInfo['padding-left'] + elementInfo['padding-right'] + elementInfo['border-left-width'] + elementInfo['border-right-width']}px`;
		borderEle.style.height = `${elementInfo.height + elementInfo['padding-top'] + elementInfo['padding-bottom'] + elementInfo['border-top-width'] + elementInfo['border-bottom-width']}px`;

		paddingEle.style.width = `${elementInfo.width + elementInfo['padding-left'] + elementInfo['padding-right']}px`;
		paddingEle.style.height = `${elementInfo.height + elementInfo['padding-top'] + elementInfo['padding-bottom']}px`;

		contentEle.style.width = `${elementInfo.width}px`;
		contentEle.style.height = `${elementInfo.height}px`;
	}
}

export default DomInspector;
