/* eslint-disable no-undef */
document.getElementById('iframe').onload = () => {
	const inspector = new DomInspector({
    // get iframe element by `contentWindow`
		root: document.getElementById('iframe').contentWindow.document.querySelector('h1'),
		maxZIndex: 9999
	});

	inspector.enable();
};

// const anotherInspector = new DomInspector({

// });
// anotherInspector.enable();

// const anotherInspector = new DomInspector({
// 	root: '.another'
// });

// inspector.destroy();
// inspector.enable();
// anotherInspector.enable();
// inspector.getElementInfo();
// inspector.disable();

// inspector.target;

// inspector.getXPath(inspector.target);
// inspector.getCssPath(inspector.target);
// inspector.getSelector(inspector.target);
// inspector.getElementInfo(inspector.target);
