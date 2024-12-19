const navigationData = {
    id: 'action-types-navigation',
    label: "Action Types",
    group: "reference data",
    order: 3600,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Settings/ActionTypes/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }