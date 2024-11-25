angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Opportunity.OpportunityAction';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityActionService.ts";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', 'entityApi', function ($scope, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "OpportunityAction Details",
			create: "Create OpportunityAction",
			update: "Update OpportunityAction"
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
			$scope.optionsOpportunity = params.optionsOpportunity;
			$scope.optionsInitiator = params.optionsInitiator;
			$scope.optionsNote = params.optionsNote;
			$scope.optionsType = params.optionsType;
			$scope.optionsStatus = params.optionsStatus;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("OpportunityAction", `Unable to create OpportunityAction: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("OpportunityAction", "OpportunityAction successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("OpportunityAction", `Unable to update OpportunityAction: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("OpportunityAction", "OpportunityAction successfully updated");
			});
		};

		$scope.serviceOpportunity = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityService.ts";
		$scope.serviceInitiator = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
		$scope.serviceNote = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityNoteService.ts";
		$scope.serviceType = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/ActionTypeService.ts";
		$scope.serviceStatus = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/ActionStatusService.ts";

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("OpportunityAction-details");
		};

	}]);