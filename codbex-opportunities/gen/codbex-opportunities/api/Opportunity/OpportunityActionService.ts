import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { OpportunityActionRepository, OpportunityActionEntityOptions } from "../../dao/Opportunity/OpportunityActionRepository";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("codbex-opportunities-Opportunity-OpportunityAction", ["validate"]);

@Controller
class OpportunityActionService {

    private readonly repository = new OpportunityActionRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            const options: OpportunityActionEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            let Opportunity = parseInt(ctx.queryParameters.Opportunity);
            Opportunity = isNaN(Opportunity) ? ctx.queryParameters.Opportunity : Opportunity;

            if (Opportunity !== undefined) {
                options.$filter = {
                    equals: {
                        Opportunity: Opportunity
                    }
                };
            }

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/")
    public create(entity: any) {
        try {
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-opportunities/gen/codbex-opportunities/api/Opportunity/OpportunityActionService.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count() {
        try {
            return this.repository.count();
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            return this.repository.count(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(_: any, ctx: any) {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("OpportunityAction not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
            entity.Id = ctx.pathParameters.id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Delete("/:id")
    public deleteById(_: any, ctx: any) {
        try {
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("OpportunityAction not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === "ForbiddenError") {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Date === null || entity.Date === undefined) {
            throw new ValidationError(`The 'Date' property is required, provide a valid value`);
        }
        if (entity.Subject === null || entity.Subject === undefined) {
            throw new ValidationError(`The 'Subject' property is required, provide a valid value`);
        }
        if (entity.Subject?.length > 100) {
            throw new ValidationError(`The 'Subject' exceeds the maximum length of [100] characters`);
        }
        if (entity.Initiator === null || entity.Initiator === undefined) {
            throw new ValidationError(`The 'Initiator' property is required, provide a valid value`);
        }
        if (entity.Description?.length > 1000) {
            throw new ValidationError(`The 'Description' exceeds the maximum length of [1000] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
