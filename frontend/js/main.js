/*not used */
//require(["jquery-1.8.3.min","jquery-ui-1.9.2"]);
/*
require(["angular_1.2.0-rc.2.min","ui-bootstrap-tpls-0.6.0"]);
require(["date"]);
require(["../services","../directives","../controllers","../app"]);
*/

/*http://www.startersquad.com/blog/angularjs-requirejs/*/



require.config({
    baseUrl: 'javascripts',
    paths: {
		angular: 'lib/angular_1.2.0-rc.2.min',
		date: 'lib/date',
        uiBootstrap: 'lib/ui-bootstrap-tpls-0.6.0'
	},
	shim: {
		'angular' : {'exports' : 'angular'}
	},
	priority: [
		"angular"
	]
});

window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'angular',
	'uiBootstrap',
	'date',
    'app',
	'services',
	'directives',
    'controllers'
], function(angular, app, services,directives, controllers ) {
	'use strict';
    alert('angular:'+angular);
	var $html = angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		$html.addClass('ng-app');
		angular.bootstrap($html, [app['name']]);
	});
});