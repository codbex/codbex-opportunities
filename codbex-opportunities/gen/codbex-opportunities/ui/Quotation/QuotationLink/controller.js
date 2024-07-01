angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Quotation.QuotationLink';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Quotation/QuotationLinkService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {
		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-opportunities-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "Quotation" && e.view === "QuotationLink" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "Quotation" && e.view === "QuotationLink" && e.type === "entity");
		});

		$scope.triggerPageAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{},
				null,
				true,
				action
			);
		};

		$scope.triggerEntityAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{
					id: $scope.entity.Id
				},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("codbex-opportunities.Quotation.${masterEntity}.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("codbex-opportunities.Quotation.${masterEntity}.clearDetails", function (msg) {
			$scope.$apply(function () {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}, true);

		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entitySearch", function (msg) {
			resetPagination();
			$scope.filter = msg.data.filter;
			$scope.filterEntity = msg.data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber, filter) {
			let ${masterEntityId} = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			if (!filter.$filter) {
				filter.$filter = {};
			}
			if (!filter.$filter.equals) {
				filter.$filter.equals = {};
			}
			filter.$filter.equals.${masterEntityId} = ${masterEntityId};
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("QuotationLink", `Unable to count QuotationLink: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				filter.$offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				entityApi.search(filter).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("QuotationLink", `Unable to list/filter QuotationLink: '${response.message}'`);
						return;
					}
					$scope.data = response.data;
				});
			});
		};

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("QuotationLink-details", {
				action: "select",
				entity: entity,
				optionsQuotation: $scope.optionsQuotation,
				optionsSalesOrder: $scope.optionsSalesOrder,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("QuotationLink-filter", {
				entity: $scope.filterEntity,
				optionsQuotation: $scope.optionsQuotation,
				optionsSalesOrder: $scope.optionsSalesOrder,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("QuotationLink-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "${masterEntityId}",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsQuotation: $scope.optionsQuotation,
				optionsSalesOrder: $scope.optionsSalesOrder,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("QuotationLink-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "${masterEntityId}",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsQuotation: $scope.optionsQuotation,
				optionsSalesOrder: $scope.optionsSalesOrder,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete QuotationLink?',
				`Are you sure you want to delete QuotationLink? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("QuotationLink", `Unable to delete QuotationLink: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsQuotation = [];
		$scope.optionsSalesOrder = [];


		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Quotation/QuotationService.ts").then(function (response) {
			$scope.optionsQuotation = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-orders/gen/codbex-orders/api/SalesOrder/SalesOrderService.ts").then(function (response) {
			$scope.optionsSalesOrder = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.optionsQuotationValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsQuotation.length; i++) {
				if ($scope.optionsQuotation[i].value === optionKey) {
					return $scope.optionsQuotation[i].text;
				}
			}
			return null;
		};
		$scope.optionsSalesOrderValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSalesOrder.length; i++) {
				if ($scope.optionsSalesOrder[i].value === optionKey) {
					return $scope.optionsSalesOrder[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
