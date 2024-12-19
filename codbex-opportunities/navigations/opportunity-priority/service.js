const navigationData = {
    id: 'opportunity-priority',
    label: "Opportunity Priority",
    group: "reference data",
    order: 3200,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Settings/OpportunityPriority/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }