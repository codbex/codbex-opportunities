import { OpportunityActionRepository as OpportunityActionDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityActionRepository";
import { OpportunityNoteRepository as OpportunityNoteDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityNoteRepository";
import { OpportunityRepository as OpportunityDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityRepository";

import { process } from "sdk/bpm";

const opportunityActionDao = new OpportunityActionDao();
const opportunityNoteDao = new OpportunityNoteDao();
const opportunityDao = new OpportunityDao();

const execution = process.getExecutionContext();
const executionId = execution.getId();

const opportunityId = process.getVariable(executionId, "Opportunity");
const opportunityActionDescription = process.getVariable(executionId, "OpportunityActionDescription");
const opportunityActionId = process.getVariable(executionId, "OpportunityActionId");

const opportunity = await opportunityDao.findById(opportunityId);
if (!opportunity) {
    throw new Error(`Bank account with ID ${opportunityId} not found!`);
}

const opportunityAction = await opportunityActionDao.findById(opportunityActionId);
if (!opportunityAction) {
    throw new Error(`Bank account with ID ${opportunityActionId} not found!`);
}

const body = {
    "Action": opportunityActionId,
    "Description": opportunityActionDescription,
    "Opportunity": opportunity,
};

const newOpportunityNote = await opportunityNoteDao.create(body);
if (!newOpportunityNote) {
    throw new Error("OpportunityNote creation failed!");
}
