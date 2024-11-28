import { Query, NamedQueryParameter } from "sdk/db";

export interface LeadEngagement {
    readonly 'Name': string;
    readonly 'Date': Date;
    readonly 'Note': string;
    readonly 'Type': string;
    readonly 'Status': string;
}

export interface LeadEngagementFilter {
}

export interface LeadEngagementPaginatedFilter extends LeadEngagementFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class LeadEngagementRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: LeadEngagementPaginatedFilter): LeadEngagement[] {
        const sql = `
            SELECT Lead.LEAD_CONTACTNAME as "Name", LeadAction.LEADACTION_DATE as "Date", LeadAction.LEADACTION_NOTE as "Note", ActionType.ACTIONTYPE_NAME as "Type", ActionStatus.ACTIONSTATUS_NAME as "Status"
            FROM CODBEX_LEAD as Lead
              INNER JOIN CODBEX_LEADACTION LeadAction ON Lead.LEAD_ID = LeadAction.LEADACTION_LEAD
              INNER JOIN CODBEX_ACTIONTYPE ActionType ON LeadAction.LEADACTION_TYPE = ActionType.ACTIONTYPE_ID
              INNER JOIN CODBEX_ACTIONSTATUS ActionStatus ON LeadAction.LEADACTION_STATUS = ActionStatus.ACTIONSTATUS_ID
            ORDER BY LEADACTION_DATE DESC
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: LeadEngagementFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT Lead.LEAD_CONTACTNAME as "Name", LeadAction.LEADACTION_DATE as "Date", LeadAction.LEADACTION_NOTE as "Note", ActionType.ACTIONTYPE_NAME as "Type", ActionStatus.ACTIONSTATUS_NAME as "Status"
                FROM CODBEX_LEAD as Lead
                  INNER JOIN CODBEX_LEADACTION LeadAction ON Lead.LEAD_ID = LeadAction.LEADACTION_LEAD
                  INNER JOIN CODBEX_ACTIONTYPE ActionType ON LeadAction.LEADACTION_TYPE = ActionType.ACTIONTYPE_ID
                  INNER JOIN CODBEX_ACTIONSTATUS ActionStatus ON LeadAction.LEADACTION_STATUS = ActionStatus.ACTIONSTATUS_ID
                ORDER BY LEADACTION_DATE DESC
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}