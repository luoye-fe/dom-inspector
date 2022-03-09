export function mixin(target, source) {
	const targetCopy = target;
	Object.keys(source).forEach(item => {
		if ({}.hasOwnProperty.call(source, item)) {
			targetCopy[item] = source[item];
		}
	});
	return targetCopy;
}

export function throttle(func, wait = 100) {
	let timeout;
	let elapsed;
	let lastRunTime = Date.now(); // 上次运行时间
	return function none(...args) {
		const _this = this;

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

export function isNull(obj) {
	return Object.prototype.toString.call(obj).replace(/\[object[\s]/, '').replace(']', '').toLowerCase() === 'null';
}

export function getClasses(el) {
	return el.className.replace(/\s+/g, ' ').split(' ').filter(x => x.length > 0);
}

// Check if class lists are the same (ignoring order)
export function sameClasses(a, b) {
	const ac = getClasses(a);
	const bc = getClasses(b);
	return ac.length === bc.length && ac.every(item => bc.indexOf(item) > -1);
}

export default null;
