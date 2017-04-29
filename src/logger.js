const sep = 'DomInspector: ';

const proxy = ['log', 'warn', 'error'];

const exportObj = {};

proxy.forEach(item => {
	exportObj[item] = function (...args) {
		const restArgs = [...args].pop();
		return console[item].call(this, args[0], restArgs);
	};
});

export default exportObj;
