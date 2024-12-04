const navigationData = {
    id: 'quotations-navigation',
    label: "Quotations",
    group: "opportunity",
    orderNumber: 300,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Quotation/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }