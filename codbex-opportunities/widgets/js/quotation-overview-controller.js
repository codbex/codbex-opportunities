angular.module('quotation-overview', ['ideUI', 'ideView'])
    .controller('QuotationOverview', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.today = new Date().toDateString();
        $scope.quotations = [];
        $scope.filteredQuotations = []; // Store filtered quotations
        $scope.projects = [
            { Name: 'Urgent', ID: 0 },
            { Name: 'Low', ID: 3 },
            { Name: '5 Most Recent', ID: 'recent' },
            { Name: '5 Oldest', ID: 'oldest' }
        ];
        $scope.selectedProject = '';

        const opportunityServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/OpportunityData";
        const quotationServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/QuotationData";

        // Fetch opportunities and quotations
        Promise.all([
            $http.get(opportunityServiceUrl),
            $http.get(quotationServiceUrl)
        ])
            .then(([opportunitiesResponse, quotationsResponse]) => {
                let opportunities = opportunitiesResponse.data.allOpportunities;
                let quotations = quotationsResponse.data.allQuotations;

                // Map opportunities to a dictionary for quick access by ID
                const opportunityMap = {};
                opportunities.forEach(opportunity => {
                    opportunityMap[opportunity.ID] = opportunity.Priority; // Store priority by ID
                });

                // Map quotations with their respective priorities
                $scope.quotations = quotations.map(quotation => ({
                    Number: quotation.Number,
                    Stage: quotation.Status,
                    Gross: quotation.Total,
                    Date: new Date(quotation.Date),
                    Priority: opportunityMap[quotation.Opportunity] || 'Unknown' // Get priority from opportunity
                }));

                // Set the initial filtered quotations to display all
                $scope.filteredQuotations = $scope.quotations;
            })
            .catch(error => {
                $scope.state.error = true;
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                $scope.state.isBusy = false;
            });

        // Filter quotations based on selected criteria
        $scope.filterDeliverableByProject = function (selectedProject) {
            if (!selectedProject) {
                $scope.filteredQuotations = $scope.quotations;
                return;
            }

            const criterionID = selectedProject.ID;

            if (criterionID === 0 || criterionID === 3) {
                // Filter by priority based on the ID
                $scope.filteredQuotations = $scope.quotations
                    .filter(quotation => quotation.Priority === criterionID)
                    .slice(0, 5); // Limit to 5 results
            }

            else if (criterionID === 'recent') {
                // Sort by date descending and take the latest 5
                $scope.filteredQuotations = $scope.quotations
                    .sort((a, b) => b.Date - a.Date)
                    .slice(0, 5);
            }

            else if (criterionID === 'oldest') {
                // Sort by date ascending and take the oldest 5
                $scope.filteredQuotations = $scope.quotations
                    .sort((a, b) => a.Date - b.Date)
                    .slice(0, 5);
            }

            else {
                $scope.filteredQuotations = $scope.quotations;
            }
        };
    }]);
