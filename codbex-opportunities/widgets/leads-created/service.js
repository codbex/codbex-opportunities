const widgetData = {
    id: 'leads-created-widget',
    label: 'Leads Created',
    link: '/services/web/codbex-opportunities/widgets/leads-created/index.html',
    redirectViewId: 'leads-navigation',
    size: "small"
};

function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}

export { getWidget }