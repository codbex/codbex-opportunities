angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Opportunity.Opportunity';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'messageHub', 'ViewParameters', 'entityApi', function ($scope,  $http, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "Opportunity Details",
			create: "Create Opportunity",
			update: "Update Opportunity"
		};
		$scope.action = 'select';

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.Date) {
				params.entity.Date = new Date(params.entity.Date);
			}
			$scope.entity = params.entity;
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

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					$scope.errorMessage = `Unable to create Opportunity: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Opportunity", "Opportunity successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					$scope.errorMessage = `Unable to update Opportunity: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Opportunity", "Opportunity successfully updated");
			});
		};

		$scope.serviceCustomer = "/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts";
		
		$scope.optionsCustomer = [];
		
		$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts").then(function (response) {
			$scope.optionsCustomer = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceCurrency = "/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts";
		
		$scope.optionsCurrency = [];
		
		$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts").then(function (response) {
			$scope.optionsCurrency = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Code
				}
			});
		});
		$scope.serviceLead = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadService.ts";
		
		$scope.optionsLead = [];
		
		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadService.ts").then(function (response) {
			$scope.optionsLead = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Number
				}
			});
		});
		$scope.serviceOwner = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
		
		$scope.optionsOwner = [];
		
		$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts").then(function (response) {
			$scope.optionsOwner = response.data.map(e => {
				return {
					value: e.Id,
					text: e.FirstName
				}
			});
		});
		$scope.serviceType = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityTypeService.ts";
		
		$scope.optionsType = [];
		
		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityTypeService.ts").then(function (response) {
			$scope.optionsType = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.servicePriority = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityPriorityService.ts";
		
		$scope.optionsPriority = [];
		
		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityPriorityService.ts").then(function (response) {
			$scope.optionsPriority = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceProbability = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityProbabilityService.ts";
		
		$scope.optionsProbability = [];
		
		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityProbabilityService.ts").then(function (response) {
			$scope.optionsProbability = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceStatus = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityStatusService.ts";
		
		$scope.optionsStatus = [];
		
		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityStatusService.ts").then(function (response) {
			$scope.optionsStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("Opportunity-details");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);