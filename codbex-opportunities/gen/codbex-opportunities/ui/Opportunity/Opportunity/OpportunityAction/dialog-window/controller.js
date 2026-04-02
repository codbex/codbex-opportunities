angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityActionService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'OpportunityAction successfully created';
		let propertySuccessfullyUpdated = 'OpportunityAction successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'OpportunityAction Details',
			create: 'Create OpportunityAction',
			update: 'Update OpportunityAction'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadSelect', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYACTION)' });
			$scope.formHeaders.create = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYACTION)' });
			$scope.formHeaders.update = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadUpdate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYACTION)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYACTION)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYACTION)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;

			if (params.entity.Date) {
				params.entity.Date = new Date(params.entity.Date);
			}
			if (params.entity.Due) {
				params.entity.Due = new Date(params.entity.Due);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsOpportunity = params.optionsOpportunity;
			$scope.optionsInitiator = params.optionsInitiator;
			$scope.optionsType = params.optionsType;
			$scope.optionsStatus = params.optionsStatus;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-opportunities.Opportunity.OpportunityAction.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYACTION'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYACTION'),
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYACTION)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-opportunities.Opportunity.OpportunityAction.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYACTION'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYACTION'),
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToUpdate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYACTION)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceOpportunity = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityService.ts';
		$scope.serviceInitiator = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		$scope.serviceType = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/ActionTypeService.ts';
		$scope.serviceStatus = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/ActionStatusService.ts';

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'OpportunityAction-details' });
		};
	});