angular.module('customer-retention-rate', ['ideUI', 'ideView'])
    .controller('CustomerRetentionRate', ['$scope', '$http', function ($scope, $http) {
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

                let currentDate = new Date();
                let currentMonth = currentDate.getMonth();
                let currentYear = currentDate.getFullYear();

                let monthlyOpportunities = allOpportunities.filter(function (opportunity) {
                    let opportunityCreationDate = new Date(opportunity.Date);
                    return opportunityCreationDate.getMonth() === currentMonth && opportunityCreationDate.getFullYear() === currentYear;
                });


            })
            .catch(function (error) {
                $scope.state.error = true;
                $scope.state.isBusy = false;
                console.error('Error fetching leads:', error);
            })
            .finally(function () {
                $scope.state.isBusy = false;
            });
    }]);
