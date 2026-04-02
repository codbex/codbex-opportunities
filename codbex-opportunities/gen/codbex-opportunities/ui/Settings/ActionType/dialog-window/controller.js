angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/ActionTypeService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'ActionType successfully created';
		let propertySuccessfullyUpdated = 'ActionType successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'ActionType Details',
			create: 'Create ActionType',
			update: 'Update ActionType'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadSelect', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONTYPE)' });
			$scope.formHeaders.create = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONTYPE)' });
			$scope.formHeaders.update = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadUpdate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONTYPE)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONTYPE)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONTYPE)' });
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
				Dialogs.postMessage({ topic: 'codbex-opportunities.Settings.ActionType.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.ACTIONTYPE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONTYPE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-opportunities.Settings.ActionType.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.ACTIONTYPE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToUpdate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.ACTIONTYPE)', message: message });
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
			Dialogs.closeWindow({ id: 'ActionType-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});