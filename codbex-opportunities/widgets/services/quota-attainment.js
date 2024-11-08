const widgetData = {
    id: 'quota-attainment',
    label: 'Quota Attainment',
    link: '/services/web/codbex-opportunities/widgets/subviews/quota-attainment.html',
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