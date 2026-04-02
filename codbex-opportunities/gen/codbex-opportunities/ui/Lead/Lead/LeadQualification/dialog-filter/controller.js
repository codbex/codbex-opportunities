angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
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
		Dialogs.postMessage({ topic: 'codbex-opportunities.Lead.LeadQualification.entitySearch', data: {
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
		Dialogs.closeWindow({ id: 'LeadQualification-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});