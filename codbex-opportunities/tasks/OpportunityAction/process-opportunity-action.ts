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

    const opportunityId = process.getVariable(executionId, "Opportunity");
    const opportunityActionSubject = process.getVariable(executionId, "OpportunityActionSubject");
    const opportunityActionDescription = process.getVariable(executionId, "OpportunityActionDescription");
    const opportunityActionId = process.getVariable(executionId, "OpportunityActionId");

    const opportunity = await opportunityDao.findById(opportunityId);
    if (!opportunity) {
        throw new Error(`Opportunity with ID ${opportunityId} not found!`);
    }

    var opportunityAction = await opportunityActionDao.findById(opportunityActionId);
    if (!opportunityAction) {
        throw new Error(`Opportunity Action with ID ${opportunityActionId} not found!`);
    }

    const body = {
        "Subject": opportunityActionSubject,
        "Description": opportunityActionDescription,
        "Opportunity": opportunityId,
    };

    const newOpportunityNote = await opportunityNoteDao.create(body);

    opportunityAction.Status = 6;

    opportunityActionDao.update(opportunityAction);

} catch (e) {
    console.log("Error: ", e);
}
