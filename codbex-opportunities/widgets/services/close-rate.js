const widgetData = {
    id: 'close-rate',
    label: 'Close Rate',
    link: '/services/web/codbex-opportunities/widgets/subviews/close-rate.html',
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