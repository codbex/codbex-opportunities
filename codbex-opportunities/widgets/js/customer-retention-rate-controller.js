angular.module('customer-retention-rate', ['ideUI', 'ideView'])
    .controller('CustomerRetentionRate', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.today = new Date().toDateString();
        $scope.currentMonth = new Date().getMonth();
        $scope.currentYear = new Date().getFullYear();

        const opportunityServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/OpportunityData";
        const opportunityActionServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/OpportunityActionData";

        $http.get(opportunityServiceUrl)
            .then(function (response) {
                let allOpportunities = response.data.allOpportunities;

                console.log("allOpportunities: ", allOpportunities);

                $scope.lostOpportunities = allOpportunities.filter(function (opportunity) {
                    return opportunity.Status === 2;
                });

                console.log("lostOpportunities: ", $scope.lostOpportunities);

                $scope.activeOpportunities = allOpportunities.filter(function (opportunity) {
                    return opportunity.Status !== 2 && opportunity.Status !== 3;
                });

                console.log("activeOpportunities: ", $scope.activeOpportunities);

                $scope.activeMonthlyOpportunities = $scope.activeOpportunities.filter(opportunity => {
                    let opportunityDate = new Date(opportunity.Date);

                    return opportunityDate.getMonth() === $scope.currentMonth &&
                        opportunityDate.getFullYear() === $scope.currentYear;
                })

                console.log("activeMonthlyOpportunities: ", $scope.activeMonthlyOpportunities);

                return $http.get(opportunityActionServiceUrl);
            })
            .then(function (response) {
                let opportunityActions = response.data.allOpportunityActions;

                console.log("opportunityActions: ", opportunityActions);

                let lostMonthlyOpportunities = $scope.lostOpportunities.filter(function (opportunity) {
                    let actionsForOpportunity = opportunityActions.filter(function (action) {
                        return action.Opportunity === opportunity.Id;
                    });

                    actionsForOpportunity = actionsForOpportunity.filter(function (action) {
                        let actionDate = new Date(action.Date);
                        return actionDate.getMonth() === $scope.currentMonth &&
                            actionDate.getFullYear() === $scope.currentYear;
                    });

                    if (actionsForOpportunity.length > 0) {
                        return {
                            opportunity: opportunity,
                            actions: actionsForOpportunity
                        };
                    }

                    return false;
                });


                let numberOfAllActiveOpportunities = $scope.activeOpportunities.length;
                let numberOfAllActiveOpportunitiesCreatedThisMonth = $scope.activeMonthlyOpportunities.length;
                let numberOfClosedOpportunitiesThisMonth = lostMonthlyOpportunities.length;

                console.log("opportunitiesWithActions: ", lostMonthlyOpportunities);

                console.log("((", numberOfAllActiveOpportunities, " - ", numberOfAllActiveOpportunitiesCreatedThisMonth, ") / (", numberOfAllActiveOpportunities, " + ", numberOfClosedOpportunitiesThisMonth);

                $scope.customerRetentionRate = ((numberOfAllActiveOpportunities - numberOfAllActiveOpportunitiesCreatedThisMonth) /
                    (numberOfAllActiveOpportunities - numberOfAllActiveOpportunitiesCreatedThisMonth + numberOfClosedOpportunitiesThisMonth)) * 100;

            })
            .catch(function (error) {
                $scope.state.error = true;
                $scope.state.isBusy = false;
                console.error('Error fetching data:', error);
            })
            .finally(function () {
                $scope.state.isBusy = false;
            });
    }]);
