import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface NoteTypeEntity {
    readonly Id: number;
    Name?: string;
}

export interface NoteTypeCreateEntity {
    readonly Name?: string;
}

export interface NoteTypeUpdateEntity extends NoteTypeCreateEntity {
    readonly Id: number;
}

export interface NoteTypeEntityOptions {
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
    $select?: (keyof NoteTypeEntity)[],
    $sort?: string | (keyof NoteTypeEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface NoteTypeEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<NoteTypeEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class NoteTypeRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_NOTETYPE",
        properties: [
            {
                name: "Id",
                column: "NOTETYPE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "NOTETYPE_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(NoteTypeRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: NoteTypeEntityOptions): NoteTypeEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): NoteTypeEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: NoteTypeCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_NOTETYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "NOTETYPE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: NoteTypeUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_NOTETYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "NOTETYPE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: NoteTypeCreateEntity | NoteTypeUpdateEntity): number {
        const id = (entity as NoteTypeUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as NoteTypeUpdateEntity);
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
            table: "CODBEX_NOTETYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "NOTETYPE_ID",
                value: id
            }
        });
    }

    public count(options?: NoteTypeEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__NOTETYPE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: NoteTypeEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-opportunities-Settings-NoteType", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-opportunities-Settings-NoteType").send(JSON.stringify(data));
    }
}
