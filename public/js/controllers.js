'use strict';

/* Controller */
angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {
		$scope.styleCode;
		$scope.apparelColors = [
			{color:"red"},
			{color:"blue"},
			{color:"green"},
			{color:"black"},
			{color:"white"}
		];
		$scope.chosenColor;
		$scope.apparelSize;
		$scope.quantity;
		
	});