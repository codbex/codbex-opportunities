import { Query, NamedQueryParameter } from "sdk/db";

export interface OpportunityNotes {
    readonly 'Name': string;
    readonly 'Timestamp': Date;
    readonly 'Description': string;
    readonly 'Type': string;
    readonly 'Status': string;
}

export interface OpportunityNotesFilter {
}

export interface OpportunityNotesPaginatedFilter extends OpportunityNotesFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class OpportunityNotesRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: OpportunityNotesPaginatedFilter): OpportunityNotes[] {
        const sql = `
            SELECT Customer.CUSTOMER_NAME as "Name", OpportunityNote.OPPORTUNITYNOTE_TIMESTAMP as "Timestamp", OpportunityNote.OPPORTUNITYNOTE_DESCRIPTION as "Description", ActionType.ACTIONTYPE_NAME as "Type", ActionStatus.ACTIONSTATUS_NAME as "Status"
            FROM CODBEX_OPPORTUNITY as Opportunity
              INNER JOIN CODBEX_OPPORTUNITYACTION OpportunityAction ON Opportunity.OPPORTUNITY_ID = OpportunityAction.OPPORTUNITYACTION_OPPORTUNITY
              INNER JOIN CODBEX_ACTIONTYPE ActionType ON OpportunityAction.OPPORTUNITYACTION_TYPE = ActionType.ACTIONTYPE_ID
              INNER JOIN CODBEX_ACTIONSTATUS ActionStatus ON OpportunityAction.OPPORTUNITYACTION_STATUS = ActionStatus.ACTIONSTATUS_ID
              INNER JOIN CODBEX_OPPORTUNITYNOTE OpportunityNote ON OpportunityAction.OPPORTUNITYACTION_ID = OpportunityNote.OPPORTUNITYNOTE_ACTION
              INNER JOIN CODBEX_CUSTOMER Customer ON Opportunity.OPPORTUNITY_Customer = Customer.CUSTOMER_ID
            ORDER BY OPPORTUNITYNOTE_TIMESTAMP DESC
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: OpportunityNotesFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT Customer.CUSTOMER_NAME as "Name", OpportunityNote.OPPORTUNITYNOTE_TIMESTAMP as "Timestamp", OpportunityNote.OPPORTUNITYNOTE_DESCRIPTION as "Description", ActionType.ACTIONTYPE_NAME as "Type", ActionStatus.ACTIONSTATUS_NAME as "Status"
                FROM CODBEX_OPPORTUNITY as Opportunity
                  INNER JOIN CODBEX_OPPORTUNITYACTION OpportunityAction ON Opportunity.OPPORTUNITY_ID = OpportunityAction.OPPORTUNITYACTION_OPPORTUNITY
                  INNER JOIN CODBEX_ACTIONTYPE ActionType ON OpportunityAction.OPPORTUNITYACTION_TYPE = ActionType.ACTIONTYPE_ID
                  INNER JOIN CODBEX_ACTIONSTATUS ActionStatus ON OpportunityAction.OPPORTUNITYACTION_STATUS = ActionStatus.ACTIONSTATUS_ID
                  INNER JOIN CODBEX_OPPORTUNITYNOTE OpportunityNote ON OpportunityAction.OPPORTUNITYACTION_ID = OpportunityNote.OPPORTUNITYNOTE_ACTION
                  INNER JOIN CODBEX_CUSTOMER Customer ON Opportunity.OPPORTUNITY_Customer = Customer.CUSTOMER_ID
                ORDER BY OPPORTUNITYNOTE_TIMESTAMP DESC
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}