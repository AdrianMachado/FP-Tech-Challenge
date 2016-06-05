'use strict';

/* Controller */
angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {
		$scope.apparelId;
		$scope.availableApparel;
		$scope.formData = {};
		$scope.quantity;
		$scope.price = 0;

		$scope.quote = function(){//gets the quote price
			$scope.formData.styleCode = $scope.availableApparel[$scope.apparelId-1].style_code;
			$scope.formData.weight = $scope.availableApparel[$scope.apparelId-1].weight;
			$http.post("/api/quote", $scope.formData)
			.success(function(data){
				$scope.price = data;
			})
			.error(function(data){
				console.log(data);
			});
		};

		var getAvailableApparel = function(){//gets all the apparel in the db
			$http.get("/api/apparel/"+ $scope.formData.styleCode)
			.success(function(data){
				$scope.availableApparel = data;
			})
			.error(function(data){
				console.log(data);
			})
		};

		getAvailableApparel();//called before page content finishes loading
		
	});