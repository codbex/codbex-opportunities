import { process } from "sdk/bpm";

export const trigger = (event) => {

    if (event.operation === "create") {
        const opportunityAction = event.entity;

        const opportunityActionId = opportunityAction.Id;
        const opportunityActionDescription = opportunityAction.Description;
        const opportunity = opportunityAction.Opportunity;
        const opportunityActionDate = opportunityAction.Date;

        const processInstanceId = process.start("opportunity-action-process", {
            OpportunityActionDate: opportunityActionDate,
            Opportunity: opportunity,
            OpportunityActionDescription: opportunityActionDescription,
            OpportunityActionId: opportunityActionId
        });

        if (processInstanceId == null) {
            console.log("Failed to create opportunity action process!");
            return;
        }
    }
}