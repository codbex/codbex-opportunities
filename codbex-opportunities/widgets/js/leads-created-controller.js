angular.module('leads-created', ['ideUI', 'ideView'])
    .controller('LeadsCreated', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.today = new Date().toDateString();

        const leadServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/LeadData";
        $http.get(leadServiceUrl)
            .then(function (response) {
                $scope.totalLeads = response.data.totalLeads;
            });
    }]);