angular.module('close-rate', ['ideUI', 'ideView'])
    .controller('CloseRate', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        let doughnutCharts = {};

        const leadServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/LeadData";
        $http.get(leadServiceUrl)
            .then(function (response) {
                let allLeads = response.data.allLeads;

                let initialLeads = allLeads.filter(lead => lead.Status === 1).length;
                let openLeads = allLeads.filter(lead => lead.Status === 2).length;
                let contactedLeads = allLeads.filter(lead => lead.Status === 3).length;
                let repliedLeads = allLeads.filter(lead => lead.Status === 4).length;
                let opportunityLeads = allLeads.filter(lead => lead.Status === 5).length;
                let quoteLeads = allLeads.filter(lead => lead.Status === 6).length;
                let lostLeads = allLeads.filter(lead => lead.Status === 7).length;
                let closedLeads = allLeads.filter(lead => lead.Status === 9).length;

                $scope.closeRate = (opportunityLeads / allLeads.length) * 100;

                const closeRateData = {
                    labels: ["Initial", "Open", "Contacted", "Replied", "To Opportunity", "To Quotation", "Lost", "Closed"],
                    datasets: [{
                        data: [
                            initialLeads,
                            openLeads,
                            contactedLeads,
                            repliedLeads,
                            opportunityLeads,
                            quoteLeads,
                            lostLeads,
                            closedLeads
                        ],
                        backgroundColor: ['#36a2eb', '#ff6384', '#ffce56', '#4bc0c0']
                    }]
                };

                setupDoughnutChart("closeRateChart", closeRateData);
            })
            .catch(function (error) {
                $scope.state.error = true;
                console.error('Error fetching leads:', error);
            })
            .finally(function () {
                $scope.state.isBusy = false;
            });

        function setupDoughnutChart(chartElementId, data) {
            if (doughnutCharts[chartElementId]) {
                doughnutCharts[chartElementId].destroy();
            }

            const doughnutOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Lead Distribution'
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            };

            const doughnutChartCtx = document.getElementById(chartElementId).getContext('2d');
            doughnutCharts[chartElementId] = new Chart(doughnutChartCtx, {
                type: 'doughnut',
                data: data,
                options: doughnutOptions
            });
        }
    }]);
