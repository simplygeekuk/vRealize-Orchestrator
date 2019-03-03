/*global vcacEntity*/

/**
 * Gets the modelName from the vCAC Entity object.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getModelName
 * @param {vCAC:Entity} vcacEntity - vCAC Entity.
 * @returns {string} Returns the modelName.
 */

function checkParams(vcacEntity) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacEntity || System.getObjectType(vcacEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getModelName"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var modelName;

try {
    checkParams(vcacEntity);
    log.log("Getting modelName from vCAC Entity.");
    modelName = vcacEntity.modelName;
    if (modelName) {
        log.log("Found modelName: " + modelName);
    } else {
        log.error("No modelName was found.");
    }

} catch (e) {
    log.error("Action failed to get modelName from vCAC Entity.",e);
}

return modelName;