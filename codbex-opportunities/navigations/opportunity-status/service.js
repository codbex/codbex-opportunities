const navigationData = {
    id: 'opportunity-status',
    label: "Opportunity Status",
    group: "reference data",
    order: 3300,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Settings/OpportunityStatus/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }