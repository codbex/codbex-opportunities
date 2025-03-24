angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Lead.Lead';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'messageHub', 'ViewParameters', 'entityApi', function ($scope,  $http, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "Lead Details",
			create: "Create Lead",
			update: "Update Lead"
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
			$scope.optionsCountry = params.optionsCountry;
			$scope.optionsCity = params.optionsCity;
			$scope.optionsStatus = params.optionsStatus;
			$scope.optionsOwner = params.optionsOwner;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					$scope.errorMessage = `Unable to create Lead: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Lead", "Lead successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					$scope.errorMessage = `Unable to update Lead: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Lead", "Lead successfully updated");
			});
		};

		$scope.serviceCountry = "/services/ts/codbex-countries/gen/codbex-countries/api/Countries/CountryService.ts";
		
		$scope.optionsCountry = [];
		
		$http.get("/services/ts/codbex-countries/gen/codbex-countries/api/Countries/CountryService.ts").then(function (response) {
			$scope.optionsCountry = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceCity = "/services/ts/codbex-cities/gen/codbex-cities/api/Cities/CityService.ts";
		
		$scope.optionsCity = [];
		
		$http.get("/services/ts/codbex-cities/gen/codbex-cities/api/Cities/CityService.ts").then(function (response) {
			$scope.optionsCity = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceStatus = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadStatusService.ts";
		
		$scope.optionsStatus = [];
		
		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadStatusService.ts").then(function (response) {
			$scope.optionsStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
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

		$scope.$watch('entity.Country', function (newValue, oldValue) {
			if (newValue !== undefined && newValue !== null) {
				entityApi.$http.get($scope.serviceCountry + '/' + newValue).then(function (response) {
					let valueFrom = response.data.Id;
					entityApi.$http.post("/services/ts/codbex-cities/gen/codbex-cities/api/Cities/CityService.ts/search", {
						$filter: {
							equals: {
								Country: valueFrom
							}
						}
					}).then(function (response) {
						$scope.optionsCity = response.data.map(e => {
							return {
								value: e.Id,
								text: e.Name
							}
						});
						if ($scope.action !== 'select' && newValue !== oldValue) {
							if ($scope.optionsCity.length == 1) {
								$scope.entity.City = $scope.optionsCity[0].value;
							} else {
								$scope.entity.City = undefined;
							}
						}
					});
				});
			}
		});

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("Lead-details");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);