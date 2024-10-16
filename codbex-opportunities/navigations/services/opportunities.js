const navigationData = {
    id: 'opportunities-navigation',
    label: "Opportunities",
    view: "opportunities",
    group: "opportunity",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Opportunity/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }