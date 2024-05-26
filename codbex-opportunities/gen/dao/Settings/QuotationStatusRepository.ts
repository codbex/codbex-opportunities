import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface QuotationStatusEntity {
    readonly Id: number;
    Name?: string;
    Description?: string;
}

export interface QuotationStatusCreateEntity {
    readonly Name?: string;
    readonly Description?: string;
}

export interface QuotationStatusUpdateEntity extends QuotationStatusCreateEntity {
    readonly Id: number;
}

export interface QuotationStatusEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Description?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Description?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Description?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Description?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Description?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Description?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Description?: string;
        };
    },
    $select?: (keyof QuotationStatusEntity)[],
    $sort?: string | (keyof QuotationStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface QuotationStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<QuotationStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface QuotationStatusUpdateEntityEvent extends QuotationStatusEntityEvent {
    readonly previousEntity: QuotationStatusEntity;
}

export class QuotationStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_QUOTATIONSTATUS",
        properties: [
            {
                name: "Id",
                column: "QUOTATIONSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "QUOTATIONSTATUS_NAME",
                type: "VARCHAR",
            },
            {
                name: "Description",
                column: "QUOTATIONSTATUS_DESCRIPTION",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(QuotationStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: QuotationStatusEntityOptions): QuotationStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): QuotationStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: QuotationStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_QUOTATIONSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "QUOTATIONSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: QuotationStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_QUOTATIONSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "QUOTATIONSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: QuotationStatusCreateEntity | QuotationStatusUpdateEntity): number {
        const id = (entity as QuotationStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as QuotationStatusUpdateEntity);
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
            table: "CODBEX_QUOTATIONSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "QUOTATIONSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: QuotationStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_QUOTATIONSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: QuotationStatusEntityEvent | QuotationStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-QuotationStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-QuotationStatus").send(JSON.stringify(data));
    }
}
