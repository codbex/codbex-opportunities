angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Opportunity successfully created';
		let propertySuccessfullyUpdated = 'Opportunity successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Opportunity Details',
			create: 'Create Opportunity',
			update: 'Update Opportunity'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadSelect', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITY)' });
			$scope.formHeaders.create = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITY)' });
			$scope.formHeaders.update = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.formHeadUpdate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITY)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITY)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITY)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-opportunities-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'Opportunity' && e.view === 'Opportunity' && e.type === 'entity');
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
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Opportunity.Opportunity.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsCustomer = [];
				$scope.optionsCurrency = [];
				$scope.optionsLead = [];
				$scope.optionsOwner = [];
				$scope.optionsType = [];
				$scope.optionsPriority = [];
				$scope.optionsProbability = [];
				$scope.optionsStatus = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Opportunity.Opportunity.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				$scope.entity = data.entity;
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsLead = data.optionsLead;
				$scope.optionsOwner = data.optionsOwner;
				$scope.optionsType = data.optionsType;
				$scope.optionsPriority = data.optionsPriority;
				$scope.optionsProbability = data.optionsProbability;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Opportunity.Opportunity.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsLead = data.optionsLead;
				$scope.optionsOwner = data.optionsOwner;
				$scope.optionsType = data.optionsType;
				$scope.optionsPriority = data.optionsPriority;
				$scope.optionsProbability = data.optionsProbability;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Opportunity.Opportunity.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				$scope.entity = data.entity;
				$scope.optionsCustomer = data.optionsCustomer;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsLead = data.optionsLead;
				$scope.optionsOwner = data.optionsOwner;
				$scope.optionsType = data.optionsType;
				$scope.optionsPriority = data.optionsPriority;
				$scope.optionsProbability = data.optionsProbability;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'update';
			});
		}});

		$scope.serviceCustomer = '/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts';
		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts';
		$scope.serviceLead = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadService.ts';
		$scope.serviceOwner = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		$scope.serviceType = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityTypeService.ts';
		$scope.servicePriority = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityPriorityService.ts';
		$scope.serviceProbability = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityProbabilityService.ts';
		$scope.serviceStatus = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityStatusService.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-opportunities.Opportunity.Opportunity.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-opportunities.Opportunity.Opportunity.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITY'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITY'),
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITY)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-opportunities.Opportunity.Opportunity.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-opportunities.Opportunity.Opportunity.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITY'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITY'),
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToCreate', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITY)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-opportunities.Opportunity.Opportunity.clearDetails');
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
		$scope.createLead = () => {
			Dialogs.showWindow({
				id: 'Lead-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
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
		$scope.createType = () => {
			Dialogs.showWindow({
				id: 'OpportunityType-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createPriority = () => {
			Dialogs.showWindow({
				id: 'OpportunityPriority-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createProbability = () => {
			Dialogs.showWindow({
				id: 'OpportunityProbability-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createStatus = () => {
			Dialogs.showWindow({
				id: 'OpportunityStatus-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

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
		$scope.refreshLead = () => {
			$scope.optionsLead = [];
			$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadService.ts').then((response) => {
				$scope.optionsLead = response.data.map(e => ({
					value: e.Id,
					text: e.Number
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Lead',
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
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
		$scope.refreshType = () => {
			$scope.optionsType = [];
			$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityTypeService.ts').then((response) => {
				$scope.optionsType = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Type',
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshPriority = () => {
			$scope.optionsPriority = [];
			$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityPriorityService.ts').then((response) => {
				$scope.optionsPriority = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Priority',
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshProbability = () => {
			$scope.optionsProbability = [];
			$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityProbabilityService.ts').then((response) => {
				$scope.optionsProbability = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Probability',
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshStatus = () => {
			$scope.optionsStatus = [];
			$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/OpportunityStatusService.ts').then((response) => {
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