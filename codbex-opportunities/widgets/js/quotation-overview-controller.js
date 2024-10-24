angular.module('quotation-overview', ['ideUI', 'ideView'])
    .controller('QuotationOverview', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.today = new Date().toDateString();
        $scope.quotations = [];
        const opportunityServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/QuotationData";

        $http.get(opportunityServiceUrl)
            .then(function (response) {
                let allQuotations = response.data.allQuotations;

                $scope.quotations = allQuotations.map(function (quotation) {
                    return {
                        Number: quotation.Number,
                        Stage: quotation.Status,
                        Gross: quotation.Total
                    };
                });
            })
            .catch(function (error) {
                $scope.state.error = true;
                console.error('Error fetching quotations:', error);
            })
            .finally(function () {
                $scope.state.isBusy = false;
            });
    }]);
