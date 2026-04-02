angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
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
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsCustomer = params.optionsCustomer;
		$scope.optionsCurrency = params.optionsCurrency;
		$scope.optionsLead = params.optionsLead;
		$scope.optionsOwner = params.optionsOwner;
		$scope.optionsType = params.optionsType;
		$scope.optionsPriority = params.optionsPriority;
		$scope.optionsProbability = params.optionsProbability;
		$scope.optionsStatus = params.optionsStatus;
	}

	$scope.filter = () => {
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
		if (entity.Customer !== undefined) {
			filter.$filter.equals.Customer = entity.Customer;
		}
		if (entity.Amount !== undefined) {
			filter.$filter.equals.Amount = entity.Amount;
		}
		if (entity.Currency !== undefined) {
			filter.$filter.equals.Currency = entity.Currency;
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
		if (entity.DateFrom) {
			filter.$filter.greaterThanOrEqual.Date = entity.DateFrom;
		}
		if (entity.DateTo) {
			filter.$filter.lessThanOrEqual.Date = entity.DateTo;
		}
		Dialogs.postMessage({ topic: 'codbex-opportunities.Opportunity.Opportunity.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-opportunities.Opportunity.Opportunity.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Opportunity-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});