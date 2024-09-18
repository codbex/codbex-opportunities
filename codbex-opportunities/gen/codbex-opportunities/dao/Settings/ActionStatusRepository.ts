import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface ActionStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface ActionStatusCreateEntity {
    readonly Name?: string;
}

export interface ActionStatusUpdateEntity extends ActionStatusCreateEntity {
    readonly Id: number;
}

export interface ActionStatusEntityOptions {
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
    $select?: (keyof ActionStatusEntity)[],
    $sort?: string | (keyof ActionStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface ActionStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ActionStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface ActionStatusUpdateEntityEvent extends ActionStatusEntityEvent {
    readonly previousEntity: ActionStatusEntity;
}

export class ActionStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ACTIONSTATUS",
        properties: [
            {
                name: "Id",
                column: "ACTIONSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "ACTIONSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(ActionStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: ActionStatusEntityOptions): ActionStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): ActionStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: ActionStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ACTIONSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "ACTIONSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: ActionStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ACTIONSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "ACTIONSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: ActionStatusCreateEntity | ActionStatusUpdateEntity): number {
        const id = (entity as ActionStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as ActionStatusUpdateEntity);
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
            table: "CODBEX_ACTIONSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "ACTIONSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: ActionStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ACTIONSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: ActionStatusEntityEvent | ActionStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-ActionStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-ActionStatus").send(JSON.stringify(data));
    }
}
