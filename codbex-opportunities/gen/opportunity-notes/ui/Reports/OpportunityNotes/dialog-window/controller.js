angular.module('page', ["ideUI", "ideView"])
	.controller('PageController', ['$scope', 'ViewParameters', function ($scope, ViewParameters) {

		$scope.entity = {};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = "select";;

			if (params.entity['Timestamp']) {
				params.entity['Timestamp'] = new Date(params.entity['Timestamp']);
			}
			$scope.entity = params.entity;
		}

	}]);