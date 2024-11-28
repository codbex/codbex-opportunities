import { Query, NamedQueryParameter } from "sdk/db";

export interface QuotationIssuanceAndAcceptance {
    readonly 'Status': string;
    readonly 'Total Quotations': number;
    readonly 'Total Amount': boolean;
    readonly 'Currency': string;
}

export interface QuotationIssuanceAndAcceptanceFilter {
}

export interface QuotationIssuanceAndAcceptancePaginatedFilter extends QuotationIssuanceAndAcceptanceFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class QuotationIssuanceAndAcceptanceRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: QuotationIssuanceAndAcceptancePaginatedFilter): QuotationIssuanceAndAcceptance[] {
        const sql = `
            SELECT QuotationStatus.QUOTATIONSTATUS_NAME as "Status", COUNT(Quotation.QUOTATION_ID) as "Total Quotations", SUM(Quotation.QUOTATION_TOTAL) as "Total Amount", Currency.CURRENCY_CODE as "Currency"
            FROM CODBEX_QUOTATIONSTATUS as QuotationStatus
              INNER JOIN CODBEX_QUOTATION Quotation ON QuotationStatus.QUOTATIONSTATUS_ID = Quotation.QUOTATION_STATUS
              INNER JOIN CODBEX_CURRENCY Currency ON Quotation.QUOTATION_CURRENCY = Currency.CURRENCY_ID
            GROUP BY QuotationStatus.QUOTATIONSTATUS_NAME
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: QuotationIssuanceAndAcceptanceFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT QuotationStatus.QUOTATIONSTATUS_NAME as "Status", COUNT(Quotation.QUOTATION_ID) as "Total Quotations", SUM(Quotation.QUOTATION_TOTAL) as "Total Amount", Currency.CURRENCY_CODE as "Currency"
                FROM CODBEX_QUOTATIONSTATUS as QuotationStatus
                  INNER JOIN CODBEX_QUOTATION Quotation ON QuotationStatus.QUOTATIONSTATUS_ID = Quotation.QUOTATION_STATUS
                  INNER JOIN CODBEX_CURRENCY Currency ON Quotation.QUOTATION_CURRENCY = Currency.CURRENCY_ID
                GROUP BY QuotationStatus.QUOTATIONSTATUS_NAME
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}