angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Quotation.Quotation';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-opportunities/gen/api/Quotation/Quotation.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = "select";

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.selectedEntity = null;
				$scope.action = "select";
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			refreshData();
			$scope.loadPage();
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			refreshData();
			$scope.loadPage();
		});
		//-----------------Events-------------------//

		$scope.loadPage = function () {
			$scope.selectedEntity = null;
			entityApi.count().then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Quotation", `Unable to count Quotation: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				let offset = ($scope.dataPage - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				if ($scope.dataReset) {
					offset = 0;
					limit = $scope.dataPage * $scope.dataLimit;
				}
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Quotation", `Unable to list Quotation: '${response.message}'`);
						return;
					}
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				});
			});
		};
		$scope.loadPage($scope.dataPage);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.postMessage("entitySelected", {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsCustomer: $scope.optionsCustomer,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
				optionsOpportunity: $scope.optionsOpportunity,
				optionsQuotationStatus: $scope.optionsQuotationStatus,
				optionsOwsner: $scope.optionsOwsner,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			$scope.action = "create";

			messageHub.postMessage("createEntity", {
				entity: {},
				optionsCustomer: $scope.optionsCustomer,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
				optionsOpportunity: $scope.optionsOpportunity,
				optionsQuotationStatus: $scope.optionsQuotationStatus,
				optionsOwsner: $scope.optionsOwsner,
			});
		};

		$scope.updateEntity = function () {
			$scope.action = "update";
			messageHub.postMessage("updateEntity", {
				entity: $scope.selectedEntity,
				optionsCustomer: $scope.optionsCustomer,
				optionsCurrencyCode: $scope.optionsCurrencyCode,
				optionsOpportunity: $scope.optionsOpportunity,
				optionsQuotationStatus: $scope.optionsQuotationStatus,
				optionsOwsner: $scope.optionsOwsner,
			});
		};

		$scope.deleteEntity = function () {
			let id = $scope.selectedEntity.Id;
			messageHub.showDialogAsync(
				'Delete Quotation?',
				`Are you sure you want to delete Quotation? This action cannot be undone.`,
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
							messageHub.showAlertError("Quotation", `Unable to delete Quotation: '${response.message}'`);
							return;
						}
						refreshData();
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsCustomer = [];
		$scope.optionsCurrencyCode = [];
		$scope.optionsOpportunity = [];
		$scope.optionsQuotationStatus = [];
		$scope.optionsOwsner = [];

		$http.get("/services/js/codbex-opportunities/gen/api/entities/Partner.js").then(function (response) {
			$scope.optionsCustomer = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-opportunities/gen/api/entities/Currency.js").then(function (response) {
			$scope.optionsCurrencyCode = response.data.map(e => {
				return {
					value: e.Code,
					text: e.Code
				}
			});
		});

		$http.get("/services/js/codbex-opportunities/gen/api/Opportunity/Opportunity.js").then(function (response) {
			$scope.optionsOpportunity = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-opportunities/gen/api/Settings/QuotationStatus.js").then(function (response) {
			$scope.optionsQuotationStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-opportunities/gen/api/entities/Employee.js").then(function (response) {
			$scope.optionsOwsner = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.optionsCustomerValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCustomer.length; i++) {
				if ($scope.optionsCustomer[i].value === optionKey) {
					return $scope.optionsCustomer[i].text;
				}
			}
			return null;
		};
		$scope.optionsCurrencyCodeValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCurrencyCode.length; i++) {
				if ($scope.optionsCurrencyCode[i].value === optionKey) {
					return $scope.optionsCurrencyCode[i].text;
				}
			}
			return null;
		};
		$scope.optionsOpportunityValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsOpportunity.length; i++) {
				if ($scope.optionsOpportunity[i].value === optionKey) {
					return $scope.optionsOpportunity[i].text;
				}
			}
			return null;
		};
		$scope.optionsQuotationStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsQuotationStatus.length; i++) {
				if ($scope.optionsQuotationStatus[i].value === optionKey) {
					return $scope.optionsQuotationStatus[i].text;
				}
			}
			return null;
		};
		$scope.optionsOwsnerValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsOwsner.length; i++) {
				if ($scope.optionsOwsner[i].value === optionKey) {
					return $scope.optionsOwsner[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
