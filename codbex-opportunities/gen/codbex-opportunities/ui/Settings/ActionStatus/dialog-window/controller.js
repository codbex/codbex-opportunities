angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/ActionStatusService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'ActionStatus successfully created';
		let propertySuccessfullyUpdated = 'ActionStatus successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'ActionStatus Details',
			create: 'Create ActionStatus',
			update: 'Update ActionStatus'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadSelect', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONSTATUS)' });
			$scope.formHeaders.create = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONSTATUS)' });
			$scope.formHeaders.update = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadUpdate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONSTATUS)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONSTATUS)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONSTATUS)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-opportunities.Settings.ActionStatus.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.ACTIONSTATUS'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONSTATUS)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-opportunities.Settings.ActionStatus.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.ACTIONSTATUS'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToUpdate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONSTATUS)', message: message });
				});
				console.error('EntityService:', error);
			});
		};


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
			Dialogs.closeWindow({ id: 'ActionStatus-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});