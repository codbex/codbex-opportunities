const widgetData = {
    id: 'churn-rate',
    label: 'Churn Rate',
    link: '/services/web/codbex-opportunities/widgets/churn-rate/index.html',
    redirectViewId: 'opportunities-navigation',
    size: "medium"
};

function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}

export { getWidget }