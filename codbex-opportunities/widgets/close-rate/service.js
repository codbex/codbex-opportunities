const widgetData = {
    id: 'close-rate-widget',
    label: 'Close Rate',
    link: '/services/web/codbex-opportunities/widgets/close-rate/index.html',
    redirectViewId: 'leads-navigation',
    size: "large"
};

function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}

export { getWidget }