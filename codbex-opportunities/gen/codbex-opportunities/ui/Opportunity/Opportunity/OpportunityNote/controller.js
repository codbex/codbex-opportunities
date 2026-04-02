angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityNoteService.ts';
	}])
	.controller('PageController', ($scope, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete OpportunityNote? This action cannot be undone.',
			deleteTitle: 'Delete OpportunityNote?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.yes');
			translated.no = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.deleteTitle', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYNOTE)' });
			translated.deleteConfirm = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.deleteConfirm', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYNOTE)' });
		});
		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-opportunities-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'Opportunity' && e.view === 'OpportunityNote' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'Opportunity' && e.view === 'OpportunityNote' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					selectedMainEntityKey: 'Opportunity',
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
					selectedMainEntityKey: 'Opportunity',
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
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Opportunity.Opportunity.entitySelected', handler: (data) => {
			resetPagination();
			$scope.selectedMainEntityId = data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Opportunity.Opportunity.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Opportunity.OpportunityNote.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Opportunity.OpportunityNote.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Opportunity.OpportunityNote.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Opportunity.OpportunityNote.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			let Opportunity = $scope.selectedMainEntityId;
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
			filter.$filter.equals.Opportunity = Opportunity;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				filter.$offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				EntityService.search(filter).then((response) => {
					response.data.forEach(e => {
						if (e.Timestamp) {
							e.Timestamp = new Date(e.Timestamp);
						}
					});

					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYNOTE'),
						message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLF', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYNOTE)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYNOTE'),
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToCount', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYNOTE)', message: message }),
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
				id: 'OpportunityNote-details',
				params: {
					action: 'select',
					entity: entity,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'OpportunityNote-filter',
				params: {
					entity: $scope.filterEntity,
				},
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'OpportunityNote-details',
				params: {
					action: 'create',
					entity: {
						'Opportunity': $scope.selectedMainEntityId
					},
					selectedMainEntityKey: 'Opportunity',
					selectedMainEntityId: $scope.selectedMainEntityId,
				},
				closeButton: false
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'OpportunityNote-details',
				params: {
					action: 'update',
					entity: entity,
					selectedMainEntityKey: 'Opportunity',
					selectedMainEntityId: $scope.selectedMainEntityId,
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
						Dialogs.triggerEvent('codbex-opportunities.Opportunity.OpportunityNote.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYNOTE'),
							message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToDelete', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.OPPORTUNITYNOTE)', message: message }),
							type: AlertTypes.Error,
						});
						console.error('EntityService:', error);
					});
				}
			});
		};
	});
