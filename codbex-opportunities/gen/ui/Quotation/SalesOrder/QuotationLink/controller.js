angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Quotation.QuotationLink';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-opportunities/gen/api/Quotation/QuotationLink.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("codbex-orders.SalesOrder.SalesOrder.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("codbex-orders.SalesOrder.SalesOrder.clearDetails", function (msg) {
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
			$scope.loadPage($scope.dataPage);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			let SalesOrder = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			entityApi.count(SalesOrder).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("QuotationLink", `Unable to count QuotationLink: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let query = `SalesOrder=${SalesOrder}`;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.filter(query, offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("QuotationLink", `Unable to list QuotationLink: '${response.message}'`);
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
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("QuotationLink-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "SalesOrder",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsQuotation: $scope.optionsQuotation,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("QuotationLink-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "SalesOrder",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsQuotation: $scope.optionsQuotation,
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
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsQuotation = [];

		$http.get("/services/js/codbex-opportunities/gen/api/Quotation/Quotation.js").then(function (response) {
			$scope.optionsQuotation = response.data.map(e => {
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
		//----------------Dropdowns-----------------//

	}]);
