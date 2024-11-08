const widgetData = {
    id: 'customer-retention-rate',
    label: 'Customer Retention Rate',
    link: '/services/web/codbex-opportunities/widgets/subviews/customer-retention-rate.html',
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