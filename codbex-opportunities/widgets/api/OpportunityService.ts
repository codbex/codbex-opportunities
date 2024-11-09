import { OpportunityRepository as OpportunityDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityRepository";
import { LeadRepository as LeadDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Lead/LeadRepository";
import { QuotationRepository as QuotationDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Quotation/QuotationRepository";
import { OpportunityActionRepository as OpportunityActionDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityActionRepository";
import { OpportunityNoteRepository as OpportunityNoteDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityNoteRepository";


import { Controller, Get } from "sdk/http";

@Controller
class OpportunityService {

    private readonly opportunityDao;
    private readonly leadDao;
    private readonly quotationDao;
    private readonly opportunityActionDao;
    private readonly opportunityNoteDao;

    constructor() {
        this.opportunityDao = new OpportunityDao();
        this.leadDao = new LeadDao();
        this.quotationDao = new QuotationDao();
        this.opportunityActionDao = new OpportunityActionDao();
        this.opportunityNoteDao = new OpportunityNoteDao();
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

    @Get("/OpportunityActionData")
    public OpportunityActionData() {
        let allOpportunityActions = this.opportunityActionDao.findAll();

        return {
            allOpportunityActions: allOpportunityActions
        };
    }

    @Get("/OpportunityNoteData")
    public OpportunityNoteData() {
        let allOpportunityNotes = this.opportunityNoteDao.findAll();

        return {
            allOpportunityNotes: allOpportunityNotes
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