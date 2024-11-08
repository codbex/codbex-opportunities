const widgetData = {
    id: 'churn-rate',
    label: 'Churn Rate',
    link: '/services/web/codbex-opportunities/widgets/subviews/churn-rate.html',
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