const widgetData = {
    id: 'leads-pipeline',
    label: 'Leads Pipeline',
    link: '/services/web/codbex-opportunities/widgets/subviews/leads-pipeline.html',
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