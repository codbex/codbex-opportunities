import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";
// custom imports
import { NumberGeneratorService } from "codbex-number-generator/service/generator";

export interface LeadEntity {
    readonly Id: number;
    Number?: string;
    Name?: string;
    Country?: number;
    City?: number;
    Company?: string;
    Designation?: string;
    Email?: string;
    Phone?: string;
    Status?: number;
    Owner?: number;
    Date?: Date;
}

export interface LeadCreateEntity {
    readonly Name?: string;
    readonly Country?: number;
    readonly City?: number;
    readonly Company?: string;
    readonly Designation?: string;
    readonly Email?: string;
    readonly Phone?: string;
    readonly Status?: number;
    readonly Owner?: number;
    readonly Date?: Date;
}

export interface LeadUpdateEntity extends LeadCreateEntity {
    readonly Id: number;
}

export interface LeadEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Name?: string | string[];
            Country?: number | number[];
            City?: number | number[];
            Company?: string | string[];
            Designation?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
            Status?: number | number[];
            Owner?: number | number[];
            Date?: Date | Date[];
        };
        notEquals?: {
            Id?: number | number[];
            Number?: string | string[];
            Name?: string | string[];
            Country?: number | number[];
            City?: number | number[];
            Company?: string | string[];
            Designation?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
            Status?: number | number[];
            Owner?: number | number[];
            Date?: Date | Date[];
        };
        contains?: {
            Id?: number;
            Number?: string;
            Name?: string;
            Country?: number;
            City?: number;
            Company?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
            Status?: number;
            Owner?: number;
            Date?: Date;
        };
        greaterThan?: {
            Id?: number;
            Number?: string;
            Name?: string;
            Country?: number;
            City?: number;
            Company?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
            Status?: number;
            Owner?: number;
            Date?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Number?: string;
            Name?: string;
            Country?: number;
            City?: number;
            Company?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
            Status?: number;
            Owner?: number;
            Date?: Date;
        };
        lessThan?: {
            Id?: number;
            Number?: string;
            Name?: string;
            Country?: number;
            City?: number;
            Company?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
            Status?: number;
            Owner?: number;
            Date?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            Number?: string;
            Name?: string;
            Country?: number;
            City?: number;
            Company?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
            Status?: number;
            Owner?: number;
            Date?: Date;
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
                name: "Number",
                column: "LEAD_NAME",
                type: "VARCHAR",
            },
            {
                name: "Name",
                column: "LEAD_NAME",
                type: "VARCHAR",
            },
            {
                name: "Country",
                column: "LEAD_COUNTRY",
                type: "INTEGER",
            },
            {
                name: "City",
                column: "LEAD_CITY",
                type: "INTEGER",
            },
            {
                name: "Company",
                column: "LEAD_COMPANY",
                type: "VARCHAR",
            },
            {
                name: "Designation",
                column: "LEAD_DESIGNATION",
                type: "VARCHAR",
            },
            {
                name: "Email",
                column: "LEAD_EMAIL",
                type: "VARCHAR",
            },
            {
                name: "Phone",
                column: "LEAD_PHONE",
                type: "VARCHAR",
            },
            {
                name: "Status",
                column: "LEAD_STATUS",
                type: "INTEGER",
            },
            {
                name: "Owner",
                column: "LEAD_OWNER",
                type: "INTEGER",
            },
            {
                name: "Date",
                column: "LEAD_DATE",
                type: "DATE",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadEntityOptions): LeadEntity[] {
        return this.dao.list(options).map((e: LeadEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
    }

    public findById(id: number): LeadEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        return entity ?? undefined;
    }

    public create(entity: LeadCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        // @ts-ignore
        (entity as LeadEntity).Number = new NumberGeneratorService().generate(1);
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
        // EntityUtils.setLocalDate(entity, "Date");
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
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEAD"');
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
