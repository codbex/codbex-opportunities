const widgetData = {
    id: 'leads-to-opportunities',
    label: 'Leads Converted to Opportunities',
    link: '/services/web/codbex-opportunities/widgets/subviews/leads-to-opportunities.html',
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