'use strict';

/* Controller */
angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {
		$scope.styleCode;
		$scope.chosenColor;
		$scope.apparelSizes = [
			{id:1, size:"2XS"},
			{id:2, size:"XS"},
			{id:3, size:"S"},
			{id:4, size:"M"},
			{id:5, size:"L"},
			{id:6, size:"XL"},
			{id:7, size:"2XL"},
			{id:8, size:"3XL"},
			{id:9, size:"4XL"}
		];
		$scope.formData = [
			{styleCode:0},
			{color:0},
			{size:0},
			{quantity:0}
		]
		$scope.chosenSize;
		$scope.quantity;
		$scope.price = 0;

		$scope.quote = function(){
			$http.post("/api/quote", $scope.formData)
			.success(function(data){

			})
			.error(function(data){

			});
		}
		
	});