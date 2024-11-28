import { Query, NamedQueryParameter } from "sdk/db";

export interface OpportunityActions {
    readonly 'Id': number;
    readonly 'Name': string;
    readonly 'Date': Date;
    readonly 'Note': string;
    readonly 'Type': string;
    readonly 'Status': string;
}

export interface OpportunityActionsFilter {
}

export interface OpportunityActionsPaginatedFilter extends OpportunityActionsFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class OpportunityActionsRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: OpportunityActionsPaginatedFilter): OpportunityActions[] {
        const sql = `
            SELECT Opportunity.OPPORTUNITY_ID as "Id", Customer.CUSTOMER_NAME as "Name", OpportunityAction.OPPORTUNITYACTION_DATE as "Date", OpportunityAction.OPPORTUNITYACTION_NOTE as "Note", ActionType.ACTIONTYPE_NAME as "Type", ActionStatus.ACTIONSTATUS_NAME as "Status"
            FROM CODBEX_OPPORTUNITY as Opportunity
              INNER JOIN CODBEX_CUSTOMER Customer ON Opportunity.OPPORTUNITY_CUSTOMER = Customer.CUSTOMER_ID
              INNER JOIN CODBEX_OPPORTUNITYACTION OpportunityAction ON Opportunity.OPPORTUNITY_ID = OpportunityAction.OPPORTUNITYACTION_OPPORTUNITY
              INNER JOIN CODBEX_ACTIONTYPE ActionType ON OpportunityAction.OPPORTUNITYACTION_TYPE = ActionType.ACTIONTYPE_ID
              INNER JOIN CODBEX_ACTIONSTATUS ActionStatus ON LeadAction.LEADACTION_STATUS = ActionStatus.ACTIONSTATUS_ID
            ORDER BY OPPORTUNITYACTION_DATE DESC
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: OpportunityActionsFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT Opportunity.OPPORTUNITY_ID as "Id", Customer.CUSTOMER_NAME as "Name", OpportunityAction.OPPORTUNITYACTION_DATE as "Date", OpportunityAction.OPPORTUNITYACTION_NOTE as "Note", ActionType.ACTIONTYPE_NAME as "Type", ActionStatus.ACTIONSTATUS_NAME as "Status"
                FROM CODBEX_OPPORTUNITY as Opportunity
                  INNER JOIN CODBEX_CUSTOMER Customer ON Opportunity.OPPORTUNITY_CUSTOMER = Customer.CUSTOMER_ID
                  INNER JOIN CODBEX_OPPORTUNITYACTION OpportunityAction ON Opportunity.OPPORTUNITY_ID = OpportunityAction.OPPORTUNITYACTION_OPPORTUNITY
                  INNER JOIN CODBEX_ACTIONTYPE ActionType ON OpportunityAction.OPPORTUNITYACTION_TYPE = ActionType.ACTIONTYPE_ID
                  INNER JOIN CODBEX_ACTIONSTATUS ActionStatus ON LeadAction.LEADACTION_STATUS = ActionStatus.ACTIONSTATUS_ID
                ORDER BY OPPORTUNITYACTION_DATE DESC
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}