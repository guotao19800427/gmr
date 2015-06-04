/* define module ***********************/
var gmr = angular.module('GnipManagementRule',['ui.router', 'ui.bootstrap']);

gmr

/*global static object***********************/
.run(['$rootScope', function($rootScope){
	
}])

/* route ***********************/
.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/list');
	$stateProvider
		.state('list',{
			url         : '/list',
			templateUrl : './components/list/list.html',
			controller  : 'listController'
		})
		.state('rule',{
			url         : '/list/{id}',
			templateUrl : '/components/person/person.html',
			controller  : 'personController'
		})
		.state('add', {
			url         : '/add',
			templateUrl : '/components/person/add.html',
			controller  : 'personController'
		})
})

/* controller ***********************/
//list
.controller('listController', ['$scope', 'List', function($scope, List){
	$scope.model={
		
	}
	$scope.getList = function(){
		List.getList()
			.success(function (data){
				$scope.list = data;
				$scope.originalList = data;
				$scope.page = {size: 10, index: 1}; 
			})
	}
	$scope.getList();
	$scope.change = function (){
		
		console.log($scope.list)
	}
}])
//filter of list
.filter('paging', function() {
  return function (items, index, pageSize) {
    if (!items){
    	return [];
    }
    var offset = (index - 1) * pageSize;
    return items.slice(offset, offset + pageSize);
  }
})
.filter('size', function() {
  return function (items) {
    if (!items){
    	return 0;
    }
    return items.length || 0
  }
})

//person
.controller('personController', ['$scope', function($scope){
	console.log('hello Guo Tao, this is person~')
}])

/* service ***********************/

//global service
.factory('GlobalService', function(){
	var GlobalService = {};

	GlobalService.showError = function(){
		alert('Sorry there is something wrong.')
	}

	return GlobalService;
}) 
//list
.factory('List', ['$http', 'GlobalService', function($http, GlobalService){
	var List = {};

	//get list
	List.getList = function(){
		return $http({
			method : 'GET',
			url    : './fakeJSON/fake-list.json'
		})
		.error(function(errorMsg){
			GlobalService.showError();
		})
	}
	

	return List;
}])