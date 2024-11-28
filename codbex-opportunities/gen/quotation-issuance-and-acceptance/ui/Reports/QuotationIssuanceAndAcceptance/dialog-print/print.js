const viewData = {
    id: 'codbex-opportunities-Reports-QuotationIssuanceAndAcceptance-print',
    label: 'Print',
    link: '/services/web/codbex-opportunities/gen/quotation-issuance-and-acceptance/ui/Reports/QuotationIssuanceAndAcceptance/dialog-print/index.html',
    perspective: 'Reports',
    view: 'QuotationIssuanceAndAcceptance',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}