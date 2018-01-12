const CACHE_NAME = '0.0.8';
const URLS_TO_CACHE = [
	'/',
	'/dist/css/main.css',
	'/dist/js/bundle.js',
];

self.addEventListener('install', (e) => {
	e.waitUntil(caches.open(CACHE_NAME)
		.then(cache => cache.addAll(URLS_TO_CACHE)));
});

self.addEventListener('fetch', (e) => {
	e.respondWith(caches.match(e.request)
		.then(response => response || fetch(e.request)));
});
