var app = angular.module('meanBlog', [
	'ngRoute',
	//'loginController',
	'blogController'
]);

app.config(['$routeProvider', function($rp) {
	$rp
	/*.when('/login/?', {
		templateUrl: 'app/views/login.html',
		controller: 'loginCtrl'
	})*/
	.when('/blog/?', {
		templateUrl: 'app/views/blog.html',
		controller: 'blogCtrl'
	})
	.otherwise({
		redirectTo: '/blog'
	})
}]);