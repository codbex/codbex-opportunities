import { process } from "sdk/bpm";

const execution = process.getExecutionContext();
const executionId = execution.getId();

const opportunityActionDue = process.getVariable(executionId, "OpportunityActionDue");

if (!opportunityActionDue) {
    throw new Error("OpportunityActionDate is missing or invalid.");
}

const currentTime = new Date();
const scheduledTime = new Date(opportunityActionDue);

if (isNaN(scheduledTime.getTime())) {
    throw new Error("OpportunityActionDate is not a valid date.");
}

if (scheduledTime <= currentTime) {
    throw new Error("OpportunityActionDate date has already passed.");
}

process.setVariable(executionId, "TimerDelay", scheduledTime.toISOString());
