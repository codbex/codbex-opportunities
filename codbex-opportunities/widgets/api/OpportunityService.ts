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
        let leadsNum = this.leadDao.count();

        return {
            totalLeads: leadsNum
        };
    }

    @Get("/OpportunityData")
    public OpportunityData() {
        let opportunityNum = this.opportunityDao.count();

        return {
            totalOpportunities: opportunityNum
        };
    }

    @Get("/QuotationData")
    public QuotationData() {
        let quotationNum = this.quotationDao.count();

        return {
            totalQuotation: quotationNum
        };
    }

}