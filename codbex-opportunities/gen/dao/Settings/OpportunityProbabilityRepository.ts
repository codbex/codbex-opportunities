import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OpportunityProbabilityEntity {
    readonly Id: number;
    Name?: string;
}

export interface OpportunityProbabilityCreateEntity {
    readonly Name?: string;
}

export interface OpportunityProbabilityUpdateEntity extends OpportunityProbabilityCreateEntity {
    readonly Id: number;
}

export interface OpportunityProbabilityEntityOptions {
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
    $select?: (keyof OpportunityProbabilityEntity)[],
    $sort?: string | (keyof OpportunityProbabilityEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OpportunityProbabilityEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OpportunityProbabilityEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class OpportunityProbabilityRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_OPPORTUNITYPROBABILITY",
        properties: [
            {
                name: "Id",
                column: "OPPORTUNITYPROBABILITY_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "OPPORTUNITYPROBABILITY_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OpportunityProbabilityRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OpportunityProbabilityEntityOptions): OpportunityProbabilityEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OpportunityProbabilityEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OpportunityProbabilityCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_OPPORTUNITYPROBABILITY",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYPROBABILITY_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OpportunityProbabilityUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_OPPORTUNITYPROBABILITY",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYPROBABILITY_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OpportunityProbabilityCreateEntity | OpportunityProbabilityUpdateEntity): number {
        const id = (entity as OpportunityProbabilityUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OpportunityProbabilityUpdateEntity);
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
            table: "CODBEX_OPPORTUNITYPROBABILITY",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYPROBABILITY_ID",
                value: id
            }
        });
    }

    public count(options?: OpportunityProbabilityEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__OPPORTUNITYPROBABILITY"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OpportunityProbabilityEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-OpportunityProbability", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-OpportunityProbability").send(JSON.stringify(data));
    }
}
