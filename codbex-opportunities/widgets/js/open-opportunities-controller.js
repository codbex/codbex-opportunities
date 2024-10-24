angular.module('open-opportunities', ['ideUI', 'ideView'])
    .controller('OpenOpportunities', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.today = new Date().toDateString();

        const opportunityServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/OpportunityData";
        $http.get(opportunityServiceUrl)
            .then(function (response) {
                let allOpportunities = response.data.allOpportunities;

                let openOpportunities = allOpportunities.filter(opportunity => {
                    return opportunity.Status == 1;
                })

                $scope.totalOpenOpportunities = openOpportunities.length;
            })
            .catch(function (error) {
                $scope.state.error = true;
                $scope.state.isBusy = false;
                console.error('Error fetching opportunities:', error);
            })
            .finally(function () {
                $scope.state.isBusy = false;
            });
    }]);