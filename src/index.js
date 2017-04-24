import './style.css';
import { $, getElementInfo } from './dom.js';
import { throttle } from './utils.js';

class DomInspector {
	constructor(options = {}) {
		this._doc = window.document;
		this.root = typeof (options.root || 'body') === 'string' ? $((options.root || 'body')) : options.root;
		this.theme = options.theme || 'dom-inspector-theme-default';
		this.overlay = '';
		this.overlayId = '';
		this._init();
		this._throttleOnMove = throttle(this._onMove.bind(this), 100);
	}
	enable() {
		this.overlay.style.display = 'block';
		this.root.addEventListener('mousemove', this._throttleOnMove);
	}
	disable() {
		this.overlay.style.display = 'none';
		this.overlay.style.width = 0;
		this.overlay.style.height = 0;
		this.root.removeEventListener('mousemove', this._throttleOnMove);
	}
	destory() {

	}
	_init() {
		this.overlayId = `dom-inspector-${Date.now()}`;
		this.overlay = this._createElement('div', {
			id: this.overlayId,
			class: `dom-inspector ${this.theme}`
		});
		$('body').appendChild(this.overlay);
	}
	_createElement(tag, attr) {
		const ele = this._doc.createElement(tag);
		Object.keys(attr).forEach(item => {
			ele.setAttribute(item, attr[item]);
		});
		return ele;
	}
	_onMove(e) {
		const elementInfo = getElementInfo(e.target);
		// console.log(e.target, elementInfo);
		Object.keys(elementInfo).forEach(item => {
			if (item === 'z-index' && this.overlay.style['z-index'] <= elementInfo[item]) {
				return (this.overlay.style[item] = elementInfo[item] + 1);
			}
			this.overlay.style[item] = `${elementInfo[item]}px`;
		});
	}
}

export default DomInspector;
