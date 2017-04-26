import './style.css';
import { $, getElementInfo, isDOM, addRule } from './dom.js';
import { throttle } from './utils.js';
import logger from './logger.js';

class DomInspector {
	constructor(options = {}) {
		this._doc = window.document;
		this.root = options.root ? (isDOM(options.root) ? options.root : $(options.root)) : $('body');
		this.theme = options.theme || 'dom-inspector-theme-default';
		this.overlay = {};
		this.overlayId = '';
		this.target = '';
		this.destroyed = false;
		this._cachedTarget = '';
		this._throttleOnMove = throttle(this._onMove.bind(this), 100);
		this._init();
	}
	enable() {
		if (this.destroyed) return logger.warn('Inspector instance has been destroyed! Please redeclare it.');
		this.overlay.parent.style.display = 'block';
		this.root.addEventListener('mousemove', this._throttleOnMove);
	}
	disable() {
		this.overlay.parent.style.display = 'none';
		this.overlay.parent.style.width = 0;
		this.overlay.parent.style.height = 0;
		this.target = null;
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
	getElementInfo(ele) {
		if (!isDOM(ele) && !this.target) return logger.warn('Target element is not found. Warning function name:%c getElementInfo', 'color: #ff5151');
		return getElementInfo(ele || this.target);
	}
	_init() {
		this.overlayId = `dom-inspector-${Date.now()}`;

		const parent = this._createElement('div', {
			id: this.overlayId,
			class: `dom-inspector ${this.theme}`
		});

		this.overlay = {
			parent,
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
	_createElement(tag, attr, content) {
		const ele = this._doc.createElement(tag);
		Object.keys(attr).forEach(item => {
			ele.setAttribute(item, attr[item]);
		});
		if (content) ele.innerHTML = content;
		return ele;
	}
	_createSurroundEle(parent, className, content) {
		const ele = this._createElement('div', {
			class: className
		}, content);
		parent.appendChild(ele);
		return ele;
	}
	_onMove(e) {
		this.target = e.target;
		if (this.target === this._cachedTarget) return null;
		this._cachedTarget = this.target;
		const elementInfo = getElementInfo(e.target);
		const contentLevel = {
			width: elementInfo.width,
			height: elementInfo.height
		};
		const paddingLevel = {
			width: elementInfo['padding-left'] + contentLevel.width + elementInfo['padding-right'],
			height: elementInfo['padding-top'] + contentLevel.height + elementInfo['padding-bottom']
		};
		const borderLevel = {
			width: elementInfo['border-left-width'] + paddingLevel.width + elementInfo['border-right-width'],
			height: elementInfo['border-top-width'] + paddingLevel.height + elementInfo['border-bottom-width']
		};
		const marginLevel = {
			width: elementInfo['margin-left'] + borderLevel.width + elementInfo['margin-right'],
			height: elementInfo['margin-top'] + borderLevel.height + elementInfo['margin-bottom']
		};

		// 保证 overlay 最大 z-index
		if (this.overlay.parent.style['z-index'] <= elementInfo['z-index']) this.overlay.parent.style['z-index'] = elementInfo['z-index'] + 1;

		// so crazy
		addRule(this.overlay.parent, { width: `${marginLevel.width}px`, height: `${marginLevel.height}px`, top: `${elementInfo.top}px`, left: `${elementInfo.left}px` });
		addRule(this.overlay.content, { width: `${contentLevel.width}px`, height: `${contentLevel.height}px`, top: `${elementInfo['margin-top'] + elementInfo['border-top-width'] + elementInfo['padding-top']}px`, left: `${elementInfo['margin-left'] + elementInfo['border-left-width'] + elementInfo['padding-left']}px` });
		addRule(this.overlay.paddingTop, { width: `${paddingLevel.width}px`, height: `${elementInfo['padding-top']}px`, top: `${elementInfo['margin-top'] + elementInfo['border-top-width']}px`, left: `${elementInfo['margin-left'] + elementInfo['border-left-width']}px` });
		addRule(this.overlay.paddingRight, { width: `${elementInfo['padding-right']}px`, height: `${paddingLevel.height - elementInfo['padding-top']}px`, top: `${elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width']}px`, right: `${elementInfo['margin-right'] + elementInfo['border-right-width']}px` });
		addRule(this.overlay.paddingBottom, { width: `${paddingLevel.width - elementInfo['padding-right']}px`, height: `${elementInfo['padding-bottom']}px`, bottom: `${elementInfo['margin-bottom'] + elementInfo['border-bottom-width']}px`, right: `${elementInfo['padding-right'] + elementInfo['margin-right'] + elementInfo['border-right-width']}px` });
		addRule(this.overlay.paddingLeft, { width: `${elementInfo['padding-left']}px`, height: `${paddingLevel.height - elementInfo['padding-top'] - elementInfo['padding-bottom']}px`, top: `${elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width']}px`, left: `${elementInfo['margin-left'] + elementInfo['border-left-width']}px` });
		addRule(this.overlay.borderTop, { width: `${borderLevel.width}px`, height: `${elementInfo['border-top-width']}px`, top: `${elementInfo['margin-top']}px`, left: `${elementInfo['margin-left']}px` });
		addRule(this.overlay.borderRight, { width: `${elementInfo['border-right-width']}px`, height: `${borderLevel.height - elementInfo['border-top-width']}px`, top: `${elementInfo['margin-top'] + elementInfo['border-top-width']}px`, right: `${elementInfo['margin-right']}px` });
		addRule(this.overlay.borderBottom, { width: `${borderLevel.width - elementInfo['border-right-width']}px`, height: `${elementInfo['border-bottom-width']}px`, bottom: `${elementInfo['margin-bottom']}px`, right: `${elementInfo['margin-right'] + elementInfo['border-right-width']}px` });
		addRule(this.overlay.borderLeft, { width: `${elementInfo['border-left-width']}px`, height: `${borderLevel.height - elementInfo['border-top-width'] - elementInfo['border-bottom-width']}px`, top: `${elementInfo['margin-top'] + elementInfo['border-top-width']}px`, left: `${elementInfo['margin-left']}px` });
		addRule(this.overlay.marginTop, { width: `${marginLevel.width}px`, height: `${elementInfo['margin-top']}px`, top: 0, left: 0 });
		addRule(this.overlay.marginRight, { width: `${elementInfo['margin-right']}px`, height: `${marginLevel.height - elementInfo['margin-top']}px`, top: `${elementInfo['margin-top']}px`, right: 0 });
		addRule(this.overlay.marginBottom, { width: `${marginLevel.width - elementInfo['margin-right']}px`, height: `${elementInfo['margin-bottom']}px`, bottom: 0, right: `${elementInfo['margin-right']}px` });
		addRule(this.overlay.marginLeft, { width: `${elementInfo['margin-left']}px`, height: `${marginLevel.height - elementInfo['margin-top'] - elementInfo['margin-bottom']}px`, top: `${elementInfo['margin-top']}px`, left: 0 });

		$('.tag', this.overlay.tips).innerHTML = this.target.tagName.toLowerCase();
		$('.id', this.overlay.tips).innerHTML = this.target.id ? `#${this.target.id}` : '';
		$('.class', this.overlay.tips).innerHTML = [...this.target.classList].map(item => `.${item}`).join('');
		$('.size', this.overlay.tips).innerHTML = `${marginLevel.width}x${marginLevel.height}`;

		let tipsTop = 0;
		if (elementInfo.top >= 24 + 8) {
			this.overlay.tips.classList.remove('reverse');
			tipsTop = elementInfo.top - 24 - 8;
		} else {
			this.overlay.tips.classList.add('reverse');
			tipsTop = marginLevel.height + elementInfo.top + 8;
		}
		addRule(this.overlay.tips, { top: `${tipsTop}px`, left: `${elementInfo.left}px`, display: 'block' });
	}
}

export default DomInspector;
