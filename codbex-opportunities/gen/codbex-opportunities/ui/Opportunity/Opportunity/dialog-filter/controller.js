angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Opportunity.Opportunity';
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
			$scope.optionsCustomer = params.optionsCustomer;
			$scope.optionsLead = params.optionsLead;
			$scope.optionsOwner = params.optionsOwner;
			$scope.optionsType = params.optionsType;
			$scope.optionsPriority = params.optionsPriority;
			$scope.optionsProbability = params.optionsProbability;
			$scope.optionsStatus = params.optionsStatus;
			$scope.optionsCurrency = params.optionsCurrency;
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
			if (entity.Number) {
				filter.$filter.contains.Number = entity.Number;
			}
			if (entity.Source) {
				filter.$filter.contains.Source = entity.Source;
			}
			if (entity.Customer !== undefined) {
				filter.$filter.equals.Customer = entity.Customer;
			}
			if (entity.Amount !== undefined) {
				filter.$filter.equals.Amount = entity.Amount;
			}
			if (entity.Lead !== undefined) {
				filter.$filter.equals.Lead = entity.Lead;
			}
			if (entity.Owner !== undefined) {
				filter.$filter.equals.Owner = entity.Owner;
			}
			if (entity.Type !== undefined) {
				filter.$filter.equals.Type = entity.Type;
			}
			if (entity.Priority !== undefined) {
				filter.$filter.equals.Priority = entity.Priority;
			}
			if (entity.Probability !== undefined) {
				filter.$filter.equals.Probability = entity.Probability;
			}
			if (entity.Status !== undefined) {
				filter.$filter.equals.Status = entity.Status;
			}
			if (entity.Currency !== undefined) {
				filter.$filter.equals.Currency = entity.Currency;
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
			messageHub.closeDialogWindow("Opportunity-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);