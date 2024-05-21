angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Lead.Lead';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsIndustry = params.optionsIndustry;
			$scope.optionsStatus = params.optionsStatus;
			$scope.optionsOwner = params.optionsOwner;
		}

		$scope.filter = function () {
			let entity = $scope.entity;
			const filter = {
				$filter: {
					equals: {
					},
					notEquals: {
					},
					contains: {
					},
					greaterThan: {
					},
					greaterThanOrEqual: {
					},
					lessThan: {
					},
					lessThanOrEqual: {
					}
				},
			};
			if (entity.Id !== undefined) {
				filter.$filter.equals.Id = entity.Id;
			}
			if (entity.Name) {
				filter.$filter.contains.Name = entity.Name;
			}
			if (entity.CompanyName) {
				filter.$filter.contains.CompanyName = entity.CompanyName;
			}
			if (entity.ContactName) {
				filter.$filter.contains.ContactName = entity.ContactName;
			}
			if (entity.ContactDesignation) {
				filter.$filter.contains.ContactDesignation = entity.ContactDesignation;
			}
			if (entity.ContactEmail) {
				filter.$filter.contains.ContactEmail = entity.ContactEmail;
			}
			if (entity.ContactPhone) {
				filter.$filter.contains.ContactPhone = entity.ContactPhone;
			}
			if (entity.Industry !== undefined) {
				filter.$filter.equals.Industry = entity.Industry;
			}
			if (entity.Status !== undefined) {
				filter.$filter.equals.Status = entity.Status;
			}
			if (entity.Owner !== undefined) {
				filter.$filter.equals.Owner = entity.Owner;
			}
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			messageHub.postMessage("clearDetails");
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("Lead-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);