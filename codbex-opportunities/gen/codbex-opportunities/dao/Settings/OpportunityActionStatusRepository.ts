import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OpportunityActionStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface OpportunityActionStatusCreateEntity {
    readonly Name?: string;
}

export interface OpportunityActionStatusUpdateEntity extends OpportunityActionStatusCreateEntity {
    readonly Id: number;
}

export interface OpportunityActionStatusEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof OpportunityActionStatusEntity)[],
    $sort?: string | (keyof OpportunityActionStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OpportunityActionStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OpportunityActionStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OpportunityActionStatusUpdateEntityEvent extends OpportunityActionStatusEntityEvent {
    readonly previousEntity: OpportunityActionStatusEntity;
}

export class OpportunityActionStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_OPPORTUNITYACTIONSTATUS",
        properties: [
            {
                name: "Id",
                column: "OPPORTUNITYACTIONSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "OPPORTUNITYACTIONSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OpportunityActionStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OpportunityActionStatusEntityOptions): OpportunityActionStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OpportunityActionStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OpportunityActionStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_OPPORTUNITYACTIONSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYACTIONSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OpportunityActionStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_OPPORTUNITYACTIONSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "OPPORTUNITYACTIONSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OpportunityActionStatusCreateEntity | OpportunityActionStatusUpdateEntity): number {
        const id = (entity as OpportunityActionStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OpportunityActionStatusUpdateEntity);
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
            table: "CODBEX_OPPORTUNITYACTIONSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYACTIONSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: OpportunityActionStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_OPPORTUNITYACTIONSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OpportunityActionStatusEntityEvent | OpportunityActionStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-OpportunityActionStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-OpportunityActionStatus").send(JSON.stringify(data));
    }
}
