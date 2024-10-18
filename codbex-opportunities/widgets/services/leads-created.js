const widgetData = {
    id: 'leads-created',
    label: 'Leads Created',
    link: '/services/web/codbex-opportunities/widgets/subviews/leads-created.html',
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