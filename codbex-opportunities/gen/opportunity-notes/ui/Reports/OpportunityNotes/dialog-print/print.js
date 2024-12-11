const viewData = {
    id: 'codbex-opportunities-Reports-OpportunityNotes-print',
    label: 'Print',
    link: '/services/web/codbex-opportunities/gen/opportunity-notes/ui/Reports/OpportunityNotes/dialog-print/index.html',
    perspective: 'Reports',
    view: 'OpportunityNotes',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}