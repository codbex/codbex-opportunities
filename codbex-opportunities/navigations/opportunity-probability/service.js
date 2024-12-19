const navigationData = {
    id: 'opportunity-probability',
    label: "Opportunity Probability",
    group: "reference data",
    order: 3100,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Settings/OpportunityProbability/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }