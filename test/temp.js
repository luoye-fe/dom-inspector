function log() {
	const args = [...arguments].pop();
	return console.log.call(this, arguments[0], args);
}

log('Target element is not found. Warning function name:%c getXPath', 'color: #ff5151');
