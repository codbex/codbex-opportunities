import { OpportunityRepository as OpportunityDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityRepository";
import { LeadRepository as LeadDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Lead/LeadRepository";
import { QuotationRepository as QuotationDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Quotation/QuotationRepository";

import { Controller, Get } from "sdk/http";
import { query } from "sdk/db";

@Controller
class OpportunityService {

    private readonly opportunityDao;
    private readonly leadDao;
    private readonly quotationDao;

    constructor() {
        this.opportunityDao = new OpportunityDao();
        this.leadDao = new LeadDao();
        this.quotationDao = new QuotationDao();
    }

    @Get("/LeadData")
    public LeadData() {
        let allLeads = this.leadDao.findAll();

        return {
            allLeads: allLeads
        };
    }

    @Get("/OpportunityData")
    public OpportunityData() {
        let allOpportunities = this.opportunityDao.findAll();

        return {
            allOpportunities: allOpportunities
        };
    }

    @Get("/QuotationData")
    public QuotationData() {
        let allQuotations = this.quotationDao.findAll();

        return {
            allQuotations: allQuotations
        };
    }

}