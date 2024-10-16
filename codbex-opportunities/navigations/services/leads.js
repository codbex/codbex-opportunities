const navigationData = {
    id: 'leads-navigation',
    label: "Leads",
    view: "leads",
    group: "opportunity",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Lead/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }