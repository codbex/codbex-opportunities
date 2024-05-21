import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeadEntity {
    readonly Id: number;
    Name?: string;
    CompanyName?: string;
    ContactName?: string;
    ContactDesignation?: string;
    ContactEmail?: string;
    ContactPhone?: string;
    Industry?: number;
    Status?: number;
    Owner?: number;
}

export interface LeadCreateEntity {
    readonly Name?: string;
    readonly CompanyName?: string;
    readonly ContactName?: string;
    readonly ContactDesignation?: string;
    readonly ContactEmail?: string;
    readonly ContactPhone?: string;
    readonly Industry?: number;
    readonly Status?: number;
    readonly Owner?: number;
}

export interface LeadUpdateEntity extends LeadCreateEntity {
    readonly Id: number;
}

export interface LeadEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            CompanyName?: string | string[];
            ContactName?: string | string[];
            ContactDesignation?: string | string[];
            ContactEmail?: string | string[];
            ContactPhone?: string | string[];
            Industry?: number | number[];
            Status?: number | number[];
            Owner?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            CompanyName?: string | string[];
            ContactName?: string | string[];
            ContactDesignation?: string | string[];
            ContactEmail?: string | string[];
            ContactPhone?: string | string[];
            Industry?: number | number[];
            Status?: number | number[];
            Owner?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            CompanyName?: string;
            ContactName?: string;
            ContactDesignation?: string;
            ContactEmail?: string;
            ContactPhone?: string;
            Industry?: number;
            Status?: number;
            Owner?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            CompanyName?: string;
            ContactName?: string;
            ContactDesignation?: string;
            ContactEmail?: string;
            ContactPhone?: string;
            Industry?: number;
            Status?: number;
            Owner?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            CompanyName?: string;
            ContactName?: string;
            ContactDesignation?: string;
            ContactEmail?: string;
            ContactPhone?: string;
            Industry?: number;
            Status?: number;
            Owner?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            CompanyName?: string;
            ContactName?: string;
            ContactDesignation?: string;
            ContactEmail?: string;
            ContactPhone?: string;
            Industry?: number;
            Status?: number;
            Owner?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            CompanyName?: string;
            ContactName?: string;
            ContactDesignation?: string;
            ContactEmail?: string;
            ContactPhone?: string;
            Industry?: number;
            Status?: number;
            Owner?: number;
        };
    },
    $select?: (keyof LeadEntity)[],
    $sort?: string | (keyof LeadEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeadEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeadEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeadUpdateEntityEvent extends LeadEntityEvent {
    readonly previousEntity: LeadEntity;
}

export class LeadRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEAD",
        properties: [
            {
                name: "Id",
                column: "LEAD_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "LEAD_NAME",
                type: "VARCHAR",
            },
            {
                name: "CompanyName",
                column: "LEAD_COMPANYNAME",
                type: "VARCHAR",
            },
            {
                name: "ContactName",
                column: "LEAD_CONTACTNAME",
                type: "VARCHAR",
            },
            {
                name: "ContactDesignation",
                column: "LEAD_CONTACTDESIGNATION",
                type: "VARCHAR",
            },
            {
                name: "ContactEmail",
                column: "LEAD_CONTACTEMAIL",
                type: "VARCHAR",
            },
            {
                name: "ContactPhone",
                column: "LEAD_CONTACTPHONE",
                type: "VARCHAR",
            },
            {
                name: "Industry",
                column: "LEAD_INDUSTRY",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "LEAD_LEADSTATUS",
                type: "INTEGER",
            },
            {
                name: "Owner",
                column: "LEAD_OWNER",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadEntityOptions): LeadEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeadEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeadCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEAD",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAD_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeadUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEAD",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEAD_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeadCreateEntity | LeadUpdateEntity): number {
        const id = (entity as LeadUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeadUpdateEntity);
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
            table: "CODBEX_LEAD",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAD_ID",
                value: id
            }
        });
    }

    public count(options?: LeadEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__LEAD"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeadEntityEvent | LeadUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Lead-Lead", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Lead-Lead").send(JSON.stringify(data));
    }
}
