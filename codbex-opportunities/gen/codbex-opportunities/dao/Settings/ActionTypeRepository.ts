import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface ActionTypeEntity {
    readonly Id: number;
    Name?: string;
}

export interface ActionTypeCreateEntity {
    readonly Name?: string;
}

export interface ActionTypeUpdateEntity extends ActionTypeCreateEntity {
    readonly Id: number;
}

export interface ActionTypeEntityOptions {
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
    $select?: (keyof ActionTypeEntity)[],
    $sort?: string | (keyof ActionTypeEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface ActionTypeEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ActionTypeEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface ActionTypeUpdateEntityEvent extends ActionTypeEntityEvent {
    readonly previousEntity: ActionTypeEntity;
}

export class ActionTypeRepository {

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
        this.dao = daoApi.create(ActionTypeRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: ActionTypeEntityOptions): ActionTypeEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): ActionTypeEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: ActionTypeCreateEntity): number {
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

    public update(entity: ActionTypeUpdateEntity): void {
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

    public upsert(entity: ActionTypeCreateEntity | ActionTypeUpdateEntity): number {
        const id = (entity as ActionTypeUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as ActionTypeUpdateEntity);
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

    public count(options?: ActionTypeEntityOptions): number {
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

    private async triggerEvent(data: ActionTypeEntityEvent | ActionTypeUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-ActionType", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-ActionType").send(JSON.stringify(data));
    }
}
