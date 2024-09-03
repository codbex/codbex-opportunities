import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeadQualificationTimelineEntity {
    readonly Id: number;
    Name?: string;
}

export interface LeadQualificationTimelineCreateEntity {
    readonly Name?: string;
}

export interface LeadQualificationTimelineUpdateEntity extends LeadQualificationTimelineCreateEntity {
    readonly Id: number;
}

export interface LeadQualificationTimelineEntityOptions {
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
    $select?: (keyof LeadQualificationTimelineEntity)[],
    $sort?: string | (keyof LeadQualificationTimelineEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeadQualificationTimelineEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeadQualificationTimelineEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeadQualificationTimelineUpdateEntityEvent extends LeadQualificationTimelineEntityEvent {
    readonly previousEntity: LeadQualificationTimelineEntity;
}

export class LeadQualificationTimelineRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEADQUALIFICATIONTIMELINE",
        properties: [
            {
                name: "Id",
                column: "LEADQUALIFICATIONTIMELINE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "LEADQUALIFICATIONTIMELINE_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadQualificationTimelineRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadQualificationTimelineEntityOptions): LeadQualificationTimelineEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeadQualificationTimelineEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeadQualificationTimelineCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEADQUALIFICATIONTIMELINE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATIONTIMELINE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeadQualificationTimelineUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEADQUALIFICATIONTIMELINE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATIONTIMELINE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeadQualificationTimelineCreateEntity | LeadQualificationTimelineUpdateEntity): number {
        const id = (entity as LeadQualificationTimelineUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeadQualificationTimelineUpdateEntity);
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
            table: "CODBEX_LEADQUALIFICATIONTIMELINE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATIONTIMELINE_ID",
                value: id
            }
        });
    }

    public count(options?: LeadQualificationTimelineEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEADQUALIFICATIONTIMELINE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeadQualificationTimelineEntityEvent | LeadQualificationTimelineUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-LeadQualificationTimeline", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-LeadQualificationTimeline").send(JSON.stringify(data));
    }
}
