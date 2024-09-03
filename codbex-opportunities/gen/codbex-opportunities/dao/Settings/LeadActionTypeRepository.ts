import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeadActionTypeEntity {
    readonly Id: number;
    Name?: string;
}

export interface LeadActionTypeCreateEntity {
    readonly Name?: string;
}

export interface LeadActionTypeUpdateEntity extends LeadActionTypeCreateEntity {
    readonly Id: number;
}

export interface LeadActionTypeEntityOptions {
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
    $select?: (keyof LeadActionTypeEntity)[],
    $sort?: string | (keyof LeadActionTypeEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeadActionTypeEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeadActionTypeEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeadActionTypeUpdateEntityEvent extends LeadActionTypeEntityEvent {
    readonly previousEntity: LeadActionTypeEntity;
}

export class LeadActionTypeRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEADACTIONSTYPE",
        properties: [
            {
                name: "Id",
                column: "LEADACTIONSTYPE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "LEADACTIONSTYPE_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadActionTypeRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadActionTypeEntityOptions): LeadActionTypeEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeadActionTypeEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeadActionTypeCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEADACTIONSTYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADACTIONSTYPE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeadActionTypeUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEADACTIONSTYPE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEADACTIONSTYPE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeadActionTypeCreateEntity | LeadActionTypeUpdateEntity): number {
        const id = (entity as LeadActionTypeUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeadActionTypeUpdateEntity);
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
            table: "CODBEX_LEADACTIONSTYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADACTIONSTYPE_ID",
                value: id
            }
        });
    }

    public count(options?: LeadActionTypeEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEADACTIONSTYPE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeadActionTypeEntityEvent | LeadActionTypeUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-LeadActionType", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-LeadActionType").send(JSON.stringify(data));
    }
}
