import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OpportunityPriorityEntity {
    readonly Id: number;
    Name?: string;
}

export interface OpportunityPriorityCreateEntity {
    readonly Name?: string;
}

export interface OpportunityPriorityUpdateEntity extends OpportunityPriorityCreateEntity {
    readonly Id: number;
}

export interface OpportunityPriorityEntityOptions {
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
    $select?: (keyof OpportunityPriorityEntity)[],
    $sort?: string | (keyof OpportunityPriorityEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OpportunityPriorityEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OpportunityPriorityEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OpportunityPriorityUpdateEntityEvent extends OpportunityPriorityEntityEvent {
    readonly previousEntity: OpportunityPriorityEntity;
}

export class OpportunityPriorityRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_OPPORTUNITYPRIORITY",
        properties: [
            {
                name: "Id",
                column: "OPPORTUNITYPRIORITY_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "OPPORTUNITYPRIORITY_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OpportunityPriorityRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OpportunityPriorityEntityOptions): OpportunityPriorityEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OpportunityPriorityEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OpportunityPriorityCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_OPPORTUNITYPRIORITY",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYPRIORITY_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OpportunityPriorityUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_OPPORTUNITYPRIORITY",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "OPPORTUNITYPRIORITY_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OpportunityPriorityCreateEntity | OpportunityPriorityUpdateEntity): number {
        const id = (entity as OpportunityPriorityUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OpportunityPriorityUpdateEntity);
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
            table: "CODBEX_OPPORTUNITYPRIORITY",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYPRIORITY_ID",
                value: id
            }
        });
    }

    public count(options?: OpportunityPriorityEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_OPPORTUNITYPRIORITY"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OpportunityPriorityEntityEvent | OpportunityPriorityUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-OpportunityPriority", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-OpportunityPriority").send(JSON.stringify(data));
    }
}
