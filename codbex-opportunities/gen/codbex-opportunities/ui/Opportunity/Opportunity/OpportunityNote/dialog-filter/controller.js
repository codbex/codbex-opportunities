angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
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
		if (entity.Subject) {
			filter.$filter.contains.Subject = entity.Subject;
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
		if (entity.Opportunity !== undefined) {
			filter.$filter.equals.Opportunity = entity.Opportunity;
		}
		Dialogs.postMessage({ topic: 'codbex-opportunities.Opportunity.OpportunityNote.entitySearch', data: {
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
		Dialogs.closeWindow({ id: 'OpportunityNote-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});