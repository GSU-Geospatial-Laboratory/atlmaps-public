'use strict';

/* Filters */

angular.module('atlMaps.filters', []).
filter('interpolate', ['version',
	function(version) {
		return function(text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		};
	}
]).
filter('limitChar', function() {
	return function(text, length) {
		if (isNaN(length)) {
			length = 50;
		}
		if (!text) {
			return;
		}
		if (text.length <= length) {
			return text;
		} else {
			return String(text).substring(0, length) + '...';
		}
	};
}).
filter('titleCase', function() {
	var titleCaseFilter = function(input) {
		var words = input.split(' ');

		for (var i = 0; i < words.length; i++) {
			words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
		}

		return words.join(' ');
	};

	return titleCaseFilter;
});