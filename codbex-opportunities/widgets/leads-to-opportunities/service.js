const widgetData = {
    id: 'leads-to-opportunities-widget',
    label: 'Leads Converted to Opportunities',
    link: '/services/web/codbex-opportunities/widgets/leads-to-opportunities/index.html',
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