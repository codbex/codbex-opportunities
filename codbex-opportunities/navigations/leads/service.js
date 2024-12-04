const navigationData = {
    id: 'leads-navigation',
    label: "Leads",
    group: "opportunities",
    order: 100,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Lead/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }