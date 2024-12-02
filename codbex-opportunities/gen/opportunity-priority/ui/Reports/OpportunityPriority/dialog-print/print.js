const viewData = {
    id: 'codbex-opportunities-Reports-OpportunityPriority-print',
    label: 'Print',
    link: '/services/web/codbex-opportunities/gen/opportunity-priority/ui/Reports/OpportunityPriority/dialog-print/index.html',
    perspective: 'Reports',
    view: 'OpportunityPriority',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}