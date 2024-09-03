import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeadQualificationAuthorityEntity {
    readonly Id: number;
    Name?: string;
}

export interface LeadQualificationAuthorityCreateEntity {
    readonly Name?: string;
}

export interface LeadQualificationAuthorityUpdateEntity extends LeadQualificationAuthorityCreateEntity {
    readonly Id: number;
}

export interface LeadQualificationAuthorityEntityOptions {
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
    $select?: (keyof LeadQualificationAuthorityEntity)[],
    $sort?: string | (keyof LeadQualificationAuthorityEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeadQualificationAuthorityEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeadQualificationAuthorityEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeadQualificationAuthorityUpdateEntityEvent extends LeadQualificationAuthorityEntityEvent {
    readonly previousEntity: LeadQualificationAuthorityEntity;
}

export class LeadQualificationAuthorityRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEADQUALIFICATIONAUTHORITY",
        properties: [
            {
                name: "Id",
                column: "LEADQUALIFICATIONAUTHORITY_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "LEADQUALIFICATIONAUTHORITY_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadQualificationAuthorityRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadQualificationAuthorityEntityOptions): LeadQualificationAuthorityEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeadQualificationAuthorityEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeadQualificationAuthorityCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEADQUALIFICATIONAUTHORITY",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATIONAUTHORITY_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeadQualificationAuthorityUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEADQUALIFICATIONAUTHORITY",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATIONAUTHORITY_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeadQualificationAuthorityCreateEntity | LeadQualificationAuthorityUpdateEntity): number {
        const id = (entity as LeadQualificationAuthorityUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeadQualificationAuthorityUpdateEntity);
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
            table: "CODBEX_LEADQUALIFICATIONAUTHORITY",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADQUALIFICATIONAUTHORITY_ID",
                value: id
            }
        });
    }

    public count(options?: LeadQualificationAuthorityEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEADQUALIFICATIONAUTHORITY"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeadQualificationAuthorityEntityEvent | LeadQualificationAuthorityUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-LeadQualificationAuthority", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-LeadQualificationAuthority").send(JSON.stringify(data));
    }
}
