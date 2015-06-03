var gmr = angular.module('gmr',['ui.router']);

gmr

//global static object
.run(['$rootScope', function($rootScope){
	
}])

//route
.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/list');
	$stateProvider
		.state('list',{
			url         : '/list',
			templateUrl : './components/list/list.html',
			controller  : 'listController'
		})
		.state('person',{
			url         : '/person',
			templateUrl : '/components/person/person.html',
			controller  : 'personController'
		})
		.state('add', {
			url         : '/add',
			templateUrl : '/components/person/add.html',
			controller  : 'personController'
		})
})

//controller
.controller('listController', ['$scope', function($scope){
	console.log('hello Guo Tao. This is list~')
}])
.controller('personController', ['$scope', function($scope){
	console.log('hello Guo Tao, this is person~')
}])

//service
//global service
.factory('GlobalService', [function(){
	var GlobalService = {};

	GlobalService.showError = function(){
		alert('Sorry there is something wrong.')
	}

	return GlobalService;
}]) 
//list
.factory('List', ['$http', 'GlobalService', function($http, GlobalService){
	var List = {};

	//get list
	list.getList = function(){
		return $http({
			method : 'GET',
			url    : './fakeJSON/fake-list.json'
		})
	}
	.error(function(errorMsg){
		GlobalService.showError();
	})

	return List;
}])