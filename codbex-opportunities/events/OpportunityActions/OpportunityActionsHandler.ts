import { process } from "sdk/bpm";

export const trigger = (event) => {

    if (event.operation === "create") {
        const opportunityAction = event.entity;

        const opportunityActionId = opportunityAction.Id;
        const operationaActionSubject = opportunityAction.Subject
        const opportunityActionDescription = opportunityAction.Description;
        const opportunity = opportunityAction.Opportunity;
        const opportunityActionDue = opportunityAction.Due;

        const processInstanceId = process.start("opportunity-action-process", {
            OpportunityActionDue: opportunityActionDue,
            Opportunity: opportunity,
            OpportunityActionSubject: operationaActionSubject,
            OpportunityActionDescription: opportunityActionDescription,
            OpportunityActionId: opportunityActionId
        });

        if (processInstanceId == null) {
            console.log("Failed to create opportunity action process!");
            return;
        }
    }
}