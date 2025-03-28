const navigationData = {
    id: 'quotation-status',
    label: "Quotation Status",
    group: "reference data",
    order: 3600,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Settings/QuotationStatus/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }