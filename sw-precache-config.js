module.exports = {
	staticFileGlobs: [
		'/',
		'/dist/css/**.css',
		'/dist/js/**.js',
	],
	// stripPrefix: 'dist/',
	runtimeCaching: [{
		urlPattern: /^https:\/\/coincap\.io/,
		handler: 'networkFirst'
	}]
};
