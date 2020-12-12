/*\
title: $:/core/modules/savers/custom.js
type: application/javascript
module-type: saver

Looks for `window.$tw.customSaver` first on the current window, then
on the parent window (of an iframe). If present, the saver must define
	save: function(text,method,callback) { ... }
and the saver may define
	priority: number
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var findSaver = function(window) {
	try {
		return window && window.$tw && window.$tw.customSaver;
	} catch (err) {
		// Catching the exception is the most reliable way to detect cross-origin iframe errors.
		// For example, instead of saying that `window.parent.$tw` is undefined, Firefox will throw
		//   Uncaught DOMException: Permission denied to access property "$tw" on cross-origin object
		console.log({ msg: "custom saver is disabled", reason: err });
		return null;
	}
}
var saver = findSaver(window) || findSaver(window.parent) || {};

var CustomSaver = function(wiki) {
};

CustomSaver.prototype.save = async (text,method,callback) => {
	// var add = require('$:/core/modules/utils/corebos.js').add;
	// alert("Hello there");
	// console.log(text);
	// console.log(add(10, 10));
	// var fetch = require('$:/core/modules/utils/corebos.js').fetch;
	// fetch();
	// var asyncfetch = require('$:/core/modules/utils/corebos.js').asyncfetch;
	// await asyncfetch();
	var content = text;
	console.log(content);
	var CbWSClient = require('$:/core/modules/utils/corebos.js').CbWSClient;
	try {
		var cbWSClient = new CbWSClient('http://localhost/corebos');
		var user = await cbWSClient.doLogin('admin', 'nhIZoO5sZsg8y8Jn');
		console.log(user);
		console.log(method);
		console.log(typeof text);
		var valuemap = {
			conversationtitle: 'TW',
			conversationcontent: encodeURIComponent(content),
		}
		console.log(valuemap);
		console.log(JSON.stringify(valuemap));
		var conversation = await cbWSClient.doCreate('Conversation', valuemap);
		console.log(conversation);
	} catch (e) {
		console.log(e.message);
	}
	return true;
};

/*
Information about this saver
*/
CustomSaver.prototype.info = {
	name: "custom",
	priority: saver.priority || 4000,
	capabilities: ["save","autosave"]
};

/*
Static method that returns true if this saver is capable of working
*/
exports.canSave = function(wiki) {
	// return !!(saver.save);
	return true;
};

/*
Create an instance of this saver
*/
exports.create = function(wiki) {
	return new CustomSaver(wiki);
};
})();
