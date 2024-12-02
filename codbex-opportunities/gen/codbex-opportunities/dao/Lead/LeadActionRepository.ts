import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface LeadActionEntity {
    readonly Id: number;
    Date?: Date;
    Subject?: string;
    Lead?: number;
    Type?: number;
    Status?: number;
    Note?: string;
    Timestamp?: Date;
}

export interface LeadActionCreateEntity {
    readonly Date?: Date;
    readonly Subject?: string;
    readonly Lead?: number;
    readonly Type?: number;
    readonly Status?: number;
    readonly Note?: string;
    readonly Timestamp?: Date;
}

export interface LeadActionUpdateEntity extends LeadActionCreateEntity {
    readonly Id: number;
}

export interface LeadActionEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Subject?: string | string[];
            Lead?: number | number[];
            Type?: number | number[];
            Status?: number | number[];
            Note?: string | string[];
            Timestamp?: Date | Date[];
        };
        notEquals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Subject?: string | string[];
            Lead?: number | number[];
            Type?: number | number[];
            Status?: number | number[];
            Note?: string | string[];
            Timestamp?: Date | Date[];
        };
        contains?: {
            Id?: number;
            Date?: Date;
            Subject?: string;
            Lead?: number;
            Type?: number;
            Status?: number;
            Note?: string;
            Timestamp?: Date;
        };
        greaterThan?: {
            Id?: number;
            Date?: Date;
            Subject?: string;
            Lead?: number;
            Type?: number;
            Status?: number;
            Note?: string;
            Timestamp?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Subject?: string;
            Lead?: number;
            Type?: number;
            Status?: number;
            Note?: string;
            Timestamp?: Date;
        };
        lessThan?: {
            Id?: number;
            Date?: Date;
            Subject?: string;
            Lead?: number;
            Type?: number;
            Status?: number;
            Note?: string;
            Timestamp?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Subject?: string;
            Lead?: number;
            Type?: number;
            Status?: number;
            Note?: string;
            Timestamp?: Date;
        };
    },
    $select?: (keyof LeadActionEntity)[],
    $sort?: string | (keyof LeadActionEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeadActionEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeadActionEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeadActionUpdateEntityEvent extends LeadActionEntityEvent {
    readonly previousEntity: LeadActionEntity;
}

export class LeadActionRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEADACTION",
        properties: [
            {
                name: "Id",
                column: "LEADACTION_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Date",
                column: "LEADACTION_DATE",
                type: "DATE",
            },
            {
                name: "Subject",
                column: "LEADACTION_SUBJECT",
                type: "VARCHAR",
            },
            {
                name: "Lead",
                column: "LEADACTION_LEAD",
                type: "INTEGER",
            },
            {
                name: "Type",
                column: "LEADACTION_TYPE",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "LEADACTION_STATUS",
                type: "INTEGER",
            },
            {
                name: "Note",
                column: "LEADACTION_NOTE",
                type: "VARCHAR",
            },
            {
                name: "Timestamp",
                column: "LEADACTION_TIMESTAMP",
                type: "TIMESTAMP",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadActionRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadActionEntityOptions): LeadActionEntity[] {
        return this.dao.list(options).map((e: LeadActionEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
    }

    public findById(id: number): LeadActionEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        return entity ?? undefined;
    }

    public create(entity: LeadActionCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEADACTION",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADACTION_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeadActionUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEADACTION",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEADACTION_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeadActionCreateEntity | LeadActionUpdateEntity): number {
        const id = (entity as LeadActionUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeadActionUpdateEntity);
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
            table: "CODBEX_LEADACTION",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADACTION_ID",
                value: id
            }
        });
    }

    public count(options?: LeadActionEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEADACTION"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeadActionEntityEvent | LeadActionUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Lead-LeadAction", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Lead-LeadAction").send(JSON.stringify(data));
    }
}
