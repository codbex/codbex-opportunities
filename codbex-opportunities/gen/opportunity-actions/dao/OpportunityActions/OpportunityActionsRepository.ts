import { Query, NamedQueryParameter } from "sdk/db";

export interface OpportunityActions {
    readonly 'Name': string;
    readonly 'Date': Date;
    readonly 'Description': string;
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
            SELECT Customer.CUSTOMER_NAME as "Name", OpportunityNote.OPPORTUNITYNOTE_TIMESTAMP as "Date", OpportunityNote.OPPORTUNITYNOTE_DESCRIPTION as "Description", ActionType.ACTIONTYPE_NAME as "Type", ActionStatus.ACTIONSTATUS_NAME as "Status"
            FROM CODBEX_OPPORTUNITY as Opportunity
              INNER JOIN CODBEX_ACTIONSTATUS ActionStatus ON LeadEngagement.LEADENGAGEMENT_STATUS = ActionStatus.ACTIONSTATUS_ID
              INNER JOIN CODBEX_OPPORTUNITYACTION OpportunityAction ON Opportunity.OPPORTUNITY_ID = OpportunityAction.OPPORTUNITYACTION_OPPORTUNITY
              INNER JOIN CODBEX_ACTIONTYPE ActionType ON OpportunityAction.OPPORTUNITYACTION_TYPE = ActionType.ACTIONTYPE_ID
              INNER JOIN CODBEX_ACTIONSTATUS ActionStatus ON OpportunityAction.OPPORTUNITYACTION_STATUS = ActionStatus.ACTIONSTATUS_ID
              INNER JOIN CODBEX_OPPORTUNITYNOTE OpportunityNote ON OpportunityAction.OPPORTUNITYACTION_ID = OpportunityNote.OPPORTUNITYNOTE_ACTION
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
                SELECT Customer.CUSTOMER_NAME as "Name", OpportunityNote.OPPORTUNITYNOTE_TIMESTAMP as "Date", OpportunityNote.OPPORTUNITYNOTE_DESCRIPTION as "Description", ActionType.ACTIONTYPE_NAME as "Type", ActionStatus.ACTIONSTATUS_NAME as "Status"
                FROM CODBEX_OPPORTUNITY as Opportunity
                  INNER JOIN CODBEX_ACTIONSTATUS ActionStatus ON LeadEngagement.LEADENGAGEMENT_STATUS = ActionStatus.ACTIONSTATUS_ID
                  INNER JOIN CODBEX_OPPORTUNITYACTION OpportunityAction ON Opportunity.OPPORTUNITY_ID = OpportunityAction.OPPORTUNITYACTION_OPPORTUNITY
                  INNER JOIN CODBEX_ACTIONTYPE ActionType ON OpportunityAction.OPPORTUNITYACTION_TYPE = ActionType.ACTIONTYPE_ID
                  INNER JOIN CODBEX_ACTIONSTATUS ActionStatus ON OpportunityAction.OPPORTUNITYACTION_STATUS = ActionStatus.ACTIONSTATUS_ID
                  INNER JOIN CODBEX_OPPORTUNITYNOTE OpportunityNote ON OpportunityAction.OPPORTUNITYACTION_ID = OpportunityNote.OPPORTUNITYNOTE_ACTION
                ORDER BY OPPORTUNITYACTION_DATE DESC
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}