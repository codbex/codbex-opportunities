import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OpportunityNoteEntity {
    readonly Id: number;
    NoteType?: number;
    Note?: string;
    Timestamp?: Date;
}

export interface OpportunityNoteCreateEntity {
    readonly NoteType?: number;
    readonly Note?: string;
    readonly Timestamp?: Date;
}

export interface OpportunityNoteUpdateEntity extends OpportunityNoteCreateEntity {
    readonly Id: number;
}

export interface OpportunityNoteEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            NoteType?: number | number[];
            Note?: string | string[];
            Timestamp?: Date | Date[];
        };
        notEquals?: {
            Id?: number | number[];
            NoteType?: number | number[];
            Note?: string | string[];
            Timestamp?: Date | Date[];
        };
        contains?: {
            Id?: number;
            NoteType?: number;
            Note?: string;
            Timestamp?: Date;
        };
        greaterThan?: {
            Id?: number;
            NoteType?: number;
            Note?: string;
            Timestamp?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            NoteType?: number;
            Note?: string;
            Timestamp?: Date;
        };
        lessThan?: {
            Id?: number;
            NoteType?: number;
            Note?: string;
            Timestamp?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            NoteType?: number;
            Note?: string;
            Timestamp?: Date;
        };
    },
    $select?: (keyof OpportunityNoteEntity)[],
    $sort?: string | (keyof OpportunityNoteEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OpportunityNoteEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OpportunityNoteEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OpportunityNoteUpdateEntityEvent extends OpportunityNoteEntityEvent {
    readonly previousEntity: OpportunityNoteEntity;
}

export class OpportunityNoteRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_OPPORTUNITYNOTE",
        properties: [
            {
                name: "Id",
                column: "OPPORTUNITYNOTE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "NoteType",
                column: "OPPORTUNITYNOTE_NOTETYPE",
                type: "INTEGER",
            },
            {
                name: "Note",
                column: "OPPORTUNITYNOTE_NOTE",
                type: "VARCHAR",
            },
            {
                name: "Timestamp",
                column: "OPPORTUNITYNOTE_TIMESTAMP",
                type: "TIMESTAMP",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OpportunityNoteRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OpportunityNoteEntityOptions): OpportunityNoteEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OpportunityNoteEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OpportunityNoteCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_OPPORTUNITYNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYNOTE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OpportunityNoteUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_OPPORTUNITYNOTE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "OPPORTUNITYNOTE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OpportunityNoteCreateEntity | OpportunityNoteUpdateEntity): number {
        const id = (entity as OpportunityNoteUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OpportunityNoteUpdateEntity);
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
            table: "CODBEX_OPPORTUNITYNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "OPPORTUNITYNOTE_ID",
                value: id
            }
        });
    }

    public count(options?: OpportunityNoteEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_OPPORTUNITYNOTE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OpportunityNoteEntityEvent | OpportunityNoteUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Opportunity-OpportunityNote", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Opportunity-OpportunityNote").send(JSON.stringify(data));
    }
}
