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
				$scope.page = {size: 3, index: 1}; 
			})
	}
	$scope.getList();
	
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

//Rule
.controller('personController', ['$scope', '$modal', 'Rule', '$state', function($scope, $modal, Rule, $state){
	$scope.errorMessage = '';
	$scope.animationsEnabled = true;
	$scope.open = function () {

	    var modalInstance = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'alertModalBox.html',
	      controller: 'ModalInstanceCtrl',
	      // // size: size,
	      resolve: {
	        errorMessage: function () {
	          return $scope.errorMessage;
	        }
	      }
	    });
	}

	$scope.add = function(){
		if(!$scope.category){
			$scope.errorMessage = "Please choose category.";
			$scope.open();
			return;
		}
		if(!$scope.rule){
			$scope.errorMessage = "Please input rule.";
			$scope.open();
			return;
		}
		Rule.add()
			.success(function (data){
				if(data.result === 1){
					$state.go('list')
				}
			})
	}

}])

//modal instance
.controller('ModalInstanceCtrl',['$scope', '$modalInstance', 'errorMessage', function ($scope, $modalInstance, errorMessage){
	$scope.errorMessage = errorMessage;
	$scope.ok = function(){
		$modalInstance.close();
	}
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
.factory('Rule', ['$http', 'GlobalService', function($http, GlobalService){
	var Rule={};

	//add Rule
	Rule.add = function (){
		return $http({
			method : 'GET',
			url    : './fakeJSON/fake-success.json'
		})
		.error(function(errorMsg){
			GlobalService.showError();
		})
	}

	return Rule;
}])