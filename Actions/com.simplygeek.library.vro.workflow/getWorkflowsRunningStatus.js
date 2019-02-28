/*global wfTokens itemParam*/

/**
 * Checks the running status of Workflow tokens. Returns true if at least one workflow is still running.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getWorkflowsRunningStatus
 * @param {WorkflowToken[]} wfTokens - An Array of Workflow execution tokens.
 * @param {string} itemParam - The parameter that is being executed.
 * @returns {boolean} Returns true if at least one workflow is running, otherwise returns false.
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

function checkWorkflowStatus(wftoken) {
    return wftoken.state !== "completed" && wftoken.state !== "failed" && wftoken.state !== "canceled";
}

var logType = "Action";
var logName = "getWorkflowsRunningStatus"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var workflowRunningStatus = false;
var numWorkflows = 0;
// var inputParams;
// var paramValue;

try {
    checkParams(wfTokens, itemParam);
    numWorkflows = wfTokens.length;
    if (numWorkflows > 0) {
        workflowRunningStatus = wfTokens.some(checkWorkflowStatus);
        if (workflowRunningStatus) {
            log.log("Workflows are running...");
            //for each (var token in wfTokens) {
            //    inputParams = token.getInputParameters();
            //    paramValue = inputParams.get(itemParam);
            //    log.log(paramValue + " status: " + token.state);
            //}
        } else {
            log.log("All workflows completed running tasks.");
        }
    } else {
        log.error("No workflows were present in the tokens array.");
    }
} catch (e) {
    log.error("Action failed to determine the status of running workflows.",e);
}

return workflowRunningStatus;