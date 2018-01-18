module.exports = {
	staticFileGlobs: [
		'*.html',
		'manifest.json',
		'dist/css/*.css',
		'dist/js/*.js',
	],
	// stripPrefix: 'dist/',
	runtimeCaching: [{
		urlPattern: /^https:\/\/coincap\.io\/front/,
		handler: 'networkFirst'
	}]
};
