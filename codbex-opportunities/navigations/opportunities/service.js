const navigationData = {
    id: 'opportunities-navigation',
    label: "Opportunities",
    group: "opportunities",
    order: 200,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Opportunity/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }