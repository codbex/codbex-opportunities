angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Opportunity.OpportunityAction';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			if (params?.entity?.DateFrom) {
				params.entity.DateFrom = new Date(params.entity.DateFrom);
			}
			if (params?.entity?.DateTo) {
				params.entity.DateTo = new Date(params.entity.DateTo);
			}
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
			$scope.optionsInitiator = params.optionsInitiator;
			$scope.optionsNote = params.optionsNote;
			$scope.optionsType = params.optionsType;
			$scope.optionsStatus = params.optionsStatus;
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
			if (entity.DateFrom) {
				filter.$filter.greaterThanOrEqual.Date = entity.DateFrom;
			}
			if (entity.DateTo) {
				filter.$filter.lessThanOrEqual.Date = entity.DateTo;
			}
			if (entity.Subject) {
				filter.$filter.contains.Subject = entity.Subject;
			}
			if (entity.Opportunity !== undefined) {
				filter.$filter.equals.Opportunity = entity.Opportunity;
			}
			if (entity.Initiator !== undefined) {
				filter.$filter.equals.Initiator = entity.Initiator;
			}
			if (entity.Note !== undefined) {
				filter.$filter.equals.Note = entity.Note;
			}
			if (entity.Type !== undefined) {
				filter.$filter.equals.Type = entity.Type;
			}
			if (entity.Status !== undefined) {
				filter.$filter.equals.Status = entity.Status;
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
			messageHub.closeDialogWindow("OpportunityAction-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);