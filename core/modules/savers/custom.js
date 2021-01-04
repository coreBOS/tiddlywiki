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
	console.log($tw);
	const content = $tw.utils.base64Encode(text);
	console.log(content);
	const original = $tw.utils.base64Decode(content);
	console.log(original);
	var CbWSClient = require('$:/core/modules/utils/corebos.js').CbWSClient;
	try {
		var cbWSClient = new CbWSClient('http://localhost/corebos');
		var user = await cbWSClient.doLogin('admin', 'nhIZoO5sZsg8y8Jn');
		console.log(user);
		var valuemap = {
			conversationtitle: 'TiddlyWiki (TW)',
			conversationcontent: 'data:text/html;base64,' + content,
		}
		var conversation = await cbWSClient.doCreate('Conversation', valuemap);
		console.log(conversation);
		callback(null, "Wiki saved to CoreBOS");
	} catch (e) {
		console.log(e.message);
		callback("Wiki could not be saved to CoreBOS");
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
	console.log(wiki);
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
