import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface OpportunityActionEntity {
    readonly Id: number;
    Date?: Date;
    Due?: Date;
    Subject?: string;
    Opportunity?: number;
    Initiator?: number;
    Description?: string;
    Type?: number;
    Status?: number;
}

export interface OpportunityActionCreateEntity {
    readonly Date?: Date;
    readonly Due?: Date;
    readonly Subject?: string;
    readonly Opportunity?: number;
    readonly Initiator?: number;
    readonly Description?: string;
    readonly Type?: number;
    readonly Status?: number;
}

export interface OpportunityActionUpdateEntity extends OpportunityActionCreateEntity {
    readonly Id: number;
}

export interface OpportunityActionEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Due?: Date | Date[];
            Subject?: string | string[];
            Opportunity?: number | number[];
            Initiator?: number | number[];
            Description?: string | string[];
            Type?: number | number[];
            Status?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Due?: Date | Date[];
            Subject?: string | string[];
            Opportunity?: number | number[];
            Initiator?: number | number[];
            Description?: string | string[];
            Type?: number | number[];
            Status?: number | number[];
        };
        contains?: {
            Id?: number;
            Date?: Date;
            Due?: Date;
            Subject?: string;
            Opportunity?: number;
            Initiator?: number;
            Description?: string;
            Type?: number;
            Status?: number;
        };
        greaterThan?: {
            Id?: number;
            Date?: Date;
            Due?: Date;
            Subject?: string;
            Opportunity?: number;
            Initiator?: number;
            Description?: string;
            Type?: number;
            Status?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Due?: Date;
            Subject?: string;
            Opportunity?: number;
            Initiator?: number;
            Description?: string;
            Type?: number;
            Status?: number;
        };
        lessThan?: {
            Id?: number;
            Date?: Date;
            Due?: Date;
            Subject?: string;
            Opportunity?: number;
            Initiator?: number;
            Description?: string;
            Type?: number;
            Status?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Due?: Date;
            Subject?: string;
            Opportunity?: number;
            Initiator?: number;
            Description?: string;
            Type?: number;
            Status?: number;
        };
    },
    $select?: (keyof OpportunityActionEntity)[],
    $sort?: string | (keyof OpportunityActionEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OpportunityActionEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OpportunityActionEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OpportunityActionUpdateEntityEvent extends OpportunityActionEntityEvent {
    readonly previousEntity: OpportunityActionEntity;
}

export class OpportunityActionRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_OPPORTUNITYACTION",
        properties: [
            {
                name: "Id",
                column: "OPPORTUNITYACTION_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Date",
                column: "OPPORTUNITYACTION_DATE",
                type: "DATE",
            },
            {
                name: "Due",
                column: "OPPORTUNITYACTION_DUE",
                type: "DATE",
            },
            {
                name: "Subject",
                column: "OPPORTUNITYACTION_SUBJECT",
                type: "VARCHAR",
            },
            {
                name: "Opportunity",
                column: "OPPORTUNITYACTION_OPPORTUNITY",
                type: "INTEGER",
            },
            {
                name: "Initiator",
                column: "OPPORTUNITYACTION_EMPLOYEE",
                type: "INTEGER",
            },
            {
                name: "Description",
                column: "OPPORTUNITYACTION_NOTE",
                type: "VARCHAR",
            },
            {
                name: "Type",
                column: "OPPORTUNITYACTION_TYPE",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "OPPORTUNITYACTION_STATUS",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OpportunityActionRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OpportunityActionEntityOptions): OpportunityActionEntity[] {
        return this.dao.list(options).map((e: OpportunityActionEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Due");
            return e;
        });
    }

    public findById(id: number): OpportunityActionEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Due");
        return entity ?? undefined;
    }

    public create(entity: OpportunityActionCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Due");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_OPPORTUNITYACTION",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYACTION_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OpportunityActionUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Due");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_OPPORTUNITYACTION",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "OPPORTUNITYACTION_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OpportunityActionCreateEntity | OpportunityActionUpdateEntity): number {
        const id = (entity as OpportunityActionUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OpportunityActionUpdateEntity);
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
            table: "CODBEX_OPPORTUNITYACTION",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYACTION_ID",
                value: id
            }
        });
    }

    public count(options?: OpportunityActionEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_OPPORTUNITYACTION"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OpportunityActionEntityEvent | OpportunityActionUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Opportunity-OpportunityAction", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Opportunity-OpportunityAction").send(JSON.stringify(data));
    }
}
