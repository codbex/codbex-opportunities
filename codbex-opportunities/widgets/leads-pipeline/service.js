const widgetData = {
    id: 'leads-pipeline-widget',
    label: 'Leads Pipeline',
    link: '/services/web/codbex-opportunities/widgets/leads-pipeline/index.html',
    redirectViewId: 'leads-navigation',
    size: "medium"
};

function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}

export { getWidget }