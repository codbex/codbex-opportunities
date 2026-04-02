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
		$scope.optionsQuotation = params.optionsQuotation;
		$scope.optionsProduct = params.optionsProduct;
		$scope.optionsUoM = params.optionsUoM;
		$scope.optionsCurrency = params.optionsCurrency;
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
		if (entity.Quotation !== undefined) {
			filter.$filter.equals.Quotation = entity.Quotation;
		}
		if (entity.Product !== undefined) {
			filter.$filter.equals.Product = entity.Product;
		}
		if (entity.Quantity !== undefined) {
			filter.$filter.equals.Quantity = entity.Quantity;
		}
		if (entity.UoM !== undefined) {
			filter.$filter.equals.UoM = entity.UoM;
		}
		if (entity.Price !== undefined) {
			filter.$filter.equals.Price = entity.Price;
		}
		if (entity.Total !== undefined) {
			filter.$filter.equals.Total = entity.Total;
		}
		if (entity.Currency !== undefined) {
			filter.$filter.equals.Currency = entity.Currency;
		}
		Dialogs.postMessage({ topic: 'codbex-opportunities.Quotation.QuotationItem.entitySearch', data: {
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
		Dialogs.closeWindow({ id: 'QuotationItem-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});