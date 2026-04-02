angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Quotation/QuotationService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
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

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-opportunities-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'Quotation' && e.view === 'Quotation' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Quotation.Quotation.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsOwner = [];
				$scope.optionsCustomer = [];
				$scope.optionsCurrency = [];
				$scope.optionsOpportunity = [];
				$scope.optionsStatus = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Quotation.Quotation.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				$scope.entity = data.entity;
				$scope.optionsOwner = data.optionsOwner;
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsOpportunity = data.optionsOpportunity;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Quotation.Quotation.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsOwner = data.optionsOwner;
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsOpportunity = data.optionsOpportunity;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Quotation.Quotation.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				$scope.entity = data.entity;
				$scope.optionsOwner = data.optionsOwner;
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsOpportunity = data.optionsOpportunity;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'update';
			});
		}});

		$scope.serviceOwner = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		$scope.serviceCustomer = '/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts';
		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts';
		$scope.serviceOpportunity = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityService.ts';
		$scope.serviceStatus = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/QuotationStatusService.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-opportunities.Quotation.Quotation.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-opportunities.Quotation.Quotation.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.QUOTATION'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.QUOTATION'),
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATION)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-opportunities.Quotation.Quotation.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-opportunities.Quotation.Quotation.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.QUOTATION'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.QUOTATION'),
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATION)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-opportunities.Quotation.Quotation.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createOwner = () => {
			Dialogs.showWindow({
				id: 'Employee-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCustomer = () => {
			Dialogs.showWindow({
				id: 'Customer-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCurrency = () => {
			Dialogs.showWindow({
				id: 'Currency-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createOpportunity = () => {
			Dialogs.showWindow({
				id: 'Opportunity-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createStatus = () => {
			Dialogs.showWindow({
				id: 'QuotationStatus-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshOwner = () => {
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
		};
		$scope.refreshCustomer = () => {
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
		};
		$scope.refreshCurrency = () => {
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
		};
		$scope.refreshOpportunity = () => {
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
		};
		$scope.refreshStatus = () => {
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
		};

		//----------------Dropdowns-----------------//	
	});