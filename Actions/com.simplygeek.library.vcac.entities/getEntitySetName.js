/*global vcacEntity*/

/**
 * Gets the entitySetName from the vCAC Entity object.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getEntitySetName
 * @param {vCAC:Entity} vcacEntity - vCAC Entity.
 * @returns {string} Returns the entitySetName.
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
var logName = "getEntitySetName"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var entitySetName;

try {
    checkParams(vcacEntity);
    log.log("Getting entitySetName from vCAC Entity.");
    entitySetName = vcacEntity.entitySetName;
    if (entitySetName) {
        log.log("Found entitySetName: " + entitySetName);
    } else {
        log.error("No entitySetName was found.");
    }

} catch (e) {
    log.error("Action failed to get entitySetName from vCAC Entity.",e);
}

return entitySetName;