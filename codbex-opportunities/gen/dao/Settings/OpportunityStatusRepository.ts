import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OpportunityStatusEntity {
    readonly Id: number;
    Name?: string;
    Description?: string;
}

export interface OpportunityStatusCreateEntity {
    readonly Name?: string;
    readonly Description?: string;
}

export interface OpportunityStatusUpdateEntity extends OpportunityStatusCreateEntity {
    readonly Id: number;
}

export interface OpportunityStatusEntityOptions {
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
    $select?: (keyof OpportunityStatusEntity)[],
    $sort?: string | (keyof OpportunityStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OpportunityStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OpportunityStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OpportunityStatusUpdateEntityEvent extends OpportunityStatusEntityEvent {
    readonly previousEntity: OpportunityStatusEntity;
}

export class OpportunityStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_OPPORTUNITYSTATUS",
        properties: [
            {
                name: "Id",
                column: "OPPORTUNITYSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "OPPORTUNITYSTATUS_NAME",
                type: "VARCHAR",
            },
            {
                name: "Description",
                column: "OPPORTUNITYSTATUS_DESCRIPTION",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OpportunityStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OpportunityStatusEntityOptions): OpportunityStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OpportunityStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OpportunityStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_OPPORTUNITYSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OpportunityStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_OPPORTUNITYSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "OPPORTUNITYSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OpportunityStatusCreateEntity | OpportunityStatusUpdateEntity): number {
        const id = (entity as OpportunityStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OpportunityStatusUpdateEntity);
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
            table: "CODBEX_OPPORTUNITYSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: OpportunityStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_OPPORTUNITYSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OpportunityStatusEntityEvent | OpportunityStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-OpportunityStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-OpportunityStatus").send(JSON.stringify(data));
    }
}
