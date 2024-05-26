import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeadStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface LeadStatusCreateEntity {
    readonly Name?: string;
}

export interface LeadStatusUpdateEntity extends LeadStatusCreateEntity {
    readonly Id: number;
}

export interface LeadStatusEntityOptions {
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
    $select?: (keyof LeadStatusEntity)[],
    $sort?: string | (keyof LeadStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeadStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeadStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeadStatusUpdateEntityEvent extends LeadStatusEntityEvent {
    readonly previousEntity: LeadStatusEntity;
}

export class LeadStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEADSTATUS",
        properties: [
            {
                name: "Id",
                column: "LEADSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "LEADSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadStatusEntityOptions): LeadStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeadStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeadStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEADSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeadStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEADSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEADSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeadStatusCreateEntity | LeadStatusUpdateEntity): number {
        const id = (entity as LeadStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeadStatusUpdateEntity);
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
            table: "CODBEX_LEADSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: LeadStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEADSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeadStatusEntityEvent | LeadStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-LeadStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-LeadStatus").send(JSON.stringify(data));
    }
}
