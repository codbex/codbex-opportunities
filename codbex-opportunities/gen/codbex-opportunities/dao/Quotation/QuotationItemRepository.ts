import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface QuotationItemEntity {
    readonly Id: number;
    Quotation?: number;
    Product?: number;
    Quantity?: number;
    UoM?: number;
    Price?: number;
    Total?: number;
    Currency?: number;
}

export interface QuotationItemCreateEntity {
    readonly Quotation?: number;
    readonly Product?: number;
    readonly Quantity?: number;
    readonly UoM?: number;
    readonly Price?: number;
    readonly Total?: number;
    readonly Currency?: number;
}

export interface QuotationItemUpdateEntity extends QuotationItemCreateEntity {
    readonly Id: number;
}

export interface QuotationItemEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Quotation?: number | number[];
            Product?: number | number[];
            Quantity?: number | number[];
            UoM?: number | number[];
            Price?: number | number[];
            Total?: number | number[];
            Currency?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Quotation?: number | number[];
            Product?: number | number[];
            Quantity?: number | number[];
            UoM?: number | number[];
            Price?: number | number[];
            Total?: number | number[];
            Currency?: number | number[];
        };
        contains?: {
            Id?: number;
            Quotation?: number;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Total?: number;
            Currency?: number;
        };
        greaterThan?: {
            Id?: number;
            Quotation?: number;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Total?: number;
            Currency?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Quotation?: number;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Total?: number;
            Currency?: number;
        };
        lessThan?: {
            Id?: number;
            Quotation?: number;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Total?: number;
            Currency?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Quotation?: number;
            Product?: number;
            Quantity?: number;
            UoM?: number;
            Price?: number;
            Total?: number;
            Currency?: number;
        };
    },
    $select?: (keyof QuotationItemEntity)[],
    $sort?: string | (keyof QuotationItemEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface QuotationItemEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<QuotationItemEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface QuotationItemUpdateEntityEvent extends QuotationItemEntityEvent {
    readonly previousEntity: QuotationItemEntity;
}

export class QuotationItemRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ENTITY71921",
        properties: [
            {
                name: "Id",
                column: "ENTITY71921_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Quotation",
                column: "ENTITY71921_QUOTATION",
                type: "INTEGER",
            },
            {
                name: "Product",
                column: "ENTITY71921_PRODUCT",
                type: "INTEGER",
            },
            {
                name: "Quantity",
                column: "ENTITY71921_QUANTITY",
                type: "DOUBLE",
            },
            {
                name: "UoM",
                column: "ENTITY71921_UOM",
                type: "INTEGER",
            },
            {
                name: "Price",
                column: "ENTITY71921_PRICE",
                type: "DECIMAL",
            },
            {
                name: "Total",
                column: "ENTITY71921_TOTAL",
                type: "DECIMAL",
            },
            {
                name: "Currency",
                column: "ENTITY71921_CURRENCY",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(QuotationItemRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: QuotationItemEntityOptions): QuotationItemEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): QuotationItemEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: QuotationItemCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ENTITY71921",
            entity: entity,
            key: {
                name: "Id",
                column: "ENTITY71921_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: QuotationItemUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ENTITY71921",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "ENTITY71921_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: QuotationItemCreateEntity | QuotationItemUpdateEntity): number {
        const id = (entity as QuotationItemUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as QuotationItemUpdateEntity);
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
            table: "CODBEX_ENTITY71921",
            entity: entity,
            key: {
                name: "Id",
                column: "ENTITY71921_ID",
                value: id
            }
        });
    }

    public count(options?: QuotationItemEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ENTITY71921"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: QuotationItemEntityEvent | QuotationItemUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Quotation-QuotationItem", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Quotation-QuotationItem").send(JSON.stringify(data));
    }
}
