const navigationData = {
    id: 'quotations-navigation',
    label: "Quotations",
    view: "quotations",
    group: "opportunity",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Quotation/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }