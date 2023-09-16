angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Lead.Lead';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-opportunities/gen/api/Lead/Lead.js";
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
					messageHub.showAlertError("Lead", `Unable to count Lead: '${response.message}'`);
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
						messageHub.showAlertError("Lead", `Unable to list Lead: '${response.message}'`);
						return;
					}
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}
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
				optionsIndustry: $scope.optionsIndustry,
				optionsLeadStatus: $scope.optionsLeadStatus,
				optionsOwner: $scope.optionsOwner,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			$scope.action = "create";

			messageHub.postMessage("createEntity", {
				entity: {},
				optionsIndustry: $scope.optionsIndustry,
				optionsLeadStatus: $scope.optionsLeadStatus,
				optionsOwner: $scope.optionsOwner,
			});
		};

		$scope.updateEntity = function () {
			$scope.action = "update";
			messageHub.postMessage("updateEntity", {
				entity: $scope.selectedEntity,
				optionsIndustry: $scope.optionsIndustry,
				optionsLeadStatus: $scope.optionsLeadStatus,
				optionsOwner: $scope.optionsOwner,
			});
		};

		$scope.deleteEntity = function () {
			let id = $scope.selectedEntity.Id;
			messageHub.showDialogAsync(
				'Delete Lead?',
				`Are you sure you want to delete Lead? This action cannot be undone.`,
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
							messageHub.showAlertError("Lead", `Unable to delete Lead: '${response.message}'`);
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
		$scope.optionsIndustry = [];
		$scope.optionsLeadStatus = [];
		$scope.optionsOwner = [];

		$http.get("/services/js/codbex-opportunities/gen/api/entities/Industry.js").then(function (response) {
			$scope.optionsIndustry = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-opportunities/gen/api/Settings/LeadStatus.js").then(function (response) {
			$scope.optionsLeadStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-opportunities/gen/api/entities/Employee.js").then(function (response) {
			$scope.optionsOwner = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.optionsIndustryValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsIndustry.length; i++) {
				if ($scope.optionsIndustry[i].value === optionKey) {
					return $scope.optionsIndustry[i].text;
				}
			}
			return null;
		};
		$scope.optionsLeadStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsLeadStatus.length; i++) {
				if ($scope.optionsLeadStatus[i].value === optionKey) {
					return $scope.optionsLeadStatus[i].text;
				}
			}
			return null;
		};
		$scope.optionsOwnerValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsOwner.length; i++) {
				if ($scope.optionsOwner[i].value === optionKey) {
					return $scope.optionsOwner[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
