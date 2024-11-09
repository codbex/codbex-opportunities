angular.module('leads-to-opportunities', ['ideUI', 'ideView'])
    .controller('LeadsToOpportunities', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.today = new Date().toDateString();

        const leadServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/LeadData";
        $http.get(leadServiceUrl)
            .then(function (response) {
                let allLeads = response.data.allLeads;

                let currentDate = new Date();
                let currentMonth = currentDate.getMonth();
                let currentYear = currentDate.getFullYear();

                let monthlyLeads = allLeads.filter(function (lead) {
                    let leadCreationDate = new Date(lead.Date);
                    return leadCreationDate.getMonth() === currentMonth && leadCreationDate.getFullYear() === currentYear;
                });

                let leadsToOpportunities = monthlyLeads.filter(lead => {
                    return lead.Status == 5;
                })

                $scope.totalLeadsToOpportunities = leadsToOpportunities.length;
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