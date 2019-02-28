/**
 * Returns the value for the parameter '__asd_requestedBy'.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getRequestedByParameterValue
 * @returns {string} Returns the parameter value.
 */

var logType = "Action";
var logName = "getRequestedByParameterValue"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var parameter = "__asd_requestedBy";
var paramValue;

try {
    log.log("Getting value for parameter '" + parameter + "'");
    paramValue = System.getModule("com.simplygeek.library.vro.workflow").getExecutionContextParameterValue(parameter);
    if (!paramValue) {
        log.error("No value was found for parameter '" + parameter + "'");
    }
    log.log("Found parameter value '" + paramValue + "'");
} catch (e) {
    log.error("Action failed to get value for parameter '" + parameter + "'",e);
}

return paramValue;