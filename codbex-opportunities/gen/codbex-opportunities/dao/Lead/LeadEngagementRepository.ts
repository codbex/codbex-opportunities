import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface LeadEngagementEntity {
    readonly Id: number;
    Date?: Date;
    Subject?: string;
    Lead?: number;
    Type?: number;
    Status?: number;
    Description?: string;
    Timestamp?: Date;
}

export interface LeadEngagementCreateEntity {
    readonly Date?: Date;
    readonly Subject?: string;
    readonly Lead?: number;
    readonly Type?: number;
    readonly Status?: number;
    readonly Description?: string;
    readonly Timestamp?: Date;
}

export interface LeadEngagementUpdateEntity extends LeadEngagementCreateEntity {
    readonly Id: number;
}

export interface LeadEngagementEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Subject?: string | string[];
            Lead?: number | number[];
            Type?: number | number[];
            Status?: number | number[];
            Description?: string | string[];
            Timestamp?: Date | Date[];
        };
        notEquals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Subject?: string | string[];
            Lead?: number | number[];
            Type?: number | number[];
            Status?: number | number[];
            Description?: string | string[];
            Timestamp?: Date | Date[];
        };
        contains?: {
            Id?: number;
            Date?: Date;
            Subject?: string;
            Lead?: number;
            Type?: number;
            Status?: number;
            Description?: string;
            Timestamp?: Date;
        };
        greaterThan?: {
            Id?: number;
            Date?: Date;
            Subject?: string;
            Lead?: number;
            Type?: number;
            Status?: number;
            Description?: string;
            Timestamp?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Subject?: string;
            Lead?: number;
            Type?: number;
            Status?: number;
            Description?: string;
            Timestamp?: Date;
        };
        lessThan?: {
            Id?: number;
            Date?: Date;
            Subject?: string;
            Lead?: number;
            Type?: number;
            Status?: number;
            Description?: string;
            Timestamp?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Subject?: string;
            Lead?: number;
            Type?: number;
            Status?: number;
            Description?: string;
            Timestamp?: Date;
        };
    },
    $select?: (keyof LeadEngagementEntity)[],
    $sort?: string | (keyof LeadEngagementEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeadEngagementEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeadEngagementEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeadEngagementUpdateEntityEvent extends LeadEngagementEntityEvent {
    readonly previousEntity: LeadEngagementEntity;
}

export class LeadEngagementRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEADENGAGEMENT",
        properties: [
            {
                name: "Id",
                column: "LEADENGAGEMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Date",
                column: "LEADENGAGEMENT_DATE",
                type: "DATE",
            },
            {
                name: "Subject",
                column: "LEADENGAGEMENT_SUBJECT",
                type: "VARCHAR",
            },
            {
                name: "Lead",
                column: "LEADENGAGEMENT_LEAD",
                type: "INTEGER",
            },
            {
                name: "Type",
                column: "LEADENGAGEMENT_TYPE",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "LEADENGAGEMENT_STATUS",
                type: "INTEGER",
            },
            {
                name: "Description",
                column: "LEADENGAGEMENT_DESCRIPTION",
                type: "VARCHAR",
            },
            {
                name: "Timestamp",
                column: "LEADENGAGEMENT_TIMESTAMP",
                type: "TIMESTAMP",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadEngagementRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadEngagementEntityOptions): LeadEngagementEntity[] {
        return this.dao.list(options).map((e: LeadEngagementEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
    }

    public findById(id: number): LeadEngagementEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        return entity ?? undefined;
    }

    public create(entity: LeadEngagementCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEADENGAGEMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADENGAGEMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeadEngagementUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEADENGAGEMENT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEADENGAGEMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeadEngagementCreateEntity | LeadEngagementUpdateEntity): number {
        const id = (entity as LeadEngagementUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeadEngagementUpdateEntity);
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
            table: "CODBEX_LEADENGAGEMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADENGAGEMENT_ID",
                value: id
            }
        });
    }

    public count(options?: LeadEngagementEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEADENGAGEMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeadEngagementEntityEvent | LeadEngagementUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Lead-LeadEngagement", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Lead-LeadEngagement").send(JSON.stringify(data));
    }
}
