const navigationData = {
    id: 'lead-qualification-authority-navigation',
    label: "Lead Qualification Authority",
    group: "reference data",
    order: 2800,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Settings/LeadQualificationAuthority/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }