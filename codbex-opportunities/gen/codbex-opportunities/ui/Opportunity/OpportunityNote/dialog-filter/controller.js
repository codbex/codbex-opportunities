angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Opportunity.OpportunityNote';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			if (params?.entity?.TimestampFrom) {
				params.entity.TimestampFrom = new Date(params.entity.TimestampFrom);
			}
			if (params?.entity?.TimestampTo) {
				params.entity.TimestampTo = new Date(params.entity.TimestampTo);
			}
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsOpportunity = params.optionsOpportunity;
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
			if (entity.Opportunity !== undefined) {
				filter.$filter.equals.Opportunity = entity.Opportunity;
			}
			if (entity.NoteType !== undefined) {
				filter.$filter.equals.NoteType = entity.NoteType;
			}
			if (entity.Note) {
				filter.$filter.contains.Note = entity.Note;
			}
			if (entity.TimestampFrom) {
				filter.$filter.greaterThanOrEqual.Timestamp = entity.TimestampFrom;
			}
			if (entity.TimestampTo) {
				filter.$filter.lessThanOrEqual.Timestamp = entity.TimestampTo;
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
			messageHub.closeDialogWindow("OpportunityNote-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);