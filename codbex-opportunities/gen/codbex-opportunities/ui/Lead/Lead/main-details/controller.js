angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Lead.Lead';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

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

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-opportunities-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "Lead" && e.view === "Lead" && e.type === "entity");
		});

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

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsCountry = [];
				$scope.optionsCity = [];
				$scope.optionsStatus = [];
				$scope.optionsOwner = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsCountry = msg.data.optionsCountry;
				$scope.optionsCity = msg.data.optionsCity;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsCountry = msg.data.optionsCountry;
				$scope.optionsCity = msg.data.optionsCity;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsCountry = msg.data.optionsCountry;
				$scope.optionsCity = msg.data.optionsCity;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.action = 'update';
			});
		});

		$scope.serviceCountry = "/services/ts/codbex-countries/gen/codbex-countries/api/Countries/CountryService.ts";
		$scope.serviceCity = "/services/ts/codbex-cities/gen/codbex-cities/api/Cities/CityService.ts";
		$scope.serviceStatus = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadStatusService.ts";
		$scope.serviceOwner = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";


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
		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Lead", `Unable to create Lead: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Lead", "Lead successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Lead", `Unable to update Lead: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Lead", "Lead successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createCountry = function () {
			messageHub.showDialogWindow("Country-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createCity = function () {
			messageHub.showDialogWindow("City-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createStatus = function () {
			messageHub.showDialogWindow("LeadStatus-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createOwner = function () {
			messageHub.showDialogWindow("Employee-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshCountry = function () {
			$scope.optionsCountry = [];
			$http.get("/services/ts/codbex-countries/gen/codbex-countries/api/Countries/CountryService.ts").then(function (response) {
				$scope.optionsCountry = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshCity = function () {
			$scope.optionsCity = [];
			$http.get("/services/ts/codbex-cities/gen/codbex-cities/api/Cities/CityService.ts").then(function (response) {
				$scope.optionsCity = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshStatus = function () {
			$scope.optionsStatus = [];
			$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadStatusService.ts").then(function (response) {
				$scope.optionsStatus = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshOwner = function () {
			$scope.optionsOwner = [];
			$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts").then(function (response) {
				$scope.optionsOwner = response.data.map(e => {
					return {
						value: e.Id,
						text: e.FirstName
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);