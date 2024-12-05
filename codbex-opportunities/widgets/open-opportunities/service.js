const widgetData = {
    id: 'open-opportunities-widget',
    label: 'Open Opportunities',
    link: '/services/web/codbex-opportunities/widgets/open-opportunities/index.html',
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