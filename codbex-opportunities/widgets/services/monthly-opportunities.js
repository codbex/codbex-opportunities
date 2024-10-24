const widgetData = {
    id: 'monthly-opportunities',
    label: 'Monthly Opportunities',
    link: '/services/web/codbex-opportunities/widgets/subviews/monthly-opportunities.html',
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