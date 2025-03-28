const navigationData = {
    id: 'lead-qualification-timeline-navigation',
    label: "Lead Qualification Timeline",
    group: "reference data",
    order: 3000,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Settings/LeadQualificationTimeline/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }