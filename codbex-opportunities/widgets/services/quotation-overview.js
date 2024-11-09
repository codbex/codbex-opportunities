const widgetData = {
    id: 'quotation-overview',
    label: 'QuotationOverview',
    link: '/services/web/codbex-opportunities/widgets/subviews/quotation-overview.html',
    lazyLoad: true,
    size: "medium"
};

function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}

export { getWidget }