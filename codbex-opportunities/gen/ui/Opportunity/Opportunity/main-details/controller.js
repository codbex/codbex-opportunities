angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-opportunities.Opportunity.Opportunity';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-opportunities/gen/api/Opportunity/Opportunity.js";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.entity = {};
		$scope.formHeaders = {
			select: "Opportunity Details",
			create: "Create Opportunity",
			update: "Update Opportunity"
		};
		$scope.formErrors = {};
		$scope.action = 'select';

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.formErrors = {};
				$scope.optionsCustomer = [];
				$scope.optionsCurrency = [];
				$scope.optionsLead = [];
				$scope.optionsType = [];
				$scope.optionsPriority = [];
				$scope.optionsProbability = [];
				$scope.optionsStatus = [];
				$scope.optionsOwner = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				$scope.entity = msg.data.entity;
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsLead = msg.data.optionsLead;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsPriority = msg.data.optionsPriority;
				$scope.optionsProbability = msg.data.optionsProbability;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsLead = msg.data.optionsLead;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsPriority = msg.data.optionsPriority;
				$scope.optionsProbability = msg.data.optionsProbability;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.action = 'create';
				// Set Errors for required fields only
				$scope.formErrors = {
				};
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = msg.data.entity;
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsLead = msg.data.optionsLead;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsPriority = msg.data.optionsPriority;
				$scope.optionsProbability = msg.data.optionsProbability;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOwner = msg.data.optionsOwner;
				$scope.action = 'update';
			});
		});
		//-----------------Events-------------------//

		$scope.isValid = function (isValid, property) {
			$scope.formErrors[property] = !isValid ? true : undefined;
			for (let next in $scope.formErrors) {
				if ($scope.formErrors[next] === true) {
					$scope.isFormValid = false;
					return;
				}
			}
			$scope.isFormValid = true;
		};

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