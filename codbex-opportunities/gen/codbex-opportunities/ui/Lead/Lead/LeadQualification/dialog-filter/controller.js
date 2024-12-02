angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Lead.LeadQualification';
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
			$scope.optionsAuthority = params.optionsAuthority;
			$scope.optionsNeed = params.optionsNeed;
			$scope.optionsTimeline = params.optionsTimeline;
			$scope.optionsLead = params.optionsLead;
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
			if (entity.Budget !== undefined) {
				filter.$filter.equals.Budget = entity.Budget;
			}
			if (entity.Authority !== undefined) {
				filter.$filter.equals.Authority = entity.Authority;
			}
			if (entity.Need !== undefined) {
				filter.$filter.equals.Need = entity.Need;
			}
			if (entity.Timeline !== undefined) {
				filter.$filter.equals.Timeline = entity.Timeline;
			}
			if (entity.Lead !== undefined) {
				filter.$filter.equals.Lead = entity.Lead;
			}
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("LeadQualification-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);