import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { LeadRepository, LeadEntityOptions } from "../../dao/Lead/LeadRepository";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("codbex-opportunities-Lead-Lead", ["validate"]);

@Controller
class LeadService {

    private readonly repository = new LeadRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            const options: LeadEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

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
            response.setHeader("Content-Location", "/services/ts/codbex-opportunities/gen/api/Lead/LeadService.ts/" + entity.Id);
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
                HttpUtils.sendResponseNotFound("Lead not found");
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
                HttpUtils.sendResponseNotFound("Lead not found");
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
        if (entity.Name === null || entity.Name === undefined) {
            throw new ValidationError(`The 'Name' property is required, provide a valid value`);
        }
        if (entity.Name?.length > 255) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [255] characters`);
        }
        if (entity.CompanyName === null || entity.CompanyName === undefined) {
            throw new ValidationError(`The 'CompanyName' property is required, provide a valid value`);
        }
        if (entity.CompanyName?.length > 255) {
            throw new ValidationError(`The 'CompanyName' exceeds the maximum length of [255] characters`);
        }
        if (entity.ContactName === null || entity.ContactName === undefined) {
            throw new ValidationError(`The 'ContactName' property is required, provide a valid value`);
        }
        if (entity.ContactName?.length > 255) {
            throw new ValidationError(`The 'ContactName' exceeds the maximum length of [255] characters`);
        }
        if (entity.ContactDesignation === null || entity.ContactDesignation === undefined) {
            throw new ValidationError(`The 'ContactDesignation' property is required, provide a valid value`);
        }
        if (entity.ContactDesignation?.length > 255) {
            throw new ValidationError(`The 'ContactDesignation' exceeds the maximum length of [255] characters`);
        }
        if (entity.ContactEmail === null || entity.ContactEmail === undefined) {
            throw new ValidationError(`The 'ContactEmail' property is required, provide a valid value`);
        }
        if (entity.ContactEmail?.length > 255) {
            throw new ValidationError(`The 'ContactEmail' exceeds the maximum length of [255] characters`);
        }
        if (entity.ContactPhone === null || entity.ContactPhone === undefined) {
            throw new ValidationError(`The 'ContactPhone' property is required, provide a valid value`);
        }
        if (entity.ContactPhone?.length > 255) {
            throw new ValidationError(`The 'ContactPhone' exceeds the maximum length of [255] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
