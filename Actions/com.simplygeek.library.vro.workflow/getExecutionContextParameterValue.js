/*global parameter*/

/**
 * Retrieves the value for the specified parameter in the Execution Context.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.2.0
 * @function getExecutionContextParameterValue
 * @param {string} parameter - The Execution Context parameter.
 * @returns {string} Returns the parameter value.
 */

function checkParams(parameter) {
    var inputErrors = [];
    var errorMessage;
    if (!parameter || typeof parameter !== "string") {
        inputErrors.push(" - parameter missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getExecutionContextParameterValue"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var paramValue = "";

try {
    checkParams(parameter);
    log.debug("Getting value for parameter '" + parameter + "'");
    paramValue = System.getContext().getParameter(parameter);
    if (paramValue) {
        log.debug("Found parameter value: " + paramValue);
    } else {
        log.error("Could not find value for parameter '" + parameter + "'");
    }
} catch (e) {
    log.error("Action failed to get parameter value.",e);
}

return paramValue;