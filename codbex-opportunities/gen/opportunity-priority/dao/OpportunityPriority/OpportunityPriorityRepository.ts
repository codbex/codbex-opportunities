import { Query, NamedQueryParameter } from "sdk/db";

export interface OpportunityPriority {
    readonly 'Priority': string;
    readonly 'Total Opportunities': number;
    readonly 'Total Amount': number;
    readonly 'Currency': string;
}

export interface OpportunityPriorityFilter {
}

export interface OpportunityPriorityPaginatedFilter extends OpportunityPriorityFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class OpportunityPriorityRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: OpportunityPriorityPaginatedFilter): OpportunityPriority[] {
        const sql = `
            SELECT OpportunityPriority.OPPORTUNITYPRIORITY_NAME as "Priority", COUNT(Opportunity.OPPORTUNITY_ID) as "Total Opportunities", SUM(Opportunity.OPPORTUNITY_AMOUNT) as "Total Amount", Currency.CURRENCY_CODE as "Currency"
            FROM CODBEX_OPPORTUNITYPRIORITY as OpportunityPriority
              INNER JOIN CODBEX_CURRENCY Currency ON Opportunity.OPPORTUNITY_CURRENCY = Currency.CURRENCY_ID
              INNER JOIN CODBEX_OPPORTUNITY Opportunity ON OpportunityPriority.OPPORTUNITYPRIORITY_ID = Opportunity.OPPORTUNITY_PRIORITY
            GROUP BY OpportunityPriority.OPPORTUNITYPRIORITY_NAME
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: OpportunityPriorityFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT OpportunityPriority.OPPORTUNITYPRIORITY_NAME as "Priority", COUNT(Opportunity.OPPORTUNITY_ID) as "Total Opportunities", SUM(Opportunity.OPPORTUNITY_AMOUNT) as "Total Amount", Currency.CURRENCY_CODE as "Currency"
                FROM CODBEX_OPPORTUNITYPRIORITY as OpportunityPriority
                  INNER JOIN CODBEX_CURRENCY Currency ON Opportunity.OPPORTUNITY_CURRENCY = Currency.CURRENCY_ID
                  INNER JOIN CODBEX_OPPORTUNITY Opportunity ON OpportunityPriority.OPPORTUNITYPRIORITY_ID = Opportunity.OPPORTUNITY_PRIORITY
                GROUP BY OpportunityPriority.OPPORTUNITYPRIORITY_NAME
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}