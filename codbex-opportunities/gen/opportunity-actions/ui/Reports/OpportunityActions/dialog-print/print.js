const viewData = {
    id: 'codbex-opportunities-Reports-OpportunityActions-print',
    label: 'Print',
    link: '/services/web/codbex-opportunities/gen/opportunity-actions/ui/Reports/OpportunityActions/dialog-print/index.html',
    perspective: 'Reports',
    view: 'OpportunityActions',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}