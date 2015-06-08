'use strict';

/* define module ***********************/
var gmr = window.angular.module('GnipManagementRule',['ui.router', 'ui.bootstrap', 'LocalStorageModule']);

gmr

/* global ***********************/
.run(['$rootScope', 'localStorageService', function($rootScope, localStorageService){
	$rootScope.$on('currentItemChange', function(event, currentItem){
		if(localStorageService.isSupported) {
			//localStorageService.clearAll();
			
			localStorageService.set('currentItem', currentItem);
		   
		}
	});
	$rootScope.alertMsg = [];
	$rootScope.closeAlert = function(index) {
	    $rootScope.alertMsg.splice(index, 1);
	};
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



/* constant ***********************/

// Base Url
.constant('BaseUrl', '/api/gmr/')

/* END constant ***********************/


/* controller ***********************/

//list
.controller('listController', ['$scope', 'List', function($scope, List){
	$scope.model={};

	$scope.getList = function(){
		List.getList()
			.success(function (data){
				
				$scope.list = data;
				$scope.originalList = data;
				$scope.page = {size: 5, index: 1}; 
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
.controller('RuleController', ['$scope', '$modal', 'Rule', '$state', 'localStorageService', '$rootScope', function($scope, $modal, Rule, $state, localStorageService, $rootScope){
	$scope.currentItem = localStorageService.get('currentItem');

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
		Rule.add({
			rule : [{
				"category" : $scope.category,
				"rule"     : [$scope.rule]
			}]
		})
			.success(function (data){
				if(data){
					$state.go('list');
					$rootScope.alertMsg=[{
						"type" : "success",
						"msg"  : "You successfully added " + $scope.rule

					}];
				}
			});
	};

	$scope.update = function(){
		
		var rule = {
				"category" : $scope.currentItem.category,
				"rule"     : $scope.currentItem.rule
			};
		

		if(!$scope.currentItem.rule){
			$scope.errorMessage = 'Please input rule.';
			$scope.open();
			return;
		}

		Rule.update({
			"rule"     : rule,
			"id"       : $scope.currentItem.id
		})
			.success(function(data){
				$state.go('list');
				$rootScope.alertMsg=[{
					"type" : "success",
					"msg"  : "You successfully updated " + $scope.currentItem.rule

				}];
			})
	}

	$scope.delete = function(){
		Rule.delete({
			"id"  : $scope.currentItem.id
		})
			.success(function (data){

				if(data.code === 200){
					$state.go('list');
					$rootScope.alertMsg=[{
						"type" : "danger",
						"msg"  : "You successfully deleted " + $scope.currentItem.rule

					}]
				}
			})
	}

	$scope.cancel = function (){
		$state.go('list');
	}
	
		
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
.factory('List', ['$http', 'GlobalService', 'BaseUrl', function($http, GlobalService, BaseUrl){
	var List = {};

	//get list
	List.getList = function(){
		return $http({
			method : 'GET',
			url    : BaseUrl + 'power track.json'
		})
		.error(function(){
			GlobalService.showError();
		});
	};
	

	return List;
}])

//Rule
.factory('Rule', ['$http', 'GlobalService', 'BaseUrl',  function($http, GlobalService, BaseUrl){
	var Rule={};

	//add rule
	Rule.add = function (options){
		return $http({
			method : 'POST',
			url    : BaseUrl + 'power track.json',
			data   : options.rule
		})
		.error(function(){
			GlobalService.showError();
		});
	};

	//update rule
	Rule.update = function(options){
		return $http({
			method : 'PUT',
			url    : BaseUrl + options.id,
			data   : options.rule
		})
		.error(function(){
			GlobalService.showError();
		});
	}

	//delete rule
	Rule.delete = function(options){
		return $http({
			method  : 'DELETE',
			url     : BaseUrl + options.id
		})
		.error(function(){
			GlobalService.showError();
		});
	}

	return Rule;
}]);

/* END service ***********************/