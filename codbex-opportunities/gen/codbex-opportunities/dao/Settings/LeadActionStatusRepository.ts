import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeadActionStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface LeadActionStatusCreateEntity {
    readonly Name?: string;
}

export interface LeadActionStatusUpdateEntity extends LeadActionStatusCreateEntity {
    readonly Id: number;
}

export interface LeadActionStatusEntityOptions {
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
    $select?: (keyof LeadActionStatusEntity)[],
    $sort?: string | (keyof LeadActionStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeadActionStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeadActionStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeadActionStatusUpdateEntityEvent extends LeadActionStatusEntityEvent {
    readonly previousEntity: LeadActionStatusEntity;
}

export class LeadActionStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEADACTIONSSTATUS",
        properties: [
            {
                name: "Id",
                column: "LEADACTIONSSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "LEADACTIONSSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadActionStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadActionStatusEntityOptions): LeadActionStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeadActionStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeadActionStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEADACTIONSSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADACTIONSSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeadActionStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEADACTIONSSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEADACTIONSSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeadActionStatusCreateEntity | LeadActionStatusUpdateEntity): number {
        const id = (entity as LeadActionStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeadActionStatusUpdateEntity);
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
            table: "CODBEX_LEADACTIONSSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADACTIONSSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: LeadActionStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEADACTIONSSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeadActionStatusEntityEvent | LeadActionStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-LeadActionStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-LeadActionStatus").send(JSON.stringify(data));
    }
}
