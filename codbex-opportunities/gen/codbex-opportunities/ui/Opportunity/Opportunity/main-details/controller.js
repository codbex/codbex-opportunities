angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Opportunity.Opportunity';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityService.ts";
	}])
	.controller('PageController', ['$scope', 'Extensions', 'messageHub', 'entityApi', function ($scope, Extensions, messageHub, entityApi) {

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

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-opportunities-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "Opportunity" && e.view === "Opportunity" && e.type === "entity");
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
				$scope.optionsCustomer = [];
				$scope.optionsLead = [];
				$scope.optionsOwner = [];
				$scope.optionsType = [];
				$scope.optionsPriority = [];
				$scope.optionsProbability = [];
				$scope.optionsStatus = [];
				$scope.optionsCurrency = [];
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
				$scope.optionsLead = msg.data.optionsLead;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsPriority = msg.data.optionsPriority;
				$scope.optionsProbability = msg.data.optionsProbability;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsLead = msg.data.optionsLead;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsPriority = msg.data.optionsPriority;
				$scope.optionsProbability = msg.data.optionsProbability;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsLead = msg.data.optionsLead;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsPriority = msg.data.optionsPriority;
				$scope.optionsProbability = msg.data.optionsProbability;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.action = 'update';
			});
		});

		$scope.serviceCustomer = "/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts";
		$scope.serviceLead = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadService.ts";
		$scope.serviceOwner = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
		$scope.serviceType = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityTypeService.ts";
		$scope.servicePriority = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityPriorityService.ts";
		$scope.serviceProbability = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityProbabilityService.ts";
		$scope.serviceStatus = "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityStatusService.ts";
		$scope.serviceCurrency = "/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Opportunity", `Unable to create Opportunity: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Opportunity", "Opportunity successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Opportunity", `Unable to update Opportunity: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Opportunity", "Opportunity successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};

	}]);