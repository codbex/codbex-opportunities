angular.module('open-opportunities', ['ideUI', 'ideView'])
    .controller('OpenOpportunities', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.today = new Date().toDateString();

        const leadServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/OpportunityData";
        $http.get(leadServiceUrl)
            .then(function (response) {
                $scope.totalOpportunities = response.data.totalOpportunities;
            });
    }]);