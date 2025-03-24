import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";
// custom imports
import { NumberGeneratorService } from "codbex-number-generator/service/generator";

export interface QuotationEntity {
    readonly Id: number;
    Number?: string;
    Date?: Date;
    Owner?: number;
    Customer?: number;
    Total?: number;
    Currency?: number;
    Opportunity?: number;
    Status?: number;
}

export interface QuotationCreateEntity {
    readonly Owner?: number;
    readonly Customer?: number;
    readonly Total?: number;
    readonly Currency?: number;
    readonly Opportunity?: number;
    readonly Status?: number;
}

export interface QuotationUpdateEntity extends QuotationCreateEntity {
    readonly Id: number;
}

export interface QuotationEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            Owner?: number | number[];
            Customer?: number | number[];
            Total?: number | number[];
            Currency?: number | number[];
            Opportunity?: number | number[];
            Status?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            Owner?: number | number[];
            Customer?: number | number[];
            Total?: number | number[];
            Currency?: number | number[];
            Opportunity?: number | number[];
            Status?: number | number[];
        };
        contains?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Owner?: number;
            Customer?: number;
            Total?: number;
            Currency?: number;
            Opportunity?: number;
            Status?: number;
        };
        greaterThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Owner?: number;
            Customer?: number;
            Total?: number;
            Currency?: number;
            Opportunity?: number;
            Status?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Owner?: number;
            Customer?: number;
            Total?: number;
            Currency?: number;
            Opportunity?: number;
            Status?: number;
        };
        lessThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Owner?: number;
            Customer?: number;
            Total?: number;
            Currency?: number;
            Opportunity?: number;
            Status?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Owner?: number;
            Customer?: number;
            Total?: number;
            Currency?: number;
            Opportunity?: number;
            Status?: number;
        };
    },
    $select?: (keyof QuotationEntity)[],
    $sort?: string | (keyof QuotationEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface QuotationEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<QuotationEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface QuotationUpdateEntityEvent extends QuotationEntityEvent {
    readonly previousEntity: QuotationEntity;
}

export class QuotationRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_QUOTATION",
        properties: [
            {
                name: "Id",
                column: "QUOTATION_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Number",
                column: "QUOTATION_NAME",
                type: "VARCHAR",
            },
            {
                name: "Date",
                column: "QUOTATION_DATE",
                type: "DATE",
            },
            {
                name: "Owner",
                column: "QUOTATION_OWNER",
                type: "INTEGER",
            },
            {
                name: "Customer",
                column: "QUOTATION_CUSTOMER",
                type: "INTEGER",
            },
            {
                name: "Total",
                column: "QUOTATION_TOTAL",
                type: "DECIMAL",
            },
            {
                name: "Currency",
                column: "QUOTATION_CURRENCY",
                type: "INTEGER",
            },
            {
                name: "Opportunity",
                column: "QUOTATION_OPPORTUNITY",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "QUOTATION_STATUS",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(QuotationRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: QuotationEntityOptions): QuotationEntity[] {
        return this.dao.list(options).map((e: QuotationEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
    }

    public findById(id: number): QuotationEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        return entity ?? undefined;
    }

    public create(entity: QuotationCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        // @ts-ignore
        (entity as QuotationEntity).Number = new NumberGeneratorService().generate(3);
        // @ts-ignore
        (entity as QuotationEntity).Date = new Date();
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_QUOTATION",
            entity: entity,
            key: {
                name: "Id",
                column: "QUOTATION_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: QuotationUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_QUOTATION",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "QUOTATION_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: QuotationCreateEntity | QuotationUpdateEntity): number {
        const id = (entity as QuotationUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as QuotationUpdateEntity);
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
            table: "CODBEX_QUOTATION",
            entity: entity,
            key: {
                name: "Id",
                column: "QUOTATION_ID",
                value: id
            }
        });
    }

    public count(options?: QuotationEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_QUOTATION"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: QuotationEntityEvent | QuotationUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Quotation-Quotation", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Quotation-Quotation").send(JSON.stringify(data));
    }
}
