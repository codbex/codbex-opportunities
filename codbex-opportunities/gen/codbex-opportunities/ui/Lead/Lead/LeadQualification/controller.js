angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Lead.LeadQualification';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadQualificationService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {
		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-opportunities-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "Lead" && e.view === "LeadQualification" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "Lead" && e.view === "LeadQualification" && e.type === "entity");
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
		messageHub.onDidReceiveMessage("codbex-opportunities.Lead.Lead.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("codbex-opportunities.Lead.Lead.clearDetails", function (msg) {
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
			let Lead = $scope.selectedMainEntityId;
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
			filter.$filter.equals.Lead = Lead;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("LeadQualification", `Unable to count LeadQualification: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				filter.$offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				entityApi.search(filter).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("LeadQualification", `Unable to list/filter LeadQualification: '${response.message}'`);
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
			messageHub.showDialogWindow("LeadQualification-details", {
				action: "select",
				entity: entity,
				optionsAuthority: $scope.optionsAuthority,
				optionsNeed: $scope.optionsNeed,
				optionsTimeline: $scope.optionsTimeline,
				optionsLead: $scope.optionsLead,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("LeadQualification-filter", {
				entity: $scope.filterEntity,
				optionsAuthority: $scope.optionsAuthority,
				optionsNeed: $scope.optionsNeed,
				optionsTimeline: $scope.optionsTimeline,
				optionsLead: $scope.optionsLead,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("LeadQualification-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "Lead",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsAuthority: $scope.optionsAuthority,
				optionsNeed: $scope.optionsNeed,
				optionsTimeline: $scope.optionsTimeline,
				optionsLead: $scope.optionsLead,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("LeadQualification-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "Lead",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsAuthority: $scope.optionsAuthority,
				optionsNeed: $scope.optionsNeed,
				optionsTimeline: $scope.optionsTimeline,
				optionsLead: $scope.optionsLead,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete LeadQualification?',
				`Are you sure you want to delete LeadQualification? This action cannot be undone.`,
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
							messageHub.showAlertError("LeadQualification", `Unable to delete LeadQualification: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsAuthority = [];
		$scope.optionsNeed = [];
		$scope.optionsTimeline = [];
		$scope.optionsLead = [];


		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadQualificationAuthorityService.ts").then(function (response) {
			$scope.optionsAuthority = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadQualificationNeedService.ts").then(function (response) {
			$scope.optionsNeed = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadQualificationTimelineService.ts").then(function (response) {
			$scope.optionsTimeline = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadService.ts").then(function (response) {
			$scope.optionsLead = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.optionsAuthorityValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsAuthority.length; i++) {
				if ($scope.optionsAuthority[i].value === optionKey) {
					return $scope.optionsAuthority[i].text;
				}
			}
			return null;
		};
		$scope.optionsNeedValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsNeed.length; i++) {
				if ($scope.optionsNeed[i].value === optionKey) {
					return $scope.optionsNeed[i].text;
				}
			}
			return null;
		};
		$scope.optionsTimelineValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsTimeline.length; i++) {
				if ($scope.optionsTimeline[i].value === optionKey) {
					return $scope.optionsTimeline[i].text;
				}
			}
			return null;
		};
		$scope.optionsLeadValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsLead.length; i++) {
				if ($scope.optionsLead[i].value === optionKey) {
					return $scope.optionsLead[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
