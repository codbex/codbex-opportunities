const navigationData = {
    id: 'lead-status-navigation',
    label: "Lead Status",
    group: "reference data",
    order: 3100,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Settings/LeadStatus/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }