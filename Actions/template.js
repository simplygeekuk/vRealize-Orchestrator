/*global param1 param2 param3*/

/**
 * This is an Action template that can be used as a starting point for creating
 * new Actions in vRealize Orchestrator.
 * @author Jane Smith <jsmith@example.com>
 * @version 0.0.0
 * @function actionName
 * @param {data_type} param1 - param1 description.
 * @param {data_type} param2 - param2 description.
 * @param {data_type} param3 - param3 description.
 * @returns {data_type} return description.
 */

function checkParams(param_1, param_2, param_3) {
    var inputErrors = [];
    var errorMessage;
    if (!param_1 || typeof param_1 !== "string") {
        inputErrors.push(" - param_1 missing or not of type 'string'");
    }
    if (!param_2 || typeof param_2 !== "number") {
        inputErrors.push(" - param_2 missing or not of type 'number'");
    }
    if (!param_3 || !(param_3 instanceof Properties)) {
        inputErrors.push(" - param_3 missing or not of type 'Properties'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

/** Variable declaration block */
var logType = "Action";
var logName = "actionName"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var itemToReturn;
/** Variable declaration block */

/** Code block */
try {
    checkParams(param1, param2, param3);
    log.log("start message.");
    // code
    log.log("end message.");
} catch (e) {
    log.error("error message.",e);
}
/** Code block */

return itemToReturn;