angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Lead.LeadQualification';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadQualificationService.ts";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', 'entityApi', function ($scope, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "LeadQualification Details",
			create: "Create LeadQualification",
			update: "Update LeadQualification"
		};
		$scope.action = 'select';

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsAuthority = params.optionsAuthority;
			$scope.optionsNeed = params.optionsNeed;
			$scope.optionsTimeline = params.optionsTimeline;
			$scope.optionsLead = params.optionsLead;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("LeadQualification", `Unable to create LeadQualification: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("LeadQualification", "LeadQualification successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("LeadQualification", `Unable to update LeadQualification: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("LeadQualification", "LeadQualification successfully updated");
			});
		};

		$scope.serviceAuthority = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadQualificationAuthorityService.ts";
		$scope.serviceNeed = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadQualificationNeedService.ts";
		$scope.serviceTimeline = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadQualificationTimelineService.ts";
		$scope.serviceLead = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadService.ts";

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("LeadQualification-details");
		};

	}]);