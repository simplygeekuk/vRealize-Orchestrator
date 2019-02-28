/*global wfTokens itemParam*/

/**
 * Prints a workflow execution summary for a collection of workflow tokens.
 * This code could do with a little bit of re-factoring.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getWorkflowExecutionSummary
 * @param {WorkflowToken[]} wfTokens - An Array of Workflow execution tokens.
 * @param {string} itemParam - The parameter that is being executed.
 */

function checkParams(wfTokens, itemParam) {
    var inputErrors = [];
    var errorMessage;
    if (!wfTokens || !Array.isArray(wfTokens)) {
        inputErrors.push(" - wfTokens missing or not of type 'Array'");
    }
    if (!itemParam || typeof itemParam !== "string") {
        inputErrors.push(" - itemParam missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getWorkflowExecutionSummary"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var completedWorkflows = [];
var failedWorkflows = [];
var cancelledWorkflows = [];
var numCompletedWorkflows = 0;
var numFailedWorkflows = 0;
var numCancelledWorkflows = 0;
var completedWorkflowItems = [];
var failedWorkflowItems = [];
var cancelledWorkflowItems = [];
var numWorkflows = 0;

try {
    checkParams(wfTokens, itemParam);
    numWorkflows = wfTokens.length;
    if (numWorkflows > 0) {
        completedWorkflows = wfTokens.filter(function(x){return x.state.toLowerCase() === "completed";});
        numCompletedWorkflows = completedWorkflows.length;

        failedWorkflows = wfTokens.filter(function(x){return x.state.toLowerCase() === "failed";});
        numFailedWorkflows = failedWorkflows.length;

        cancelledWorkflows = wfTokens.filter(function(x){return x.state.toLowerCase() === "canceled";});
        numCancelledWorkflows = cancelledWorkflows.length;

        log.log("Workflow execution summary:");
        log.log("Completed workflows: " + numCompletedWorkflows);
        log.log("Failed workflows: " + numFailedWorkflows);
        log.log("Cancelled workflows: " + numCancelledWorkflows);

        log.log("Workflow execution details:");
        if (numCompletedWorkflows > 0) {
            completedWorkflowItems = completedWorkflows.map(function(x){return x.getInputParameters().get(itemParam);});
            log.log("Workflows completed for the following items:\n\t- " + completedWorkflowItems.join("\n\t- "));
        }

        if (numFailedWorkflows > 0) {
            failedWorkflowItems = failedWorkflows.map(function(x){return x.getInputParameters().get(itemParam);});
            log.log("Workflows failed for the following items:\n\t- " + failedWorkflowItems.join("\n\t- "));
        }

        if (numCancelledWorkflows > 0) {
            cancelledWorkflowItems = cancelledWorkflows.map(function(x){return x.getInputParameters().get(itemParam);});
            log.log("Workflows were cancelled for the following items:\n\t- " + cancelledWorkflowItems.join("\n\t- "));
        }
    } else {
        log.error("No workflows were present in the tokens array.");
    }
} catch (e) {
    log.error("Action failed to get workflow execution summary.",e);
}