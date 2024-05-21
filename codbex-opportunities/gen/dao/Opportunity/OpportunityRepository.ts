import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OpportunityEntity {
    readonly Id: number;
    Name?: string;
    Source?: string;
    Customer?: number;
    Amount?: number;
    Currency?: string;
    Lead?: number;
    Type?: number;
    Priority?: number;
    Probability?: number;
    Status?: number;
    Owner?: number;
}

export interface OpportunityCreateEntity {
    readonly Name?: string;
    readonly Source?: string;
    readonly Customer?: number;
    readonly Amount?: number;
    readonly Currency?: string;
    readonly Lead?: number;
    readonly Type?: number;
    readonly Priority?: number;
    readonly Probability?: number;
    readonly Status?: number;
    readonly Owner?: number;
}

export interface OpportunityUpdateEntity extends OpportunityCreateEntity {
    readonly Id: number;
}

export interface OpportunityEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Source?: string | string[];
            Customer?: number | number[];
            Amount?: number | number[];
            Currency?: string | string[];
            Lead?: number | number[];
            Type?: number | number[];
            Priority?: number | number[];
            Probability?: number | number[];
            Status?: number | number[];
            Owner?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Source?: string | string[];
            Customer?: number | number[];
            Amount?: number | number[];
            Currency?: string | string[];
            Lead?: number | number[];
            Type?: number | number[];
            Priority?: number | number[];
            Probability?: number | number[];
            Status?: number | number[];
            Owner?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Source?: string;
            Customer?: number;
            Amount?: number;
            Currency?: string;
            Lead?: number;
            Type?: number;
            Priority?: number;
            Probability?: number;
            Status?: number;
            Owner?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Source?: string;
            Customer?: number;
            Amount?: number;
            Currency?: string;
            Lead?: number;
            Type?: number;
            Priority?: number;
            Probability?: number;
            Status?: number;
            Owner?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Source?: string;
            Customer?: number;
            Amount?: number;
            Currency?: string;
            Lead?: number;
            Type?: number;
            Priority?: number;
            Probability?: number;
            Status?: number;
            Owner?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Source?: string;
            Customer?: number;
            Amount?: number;
            Currency?: string;
            Lead?: number;
            Type?: number;
            Priority?: number;
            Probability?: number;
            Status?: number;
            Owner?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Source?: string;
            Customer?: number;
            Amount?: number;
            Currency?: string;
            Lead?: number;
            Type?: number;
            Priority?: number;
            Probability?: number;
            Status?: number;
            Owner?: number;
        };
    },
    $select?: (keyof OpportunityEntity)[],
    $sort?: string | (keyof OpportunityEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OpportunityEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OpportunityEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class OpportunityRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_OPPORTUNITY",
        properties: [
            {
                name: "Id",
                column: "OPPORTUNITY_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "OPPORTUNITY_NAME",
                type: "VARCHAR",
            },
            {
                name: "Source",
                column: "OPPORTUNITY_SOURCE",
                type: "VARCHAR",
            },
            {
                name: "Customer",
                column: "OPPORTUNITY_CUSTOMER",
                type: "INTEGER",
            },
            {
                name: "Amount",
                column: "OPPORTUNITY_PROPERTY4",
                type: "DOUBLE",
            },
            {
                name: "Currency",
                column: "OPPORTUNITY_CURRENCYCODE",
                type: "VARCHAR",
            },
            {
                name: "Lead",
                column: "OPPORTUNITY_LEAD",
                type: "INTEGER",
            },
            {
                name: "Type",
                column: "OPPORTUNITY_TYPE",
                type: "INTEGER",
            },
            {
                name: "Priority",
                column: "OPPORTUNITY_PRIORITY",
                type: "INTEGER",
            },
            {
                name: "Probability",
                column: "OPPORTUNITY_PROBABILITY",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "OPPORTUNITY_STATUS",
                type: "INTEGER",
            },
            {
                name: "Owner",
                column: "OPPORTUNITY_OWNER",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OpportunityRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OpportunityEntityOptions): OpportunityEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OpportunityEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OpportunityCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_OPPORTUNITY",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITY_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OpportunityUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_OPPORTUNITY",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITY_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OpportunityCreateEntity | OpportunityUpdateEntity): number {
        const id = (entity as OpportunityUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OpportunityUpdateEntity);
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
            table: "CODBEX_OPPORTUNITY",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITY_ID",
                value: id
            }
        });
    }

    public count(options?: OpportunityEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__OPPORTUNITY"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OpportunityEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Opportunity-Opportunity", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Opportunity-Opportunity").send(JSON.stringify(data));
    }
}
