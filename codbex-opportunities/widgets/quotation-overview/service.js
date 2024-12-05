const widgetData = {
    id: 'quotation-overview-widget',
    label: 'QuotationOverview',
    link: '/services/web/codbex-opportunities/widgets/quotation-overview/index.html',
    redirectViewId: 'quotations-navigation',
    size: "large"
};

function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}

export { getWidget }