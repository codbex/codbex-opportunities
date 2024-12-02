const viewData = {
    id: 'codbex-opportunities-Reports-OpportunityPipeline-print',
    label: 'Print',
    link: '/services/web/codbex-opportunities/gen/opportunity-pipeline/ui/Reports/OpportunityPipeline/dialog-print/index.html',
    perspective: 'Reports',
    view: 'OpportunityPipeline',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}