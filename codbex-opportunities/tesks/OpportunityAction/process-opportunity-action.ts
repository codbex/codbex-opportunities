import { OpportunityActionRepository as OpportunityActionDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityActionRepository";
import { OpportunityNoteRepository as OpportunityNoteDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityNoteRepository";
import { OpportunityRepository as OpportunityDao } from "codbex-opportunities/gen/codbex-opportunities/dao/Opportunity/OpportunityRepository";

import { process } from "sdk/bpm";

try {

    const opportunityActionDao = new OpportunityActionDao();
    const opportunityNoteDao = new OpportunityNoteDao();
    const opportunityDao = new OpportunityDao();

    const execution = process.getExecutionContext();
    const executionId = execution.getId();

    console.log("Process Id: ", executionId);

    const opportunityId = process.getVariable(executionId, "Opportunity");
    const opportunityActionSubject = process.getVariable(executionId, "OpportunityActionSubject");
    const opportunityActionDescription = process.getVariable(executionId, "OpportunityActionDescription");
    const opportunityActionId = process.getVariable(executionId, "OpportunityActionId");

    console.log("Opportunity Id: ", opportunityId);
    console.log("Description: ", opportunityActionDescription);
    console.log("Action Id: ", opportunityActionId);

    const opportunity = await opportunityDao.findById(opportunityId);
    if (!opportunity) {
        throw new Error(`Bank account with ID ${opportunityId} not found!`);
    }

    console.log("Opportunity: ", JSON.stringify(opportunity));

    const opportunityAction = await opportunityActionDao.findById(opportunityActionId);
    if (!opportunityAction) {
        throw new Error(`Bank account with ID ${opportunityActionId} not found!`);
    }

    console.log("Opportunity Action: ", JSON.stringify(opportunityAction));

    const body = {
        "Subject": opportunityActionSubject,
        "Description": opportunityActionDescription,
        "Opportunity": opportunityId,
    };

    console.log("Body: ", JSON.stringify(body));

    const newOpportunityNote = await opportunityNoteDao.create(body);
    if (!newOpportunityNote) {
        // throw new Error("OpportunityNote creation failed!");
    }
} catch (e) {
    console.log("Error: ", e);
}
