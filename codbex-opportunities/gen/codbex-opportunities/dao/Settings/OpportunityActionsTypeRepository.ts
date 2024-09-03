import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OpportunityActionsTypeEntity {
    readonly Id: number;
    Name?: string;
}

export interface OpportunityActionsTypeCreateEntity {
    readonly Name?: string;
}

export interface OpportunityActionsTypeUpdateEntity extends OpportunityActionsTypeCreateEntity {
    readonly Id: number;
}

export interface OpportunityActionsTypeEntityOptions {
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
    $select?: (keyof OpportunityActionsTypeEntity)[],
    $sort?: string | (keyof OpportunityActionsTypeEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OpportunityActionsTypeEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OpportunityActionsTypeEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OpportunityActionsTypeUpdateEntityEvent extends OpportunityActionsTypeEntityEvent {
    readonly previousEntity: OpportunityActionsTypeEntity;
}

export class OpportunityActionsTypeRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_OPPORTUNITYACTIONSTYPE",
        properties: [
            {
                name: "Id",
                column: "OPPORTUNITYACTIONSTYPE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "OPPORTUNITYACTIONSTYPE_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OpportunityActionsTypeRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OpportunityActionsTypeEntityOptions): OpportunityActionsTypeEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OpportunityActionsTypeEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OpportunityActionsTypeCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_OPPORTUNITYACTIONSTYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYACTIONSTYPE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OpportunityActionsTypeUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_OPPORTUNITYACTIONSTYPE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "OPPORTUNITYACTIONSTYPE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OpportunityActionsTypeCreateEntity | OpportunityActionsTypeUpdateEntity): number {
        const id = (entity as OpportunityActionsTypeUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OpportunityActionsTypeUpdateEntity);
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
            table: "CODBEX_OPPORTUNITYACTIONSTYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYACTIONSTYPE_ID",
                value: id
            }
        });
    }

    public count(options?: OpportunityActionsTypeEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_OPPORTUNITYACTIONSTYPE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OpportunityActionsTypeEntityEvent | OpportunityActionsTypeUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-OpportunityActionsType", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-OpportunityActionsType").send(JSON.stringify(data));
    }
}
