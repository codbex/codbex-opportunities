angular.module('quota-attainment', ['ideUI', 'ideView'])
    .controller('QuotaAttainment', ['$scope', '$http', function ($scope, $http) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.today = new Date().toDateString();

        const leadServiceUrl = "/services/ts/codbex-opportunities/widgets/api/OpportunityService.ts/QuotationData";
        $http.get(leadServiceUrl)
            .then(function (response) {
                let allQuotations = response.data.allQuotations;

                let currentDate = new Date();
                let currentMonth = currentDate.getMonth();
                let currentYear = currentDate.getFullYear();

                let monthlyQuotations = allQuotations.filter(function (lead) {
                    let leadCreationDate = new Date(lead.Date);
                    return leadCreationDate.getMonth() === currentMonth && leadCreationDate.getFullYear() === currentYear;
                });

                let monthlyQuotationsApproved = monthlyQuotations.filter(quotation => quotation.Status === 3).length;

                let quotaAttainment = (monthlyQuotationsApproved / monthlyQuotations.length) * 100;

                updateGauge(quotaAttainment);
            })
            .catch(function (error) {
                $scope.state.error = true;
                $scope.state.isBusy = false;
                console.error('Error fetching quotations:', error);
            })
            .finally(function () {
                $scope.state.isBusy = false;
            });

        function updateGauge(percent) {
            const gauge = document.querySelector('.gauge .foreground');
            const label = document.querySelector('.gauge .percentage');

            const degrees = (percent / 100) * 180;

            gauge.style.transform = `rotate(${degrees - 180}deg)`;
            label.textContent = `${percent}%`;
        }
    }]);
