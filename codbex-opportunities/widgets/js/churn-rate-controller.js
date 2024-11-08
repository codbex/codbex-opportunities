angular.module('churn-rate', ['ideUI', 'ideView'])
    .controller('ChurnRate', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        let lineGraphs = {};

        const opportunityServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/OpportunityData";
        $http.get(opportunityServiceUrl)
            .then(function (response) {
                let allOpportunities = response.data.allOpportunities;

                let currentDate = new Date();
                let churnRates = [];
                let months = [];

                // Loop through the last 6 months
                for (let i = 0; i < 6; i++) {
                    let date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                    let month = date.getMonth();
                    let year = date.getFullYear();
                    let monthName = date.toLocaleString('default', { month: 'long' });

                    let monthlyOpportunities = allOpportunities.filter(function (opportunity) {
                        let opportunityCreationDate = new Date(opportunity.Date);
                        return opportunityCreationDate.getMonth() === month && opportunityCreationDate.getFullYear() === year;
                    });

                    if (monthlyOpportunities.length > 0) {
                        const closedOpportunities = monthlyOpportunities.filter(opportunity => opportunity.Status === 2).length;
                        const churnRate = (closedOpportunities / monthlyOpportunities.length) * 100;
                        churnRates.unshift(churnRate);
                    } else {
                        churnRates.unshift(0);
                    }

                    months.unshift(monthName);
                }

                const data = {
                    labels: months,
                    datasets: [
                        {
                            label: 'Monthly Churn Rate (%)',
                            data: churnRates,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.1
                        }
                    ]
                };

                setupLineGraph('churnRateGraph', data);
            })
            .catch(function (error) {
                $scope.state.error = true;
                $scope.state.isBusy = false;
                console.error('Error fetching leads:', error);
            })
            .finally(function () {
                $scope.state.isBusy = false;
            });

        function setupLineGraph(graphElementId, data) {
            if (lineGraphs[graphElementId]) {
                lineGraphs[graphElementId].destroy();
            }

            const lineGraphOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Churn Rate'
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Churn Rate (%)'
                        },
                        beginAtZero: true
                    }
                }
            };

            const lineChartCtx = document.getElementById(graphElementId).getContext('2d');
            lineGraphs[graphElementId] = new Chart(lineChartCtx, {
                type: 'line',
                data: data,
                options: lineGraphOptions
            });
        }
    }]);
