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
		if (params?.entity?.TimestampFrom) {
			params.entity.TimestampFrom = new Date(params.entity.TimestampFrom);
		}
		if (params?.entity?.TimestampTo) {
			params.entity.TimestampTo = new Date(params.entity.TimestampTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsLead = params.optionsLead;
		$scope.optionsType = params.optionsType;
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
		if (entity.DateFrom) {
			filter.$filter.greaterThanOrEqual.Date = entity.DateFrom;
		}
		if (entity.DateTo) {
			filter.$filter.lessThanOrEqual.Date = entity.DateTo;
		}
		if (entity.Subject) {
			filter.$filter.contains.Subject = entity.Subject;
		}
		if (entity.Lead !== undefined) {
			filter.$filter.equals.Lead = entity.Lead;
		}
		if (entity.Type !== undefined) {
			filter.$filter.equals.Type = entity.Type;
		}
		if (entity.Status !== undefined) {
			filter.$filter.equals.Status = entity.Status;
		}
		if (entity.Description) {
			filter.$filter.contains.Description = entity.Description;
		}
		if (entity.TimestampFrom) {
			filter.$filter.greaterThanOrEqual.Timestamp = entity.TimestampFrom;
		}
		if (entity.TimestampTo) {
			filter.$filter.lessThanOrEqual.Timestamp = entity.TimestampTo;
		}
		Dialogs.postMessage({ topic: 'codbex-opportunities.Lead.LeadEngagement.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'LeadEngagement-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});