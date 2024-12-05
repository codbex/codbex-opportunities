const widgetData = {
    id: 'customer-retention-rate',
    label: 'Customer Retention Rate',
    link: '/services/web/codbex-opportunities/widgets/customer-retention-rate/index.html',
    redirectViewId: 'opportunities-navigation',
    size: "small"
};

function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}

export { getWidget }