angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Quotation/QuotationService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Quotation successfully created';
		let propertySuccessfullyUpdated = 'Quotation successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Quotation Details',
			create: 'Create Quotation',
			update: 'Update Quotation'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadSelect', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATION)' });
			$scope.formHeaders.create = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATION)' });
			$scope.formHeaders.update = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadUpdate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATION)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATION)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATION)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.Date) {
				params.entity.Date = new Date(params.entity.Date);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsOwner = params.optionsOwner;
			$scope.optionsCustomer = params.optionsCustomer;
			$scope.optionsCurrency = params.optionsCurrency;
			$scope.optionsOpportunity = params.optionsOpportunity;
			$scope.optionsStatus = params.optionsStatus;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-opportunities.Quotation.Quotation.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.QUOTATION'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATION)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-opportunities.Quotation.Quotation.entityUpdated', data: response.data });
				$scope.cancel();
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.QUOTATION'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToUpdate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATION)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceOwner = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		
		$scope.optionsOwner = [];
		
		$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts').then((response) => {
			$scope.optionsOwner = response.data.map(e => ({
				value: e.Id,
				text: e.FirstName
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Owner',
				message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceCustomer = '/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts';
		
		$scope.optionsCustomer = [];
		
		$http.get('/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts').then((response) => {
			$scope.optionsCustomer = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Customer',
				message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts';
		
		$scope.optionsCurrency = [];
		
		$http.get('/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts').then((response) => {
			$scope.optionsCurrency = response.data.map(e => ({
				value: e.Id,
				text: e.Code
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Currency',
				message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceOpportunity = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityService.ts';
		
		$scope.optionsOpportunity = [];
		
		$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityService.ts').then((response) => {
			$scope.optionsOpportunity = response.data.map(e => ({
				value: e.Id,
				text: e.Number
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Opportunity',
				message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceStatus = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/QuotationStatusService.ts';
		
		$scope.optionsStatus = [];
		
		$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/QuotationStatusService.ts').then((response) => {
			$scope.optionsStatus = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Status',
				message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

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
			Dialogs.closeWindow({ id: 'Quotation-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});