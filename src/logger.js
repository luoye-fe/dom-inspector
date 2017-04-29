const sep = 'DomInspector: ';

const proxy = ['log', 'warn', 'error'];

const exportObj = {};

proxy.forEach(item => {
	exportObj[item] = function (...args) {
		return console[item].call(this, args[0], args[1] || '');
	};
});

export default exportObj;
