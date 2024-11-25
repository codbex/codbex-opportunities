angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Opportunity.OpportunityAction';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityActionService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {
		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-opportunities-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "Opportunity" && e.view === "OpportunityAction" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "Opportunity" && e.view === "OpportunityAction" && e.type === "entity");
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
		messageHub.onDidReceiveMessage("codbex-opportunities.Opportunity.${masterEntity}.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("codbex-opportunities.Opportunity.${masterEntity}.clearDetails", function (msg) {
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
					messageHub.showAlertError("OpportunityAction", `Unable to count OpportunityAction: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				filter.$offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				entityApi.search(filter).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("OpportunityAction", `Unable to list/filter OpportunityAction: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
					});

					$scope.data = response.data;
				});
			});
		};

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("OpportunityAction-details", {
				action: "select",
				entity: entity,
				optionsOpportunity: $scope.optionsOpportunity,
				optionsInitiator: $scope.optionsInitiator,
				optionsNote: $scope.optionsNote,
				optionsType: $scope.optionsType,
				optionsStatus: $scope.optionsStatus,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("OpportunityAction-filter", {
				entity: $scope.filterEntity,
				optionsOpportunity: $scope.optionsOpportunity,
				optionsInitiator: $scope.optionsInitiator,
				optionsNote: $scope.optionsNote,
				optionsType: $scope.optionsType,
				optionsStatus: $scope.optionsStatus,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("OpportunityAction-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "${masterEntityId}",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsOpportunity: $scope.optionsOpportunity,
				optionsInitiator: $scope.optionsInitiator,
				optionsNote: $scope.optionsNote,
				optionsType: $scope.optionsType,
				optionsStatus: $scope.optionsStatus,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("OpportunityAction-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "${masterEntityId}",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsOpportunity: $scope.optionsOpportunity,
				optionsInitiator: $scope.optionsInitiator,
				optionsNote: $scope.optionsNote,
				optionsType: $scope.optionsType,
				optionsStatus: $scope.optionsStatus,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete OpportunityAction?',
				`Are you sure you want to delete OpportunityAction? This action cannot be undone.`,
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
							messageHub.showAlertError("OpportunityAction", `Unable to delete OpportunityAction: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsOpportunity = [];
		$scope.optionsInitiator = [];
		$scope.optionsNote = [];
		$scope.optionsType = [];
		$scope.optionsStatus = [];


		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityService.ts").then(function (response) {
			$scope.optionsOpportunity = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts").then(function (response) {
			$scope.optionsInitiator = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityNoteService.ts").then(function (response) {
			$scope.optionsNote = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/ActionTypeService.ts").then(function (response) {
			$scope.optionsType = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/ActionStatusService.ts").then(function (response) {
			$scope.optionsStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.optionsOpportunityValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsOpportunity.length; i++) {
				if ($scope.optionsOpportunity[i].value === optionKey) {
					return $scope.optionsOpportunity[i].text;
				}
			}
			return null;
		};
		$scope.optionsInitiatorValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsInitiator.length; i++) {
				if ($scope.optionsInitiator[i].value === optionKey) {
					return $scope.optionsInitiator[i].text;
				}
			}
			return null;
		};
		$scope.optionsNoteValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsNote.length; i++) {
				if ($scope.optionsNote[i].value === optionKey) {
					return $scope.optionsNote[i].text;
				}
			}
			return null;
		};
		$scope.optionsTypeValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsType.length; i++) {
				if ($scope.optionsType[i].value === optionKey) {
					return $scope.optionsType[i].text;
				}
			}
			return null;
		};
		$scope.optionsStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsStatus.length; i++) {
				if ($scope.optionsStatus[i].value === optionKey) {
					return $scope.optionsStatus[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
