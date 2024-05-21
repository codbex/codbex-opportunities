import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OpportunityTypeEntity {
    readonly Id: number;
    Name?: string;
}

export interface OpportunityTypeCreateEntity {
    readonly Name?: string;
}

export interface OpportunityTypeUpdateEntity extends OpportunityTypeCreateEntity {
    readonly Id: number;
}

export interface OpportunityTypeEntityOptions {
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
    $select?: (keyof OpportunityTypeEntity)[],
    $sort?: string | (keyof OpportunityTypeEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OpportunityTypeEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OpportunityTypeEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OpportunityTypeUpdateEntityEvent extends OpportunityTypeEntityEvent {
    readonly previousEntity: OpportunityTypeEntity;
}

export class OpportunityTypeRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_OPPORTUNITYTYPE",
        properties: [
            {
                name: "Id",
                column: "OPPORTUNITYTYPE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "OPPORTUNITYTYPE_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OpportunityTypeRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OpportunityTypeEntityOptions): OpportunityTypeEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OpportunityTypeEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OpportunityTypeCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_OPPORTUNITYTYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYTYPE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OpportunityTypeUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_OPPORTUNITYTYPE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "OPPORTUNITYTYPE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OpportunityTypeCreateEntity | OpportunityTypeUpdateEntity): number {
        const id = (entity as OpportunityTypeUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OpportunityTypeUpdateEntity);
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
            table: "CODBEX_OPPORTUNITYTYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYTYPE_ID",
                value: id
            }
        });
    }

    public count(options?: OpportunityTypeEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__OPPORTUNITYTYPE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OpportunityTypeEntityEvent | OpportunityTypeUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-OpportunityType", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-OpportunityType").send(JSON.stringify(data));
    }
}
