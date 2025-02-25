import { process } from "sdk/bpm";

const execution = process.getExecutionContext();
const executionId = execution.getId();

const opportunityActionDate = process.getVariable(executionId, "OpportunityActionDate");

if (!opportunityActionDate) {
    throw new Error("OpportunityActionDate is missing or invalid.");
}

const currentTime = new Date();
const scheduledTime = new Date(opportunityActionDate);

if (isNaN(scheduledTime.getTime())) {
    throw new Error("OpportunityActionDate is not a valid date.");
}

if (scheduledTime <= currentTime) {
    throw new Error("OpportunityActionDate date has already passed.");
}

process.setVariable(executionId, "TimerDelay", scheduledTime.toISOString());
