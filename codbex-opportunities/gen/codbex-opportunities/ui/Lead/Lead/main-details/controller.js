angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Lead.Lead';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadService.ts";
	}])
	.controller('PageController', ['$scope', 'Extensions', 'messageHub', 'entityApi', function ($scope, Extensions, messageHub, entityApi) {

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
				$scope.optionsIndustry = [];
				$scope.optionsStatus = [];
				$scope.optionsOwner = [];
				$scope.optionsQualification = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				$scope.entity = msg.data.entity;
				$scope.optionsIndustry = msg.data.optionsIndustry;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.optionsQualification = msg.data.optionsQualification;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsIndustry = msg.data.optionsIndustry;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.optionsQualification = msg.data.optionsQualification;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = msg.data.entity;
				$scope.optionsIndustry = msg.data.optionsIndustry;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.optionsQualification = msg.data.optionsQualification;
				$scope.action = 'update';
			});
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

	}]);