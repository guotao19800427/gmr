'use strict';

/* define module ***********************/
var gmr = window.angular.module('GnipManagementRule',['ui.router', 'ui.bootstrap', 'LocalStorageModule']);

gmr

/* global ***********************/
.run(['$rootScope', 'localStorageService', function($rootScope, localStorageService){
	$rootScope.$on('currentItemChange', function(event, currentItem){
		if(localStorageService.isSupported) {
			localStorageService.set('currentItem', currentItem);
		    
		}
	});
}])
/* END global ***********************/

/* config ***********************/

//route
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/list');
	$stateProvider
		.state('list',{
			url         : '/list',
			templateUrl : './components/list/list.html',
			controller  : 'listController'
		})
		.state('rule',{
			url         : '/rule',
			templateUrl : './components/rule/rule.html',
			controller  : 'RuleController'
		})
		.state('add', {
			url         : '/add',
			templateUrl : './components/rule/add.html',
			controller  : 'RuleController'
		});
}])

//local storage
.config(['localStorageServiceProvider', function (localStorageServiceProvider){
	localStorageServiceProvider
		.setPrefix('GnipManagementRule')
		.setStorageType('sessionStorage')
		.setNotify(true, false);
}])

/* END config ***********************/



/* controller ***********************/

//list
.controller('listController', ['$scope', 'List', function($scope, List){
	$scope.model={};

	$scope.getList = function(){
		List.getList()
			.success(function (data){
				$scope.list = data;
				$scope.originalList = data;
				$scope.page = {size: 10, index: 1}; 
			});
	};
	$scope.getList();

	$scope.change = function(itemId, itemCategory, ItemRule){
		var currentItem = {
			id       : itemId,
			category : itemCategory,
			rule     : ItemRule
		};
		$scope.$emit('currentItemChange', currentItem);
	};	
}])

//filter of list
.filter('paging', function() {
  return function (items, index, pageSize) {
    if (!items){
    	return [];
    }
    var offset = (index - 1) * pageSize;
    return items.slice(offset, offset + pageSize);
  };
})
.filter('size', function() {
  return function (items) {
    if (!items){
    	return 0;
    }
    return items.length || 0 ;
  };
})

//Rule
.controller('RuleController', ['$scope', '$modal', 'Rule', '$state', 'localStorageService', function($scope, $modal, Rule, $state, localStorageService){
	$scope.errorMessage = '';
	$scope.animationsEnabled = true;
	$scope.open = function () {
	    var modalInstance = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'alertModalBox.html',
	      controller: 'ModalInstanceCtrl',
	      // size: size,
	      resolve: {
	        errorMessage: function () {
	          return $scope.errorMessage;
	        }
	      }
	    });
	};

	$scope.add = function(){
		if(!$scope.category){
			$scope.errorMessage = 'Please choose category.';
			$scope.open();
			return;
		}
		if(!$scope.rule){
			$scope.errorMessage = 'Please input rule.';
			$scope.open();
			return;
		}
		Rule.add()
			.success(function (data){
				if(data.result === 1){
					$state.go('list');
				}
			});
	};

	$scope.currentItem = localStorageService.get('currentItem');
	console.log($scope.currentItem);
		
}])

//modal instance
.controller('ModalInstanceCtrl',['$scope', '$modalInstance', 'errorMessage', function ($scope, $modalInstance, errorMessage){
	$scope.errorMessage = errorMessage;
	$scope.ok = function(){
		$modalInstance.close();
	};
}])

/* END controller ***********************/



/* service ***********************/

//global service
.factory('GlobalService', function(){
	var GlobalService = {};

	GlobalService.showError = function(){
		window.alert('Sorry there is something wrong.');
	};

	return GlobalService;
}) 

//list
.factory('List', ['$http', 'GlobalService', function($http, GlobalService){
	var List = {};

	//get list
	List.getList = function(){
		return $http({
			method : 'GET',
			url    : '/api/v1/rules/power%20track'
		})
		.error(function(){
			GlobalService.showError();
		});
	};
	

	return List;
}])

//Rule
.factory('Rule', ['$http', 'GlobalService', function($http, GlobalService){
	var Rule={};
	Rule.add = function (){
		return $http({
			method : 'GET',
			url    : './fakeJSON/fake-success.json'
		})
		.error(function(){
			GlobalService.showError();
		});
	};

	return Rule;
}]);

/* END service ***********************/