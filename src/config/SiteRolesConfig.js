/**
Site Roles Config, used in User APIs
**/
const SiteRoles = {
    SITEADMIN: {
        textField: 'Site Admin',
        apiEnumValue: 'SITEADMIN',
        urlValue: 'SiteAdmin',
    },
    SITEMAINTENANCEMGR: {
        textField: 'Site Maintenance Manager',
        apiEnumValue: 'SITEMAINTENANCEMGR',
        urlValue: 'SiteMaintenanceManager',
    },
    SITEMAINTENANCEASSC: {
        textField: 'Site Maintenance Associate',
        apiEnumValue: 'SITEMAINTENANCEASSC',
        urlValue: 'SiteMaintenanceAssociate',
    },
    WHSMEMBER: {
        textField: 'Workplace, Health, and Safety Staff',
        apiEnumValue: 'WHSMEMBER',
        urlValue: 'WorkplaceHealthSafetyMember',
    },
};

export default SiteRoles;
