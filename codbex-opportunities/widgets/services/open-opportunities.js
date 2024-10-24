const widgetData = {
    id: 'open-opportunities',
    label: 'Open Opportunities',
    link: '/services/web/codbex-opportunities/widgets/subviews/open-opportunities.html',
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