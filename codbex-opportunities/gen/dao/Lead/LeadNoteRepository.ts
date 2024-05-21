import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeadNoteEntity {
    readonly Id: number;
    Lead?: number;
    Type?: number;
    Note?: string;
    Timestamp?: Date;
}

export interface LeadNoteCreateEntity {
    readonly Lead?: number;
    readonly Type?: number;
    readonly Note?: string;
    readonly Timestamp?: Date;
}

export interface LeadNoteUpdateEntity extends LeadNoteCreateEntity {
    readonly Id: number;
}

export interface LeadNoteEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Lead?: number | number[];
            Type?: number | number[];
            Note?: string | string[];
            Timestamp?: Date | Date[];
        };
        notEquals?: {
            Id?: number | number[];
            Lead?: number | number[];
            Type?: number | number[];
            Note?: string | string[];
            Timestamp?: Date | Date[];
        };
        contains?: {
            Id?: number;
            Lead?: number;
            Type?: number;
            Note?: string;
            Timestamp?: Date;
        };
        greaterThan?: {
            Id?: number;
            Lead?: number;
            Type?: number;
            Note?: string;
            Timestamp?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Lead?: number;
            Type?: number;
            Note?: string;
            Timestamp?: Date;
        };
        lessThan?: {
            Id?: number;
            Lead?: number;
            Type?: number;
            Note?: string;
            Timestamp?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            Lead?: number;
            Type?: number;
            Note?: string;
            Timestamp?: Date;
        };
    },
    $select?: (keyof LeadNoteEntity)[],
    $sort?: string | (keyof LeadNoteEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeadNoteEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeadNoteEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeadNoteUpdateEntityEvent extends LeadNoteEntityEvent {
    readonly previousEntity: LeadNoteEntity;
}

export class LeadNoteRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEADNOTE",
        properties: [
            {
                name: "Id",
                column: "LEADNOTE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Lead",
                column: "LEADNOTE_LEAD",
                type: "INTEGER",
            },
            {
                name: "Type",
                column: "LEADNOTE_NOTETYPEID",
                type: "INTEGER",
            },
            {
                name: "Note",
                column: "LEADNOTE_NOTE",
                type: "VARCHAR",
            },
            {
                name: "Timestamp",
                column: "LEADNOTE_TIMESTAMP",
                type: "TIMESTAMP",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeadNoteRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeadNoteEntityOptions): LeadNoteEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeadNoteEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeadNoteCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEADNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADNOTE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeadNoteUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEADNOTE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEADNOTE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeadNoteCreateEntity | LeadNoteUpdateEntity): number {
        const id = (entity as LeadNoteUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeadNoteUpdateEntity);
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
            table: "CODBEX_LEADNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEADNOTE_ID",
                value: id
            }
        });
    }

    public count(options?: LeadNoteEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__LEADNOTE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeadNoteEntityEvent | LeadNoteUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Lead-LeadNote", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Lead-LeadNote").send(JSON.stringify(data));
    }
}
