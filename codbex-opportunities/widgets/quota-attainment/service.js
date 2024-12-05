const widgetData = {
    id: 'quota-attainment-widget',
    label: 'Quota Attainment',
    link: '/services/web/codbex-opportunities/widgets/quota-attainment/index.html',
    redirectViewId: 'quotations-navigation',
    size: "small"
};

function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}

export { getWidget }