import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeadQualificationNeedEntity {
    readonly Id: number;
    Name?: string;
}

export interface LeadQualificationNeedCreateEntity {
    readonly Name?: string;
}

export interface LeadQualificationNeedUpdateEntity extends LeadQualificationNeedCreateEntity {
    readonly Id: number;
}

export interface LeadQualificationNeedEntityOptions {
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
    $select?: (keyof LeadQualificationNeedEntity)[],
    $sort?: string | (keyof LeadQualificationNeedEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeadQualificationNeedEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeadQualificationNeedEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeadQualificationNeedUpdateEntityEvent extends LeadQualificationNeedEntityEvent {
    readonly previousEntity: LeadQualificationNeedEntity;
}

export class LeadQualificationNeedRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEADQUALIFICATIONNEED",
        properties: [
            {
                name: "Id",
                column: "LEADQUALIFICATIONNEED_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "LEADQUALIFICATIONNEED_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadQualificationNeedRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadQualificationNeedEntityOptions): LeadQualificationNeedEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeadQualificationNeedEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeadQualificationNeedCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEADQUALIFICATIONNEED",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATIONNEED_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeadQualificationNeedUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEADQUALIFICATIONNEED",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATIONNEED_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeadQualificationNeedCreateEntity | LeadQualificationNeedUpdateEntity): number {
        const id = (entity as LeadQualificationNeedUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeadQualificationNeedUpdateEntity);
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
            table: "CODBEX_LEADQUALIFICATIONNEED",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATIONNEED_ID",
                value: id
            }
        });
    }

    public count(options?: LeadQualificationNeedEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEADQUALIFICATIONNEED"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeadQualificationNeedEntityEvent | LeadQualificationNeedUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-LeadQualificationNeed", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-LeadQualificationNeed").send(JSON.stringify(data));
    }
}
