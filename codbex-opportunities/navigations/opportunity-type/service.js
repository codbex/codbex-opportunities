const navigationData = {
    id: 'opportunity-type',
    label: "Opportunity Type",
    group: "reference data",
    order: 3400,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Settings/OpportunityType/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }