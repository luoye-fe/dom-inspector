module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true,
	},
	extends: 'airbnb-base',
	rules: {
		indent: [2, 'tab'],
		'no-tabs': 0,
		'import/extensions': 0,
		'no-console': 0,
		semi: [2, 'always'],
		'no-unused-vars': 0,
		'no-unneeded-ternary': ['error', {
			defaultAssignment: false
		}]
	}
};
