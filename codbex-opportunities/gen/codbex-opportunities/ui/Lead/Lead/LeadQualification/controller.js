angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadQualificationService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete LeadQualification? This action cannot be undone.',
			deleteTitle: 'Delete LeadQualification?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.yes');
			translated.no = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.deleteTitle', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.LEADQUALIFICATION)' });
			translated.deleteConfirm = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.deleteConfirm', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.LEADQUALIFICATION)' });
		});
		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-opportunities-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'Lead' && e.view === 'LeadQualification' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'Lead' && e.view === 'LeadQualification' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					selectedMainEntityKey: 'Lead',
					selectedMainEntityId: $scope.selectedMainEntityId,
				},
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id,
					selectedMainEntityKey: 'Lead',
					selectedMainEntityId: $scope.selectedMainEntityId,
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Lead.Lead.entitySelected', handler: (data) => {
			resetPagination();
			$scope.selectedMainEntityId = data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Lead.Lead.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Lead.LeadQualification.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Lead.LeadQualification.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Lead.LeadQualification.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Lead.LeadQualification.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			let Lead = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			if (!filter.$filter) {
				filter.$filter = {};
			}
			if (!filter.$filter.equals) {
				filter.$filter.equals = {};
			}
			filter.$filter.equals.Lead = Lead;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				filter.$offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				EntityService.search(filter).then((response) => {
					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.LEADQUALIFICATION'),
						message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLF', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.LEADQUALIFICATION)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.LEADQUALIFICATION'),
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToCount', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.LEADQUALIFICATION)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.showWindow({
				id: 'LeadQualification-details',
				params: {
					action: 'select',
					entity: entity,
					optionsAuthority: $scope.optionsAuthority,
					optionsNeed: $scope.optionsNeed,
					optionsTimeline: $scope.optionsTimeline,
					optionsLead: $scope.optionsLead,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'LeadQualification-filter',
				params: {
					entity: $scope.filterEntity,
					optionsAuthority: $scope.optionsAuthority,
					optionsNeed: $scope.optionsNeed,
					optionsTimeline: $scope.optionsTimeline,
					optionsLead: $scope.optionsLead,
				},
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'LeadQualification-details',
				params: {
					action: 'create',
					entity: {
						'Lead': $scope.selectedMainEntityId
					},
					selectedMainEntityKey: 'Lead',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsAuthority: $scope.optionsAuthority,
					optionsNeed: $scope.optionsNeed,
					optionsTimeline: $scope.optionsTimeline,
					optionsLead: $scope.optionsLead,
				},
				closeButton: false
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'LeadQualification-details',
				params: {
					action: 'update',
					entity: entity,
					selectedMainEntityKey: 'Lead',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsAuthority: $scope.optionsAuthority,
					optionsNeed: $scope.optionsNeed,
					optionsTimeline: $scope.optionsTimeline,
					optionsLead: $scope.optionsLead,
			},
				closeButton: false
			});
		};

		$scope.deleteEntity = (entity) => {
			let id = entity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-opportunities.Lead.LeadQualification.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.LEADQUALIFICATION'),
							message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToDelete', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.LEADQUALIFICATION)', message: message }),
							type: AlertTypes.Error,
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsAuthority = [];
		$scope.optionsNeed = [];
		$scope.optionsTimeline = [];
		$scope.optionsLead = [];


		$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadQualificationAuthorityService.ts').then((response) => {
			$scope.optionsAuthority = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Authority',
				message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadQualificationNeedService.ts').then((response) => {
			$scope.optionsNeed = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Need',
				message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Settings/LeadQualificationTimelineService.ts').then((response) => {
			$scope.optionsTimeline = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Timeline',
				message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Lead/LeadService.ts').then((response) => {
			$scope.optionsLead = response.data.map(e => ({
				value: e.Id,
				text: e.Name
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

		$scope.optionsAuthorityValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsAuthority.length; i++) {
				if ($scope.optionsAuthority[i].value === optionKey) {
					return $scope.optionsAuthority[i].text;
				}
			}
			return null;
		};
		$scope.optionsNeedValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsNeed.length; i++) {
				if ($scope.optionsNeed[i].value === optionKey) {
					return $scope.optionsNeed[i].text;
				}
			}
			return null;
		};
		$scope.optionsTimelineValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsTimeline.length; i++) {
				if ($scope.optionsTimeline[i].value === optionKey) {
					return $scope.optionsTimeline[i].text;
				}
			}
			return null;
		};
		$scope.optionsLeadValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsLead.length; i++) {
				if ($scope.optionsLead[i].value === optionKey) {
					return $scope.optionsLead[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
