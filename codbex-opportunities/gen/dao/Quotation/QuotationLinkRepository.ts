import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface QuotationLinkEntity {
    readonly Id: number;
    SalesOrder?: number;
    Quotation?: number;
}

export interface QuotationLinkCreateEntity {
    readonly SalesOrder?: number;
    readonly Quotation?: number;
}

export interface QuotationLinkUpdateEntity extends QuotationLinkCreateEntity {
    readonly Id: number;
}

export interface QuotationLinkEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            SalesOrder?: number | number[];
            Quotation?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            SalesOrder?: number | number[];
            Quotation?: number | number[];
        };
        contains?: {
            Id?: number;
            SalesOrder?: number;
            Quotation?: number;
        };
        greaterThan?: {
            Id?: number;
            SalesOrder?: number;
            Quotation?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            SalesOrder?: number;
            Quotation?: number;
        };
        lessThan?: {
            Id?: number;
            SalesOrder?: number;
            Quotation?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            SalesOrder?: number;
            Quotation?: number;
        };
    },
    $select?: (keyof QuotationLinkEntity)[],
    $sort?: string | (keyof QuotationLinkEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface QuotationLinkEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<QuotationLinkEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface QuotationLinkUpdateEntityEvent extends QuotationLinkEntityEvent {
    readonly previousEntity: QuotationLinkEntity;
}

export class QuotationLinkRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_QUOTATIONLINK",
        properties: [
            {
                name: "Id",
                column: "QUOTATIONLINK_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "SalesOrder",
                column: "QUOTATIONLINK_SALESORDER",
                type: "INTEGER",
            },
            {
                name: "Quotation",
                column: "QUOTATIONLINK_QUOTATION",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(QuotationLinkRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: QuotationLinkEntityOptions): QuotationLinkEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): QuotationLinkEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: QuotationLinkCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_QUOTATIONLINK",
            entity: entity,
            key: {
                name: "Id",
                column: "QUOTATIONLINK_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: QuotationLinkUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_QUOTATIONLINK",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "QUOTATIONLINK_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: QuotationLinkCreateEntity | QuotationLinkUpdateEntity): number {
        const id = (entity as QuotationLinkUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as QuotationLinkUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_QUOTATIONLINK",
            entity: entity,
            key: {
                name: "Id",
                column: "QUOTATIONLINK_ID",
                value: id
            }
        });
    }

    public count(options?: QuotationLinkEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__QUOTATIONLINK"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: QuotationLinkEntityEvent | QuotationLinkUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Quotation-QuotationLink", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Quotation-QuotationLink").send(JSON.stringify(data));
    }
}
