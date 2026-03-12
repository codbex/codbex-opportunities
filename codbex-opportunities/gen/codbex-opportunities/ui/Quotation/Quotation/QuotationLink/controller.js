angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Quotation/QuotationLinkService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete QuotationLink? This action cannot be undone.',
			deleteTitle: 'Delete QuotationLink?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.yes');
			translated.no = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-opportunities:codbex-opportunities-model.defaults.deleteTitle', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATIONLINK)' });
			translated.deleteConfirm = LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.deleteConfirm', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATIONLINK)' });
		});
		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-opportunities-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'Quotation' && e.view === 'QuotationLink' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'Quotation' && e.view === 'QuotationLink' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					selectedMainEntityKey: 'Quotation',
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
					selectedMainEntityKey: 'Quotation',
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
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Quotation.Quotation.entitySelected', handler: (data) => {
			resetPagination();
			$scope.selectedMainEntityId = data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Quotation.Quotation.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Quotation.QuotationLink.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Quotation.QuotationLink.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Quotation.QuotationLink.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-opportunities.Quotation.QuotationLink.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			let Quotation = $scope.selectedMainEntityId;
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
			filter.$filter.equals.Quotation = Quotation;
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
						title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.QUOTATIONLINK'),
						message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLF', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATIONLINK)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.QUOTATIONLINK'),
					message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToCount', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATIONLINK)', message: message }),
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
				id: 'QuotationLink-details',
				params: {
					action: 'select',
					entity: entity,
					optionsQuotation: $scope.optionsQuotation,
					optionsSalesOrder: $scope.optionsSalesOrder,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'QuotationLink-filter',
				params: {
					entity: $scope.filterEntity,
					optionsQuotation: $scope.optionsQuotation,
					optionsSalesOrder: $scope.optionsSalesOrder,
				},
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'QuotationLink-details',
				params: {
					action: 'create',
					entity: {
						'Quotation': $scope.selectedMainEntityId
					},
					selectedMainEntityKey: 'Quotation',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsQuotation: $scope.optionsQuotation,
					optionsSalesOrder: $scope.optionsSalesOrder,
				},
				closeButton: false
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'QuotationLink-details',
				params: {
					action: 'update',
					entity: entity,
					selectedMainEntityKey: 'Quotation',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsQuotation: $scope.optionsQuotation,
					optionsSalesOrder: $scope.optionsSalesOrder,
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
						Dialogs.triggerEvent('codbex-opportunities.Quotation.QuotationLink.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-opportunities:codbex-opportunities-model.t.QUOTATIONLINK'),
							message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToDelete', { name: '$t(codbex-opportunities:codbex-opportunities-model.t.QUOTATIONLINK)', message: message }),
							type: AlertTypes.Error,
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsQuotation = [];
		$scope.optionsSalesOrder = [];


		$http.get('/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Quotation/QuotationService.ts').then((response) => {
			$scope.optionsQuotation = response.data.map(e => ({
				value: e.Id,
				text: e.Number
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Quotation',
				message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-orders/gen/codbex-orders/api/SalesOrder/SalesOrderService.ts').then((response) => {
			$scope.optionsSalesOrder = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'SalesOrder',
				message: LocaleService.t('codbex-opportunities:codbex-opportunities-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsQuotationValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsQuotation.length; i++) {
				if ($scope.optionsQuotation[i].value === optionKey) {
					return $scope.optionsQuotation[i].text;
				}
			}
			return null;
		};
		$scope.optionsSalesOrderValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSalesOrder.length; i++) {
				if ($scope.optionsSalesOrder[i].value === optionKey) {
					return $scope.optionsSalesOrder[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
