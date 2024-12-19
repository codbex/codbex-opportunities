const navigationData = {
    id: 'lead-qualification-need-navigation',
    label: "Lead Qualification Need",
    group: "reference data",
    order: 2700,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Settings/LeadQualificationNeed/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }