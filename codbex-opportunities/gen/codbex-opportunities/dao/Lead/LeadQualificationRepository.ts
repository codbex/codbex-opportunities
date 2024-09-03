import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeadQualificationEntity {
    readonly Id: number;
    Budget?: number;
    Authority?: number;
    Need?: number;
    Timeline?: number;
    Lead?: number;
}

export interface LeadQualificationCreateEntity {
    readonly Budget?: number;
    readonly Authority?: number;
    readonly Need?: number;
    readonly Timeline?: number;
    readonly Lead?: number;
}

export interface LeadQualificationUpdateEntity extends LeadQualificationCreateEntity {
    readonly Id: number;
}

export interface LeadQualificationEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Budget?: number | number[];
            Authority?: number | number[];
            Need?: number | number[];
            Timeline?: number | number[];
            Lead?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Budget?: number | number[];
            Authority?: number | number[];
            Need?: number | number[];
            Timeline?: number | number[];
            Lead?: number | number[];
        };
        contains?: {
            Id?: number;
            Budget?: number;
            Authority?: number;
            Need?: number;
            Timeline?: number;
            Lead?: number;
        };
        greaterThan?: {
            Id?: number;
            Budget?: number;
            Authority?: number;
            Need?: number;
            Timeline?: number;
            Lead?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Budget?: number;
            Authority?: number;
            Need?: number;
            Timeline?: number;
            Lead?: number;
        };
        lessThan?: {
            Id?: number;
            Budget?: number;
            Authority?: number;
            Need?: number;
            Timeline?: number;
            Lead?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Budget?: number;
            Authority?: number;
            Need?: number;
            Timeline?: number;
            Lead?: number;
        };
    },
    $select?: (keyof LeadQualificationEntity)[],
    $sort?: string | (keyof LeadQualificationEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeadQualificationEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeadQualificationEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeadQualificationUpdateEntityEvent extends LeadQualificationEntityEvent {
    readonly previousEntity: LeadQualificationEntity;
}

export class LeadQualificationRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEADQUALIFICATION",
        properties: [
            {
                name: "Id",
                column: "LEADQUALIFICATION_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Budget",
                column: "LEADQUALIFICATION_BUDGET",
                type: "DECIMAL",
            },
            {
                name: "Authority",
                column: "LEADQUALIFICATION_AUTHORITY",
                type: "INTEGER",
            },
            {
                name: "Need",
                column: "LEADQUALIFICATION_NEED",
                type: "INTEGER",
            },
            {
                name: "Timeline",
                column: "LEADQUALIFICATION_TIMELINE",
                type: "INTEGER",
            },
            {
                name: "Lead",
                column: "LEADQUALIFICATION_LEAD",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadQualificationRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadQualificationEntityOptions): LeadQualificationEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeadQualificationEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeadQualificationCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEADQUALIFICATION",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATION_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeadQualificationUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEADQUALIFICATION",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATION_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeadQualificationCreateEntity | LeadQualificationUpdateEntity): number {
        const id = (entity as LeadQualificationUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeadQualificationUpdateEntity);
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
            table: "CODBEX_LEADQUALIFICATION",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATION_ID",
                value: id
            }
        });
    }

    public count(options?: LeadQualificationEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEADQUALIFICATION"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeadQualificationEntityEvent | LeadQualificationUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Lead-LeadQualification", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Lead-LeadQualification").send(JSON.stringify(data));
    }
}
