angular.module('leads-pipeline', ['ideUI', 'ideView'])
    .controller('LeadsPipeline', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        let pipelines = {};

        const leadServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/LeadData";
        $http.get(leadServiceUrl)
            .then(function (response) {
                let allLeads = response.data.allLeads;
                let totalLeads = allLeads.length;

                let initialLeads = allLeads.filter(lead => lead.Status === 1).length;
                let openLeads = allLeads.filter(lead => lead.Status === 2).length;
                let contactedLeads = allLeads.filter(lead => lead.Status === 3).length;
                let repliedLeads = allLeads.filter(lead => lead.Status === 4).length;
                let opportunityLeads = allLeads.filter(lead => lead.Status === 5).length;
                let quoteLeads = allLeads.filter(lead => lead.Status === 6).length;
                let lostLeads = allLeads.filter(lead => lead.Status === 7).length;
                let closedLeads = allLeads.filter(lead => lead.Status === 9).length;

                // $scope.aply(() => {
                $scope.initialRatio = (initialLeads / totalLeads) * 100;
                $scope.openRatio = (openLeads / totalLeads) * 100;
                $scope.contactedRatio = (contactedLeads / totalLeads) * 100;
                $scope.repliedRatio = (repliedLeads / totalLeads) * 100;
                $scope.opportunityRatio = (opportunityLeads / totalLeads) * 100;
                $scope.quoteRatio = (quoteLeads / totalLeads) * 100;
                $scope.lostRatio = (lostLeads / totalLeads) * 100;
                $scope.closedRatio = (closedLeads / totalLeads) * 100;
                // })
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
