const navigationData = {
    id: 'action-status-navigation',
    label: "Action Status",
    group: "reference data",
    order: 3700,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Settings/ActionStatus/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }