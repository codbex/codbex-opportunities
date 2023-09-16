angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Quotation.Quotation';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-opportunities/gen/api/Quotation/Quotation.js";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.entity = {};
		$scope.formHeaders = {
			select: "Quotation Details",
			create: "Create Quotation",
			update: "Update Quotation"
		};
		$scope.formErrors = {};
		$scope.action = 'select';

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.formErrors = {};
				$scope.optionsCustomer = [];
				$scope.optionsCurrencyCode = [];
				$scope.optionsOpportunity = [];
				$scope.optionsQuotationStatus = [];
				$scope.optionsOwsner = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrencyCode = msg.data.optionsCurrencyCode;
				$scope.optionsOpportunity = msg.data.optionsOpportunity;
				$scope.optionsQuotationStatus = msg.data.optionsQuotationStatus;
				$scope.optionsOwsner = msg.data.optionsOwsner;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrencyCode = msg.data.optionsCurrencyCode;
				$scope.optionsOpportunity = msg.data.optionsOpportunity;
				$scope.optionsQuotationStatus = msg.data.optionsQuotationStatus;
				$scope.optionsOwsner = msg.data.optionsOwsner;
				$scope.action = 'create';
				// Set Errors for required fields only
				$scope.formErrors = {
				};
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrencyCode = msg.data.optionsCurrencyCode;
				$scope.optionsOpportunity = msg.data.optionsOpportunity;
				$scope.optionsQuotationStatus = msg.data.optionsQuotationStatus;
				$scope.optionsOwsner = msg.data.optionsOwsner;
				$scope.action = 'update';
			});
		});
		//-----------------Events-------------------//

		$scope.isValid = function (isValid, property) {
			$scope.formErrors[property] = !isValid ? true : undefined;
			for (let next in $scope.formErrors) {
				if ($scope.formErrors[next] === true) {
					$scope.isFormValid = false;
					return;
				}
			}
			$scope.isFormValid = true;
		};

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Quotation", `Unable to create Quotation: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Quotation", "Quotation successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Quotation", `Unable to update Quotation: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Quotation", "Quotation successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};

	}]);