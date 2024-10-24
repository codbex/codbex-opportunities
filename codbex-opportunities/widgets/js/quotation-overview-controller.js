angular.module('quotation-overview', ['ideUI', 'ideView'])
    .controller('QuotationOverview', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.today = new Date().toDateString();

        const opportunityServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/QuotationData";
        $http.get(opportunityServiceUrl)
            .then(function (response) {
                let allQuotations = response.data.allQuotations;
            })
            .catch(function (error) {
                $scope.state.error = true;
                $scope.state.isBusy = false;
                console.error('Error fetching quotations:', error);
            })
            .finally(function () {
                $scope.state.isBusy = false;
            });
    }]);