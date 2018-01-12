(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var CACHE_NAME = '0.0.8';
var URLS_TO_CACHE = ['/', '/dist/css/main.css', '/dist/js/bundle.js'];

self.addEventListener('install', function (e) {
	e.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
		return cache.addAll(URLS_TO_CACHE);
	}));
});

self.addEventListener('fetch', function (e) {
	e.respondWith(caches.match(e.request).then(function (response) {
		return response || fetch(e.request);
	}));
});

},{}]},{},[1]);
