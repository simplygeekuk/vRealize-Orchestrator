/*global vcacEntity*/

/**
 * Gets the hostId from the vCAC Entity object.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getHostId
 * @param {vCAC:Entity} vcacEntity - vCAC Entity.
 * @returns {string} Returns the hostId.
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
var logName = "getHostId"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var hostId;

try {
    checkParams(vcacEntity);
    log.log("Getting hostId from vCAC Entity.");
    hostId = vcacEntity.hostId;
    if (hostId) {
        log.log("Found hostId: " + hostId);
    } else {
        log.error("No hostId was found.");
    }
} catch (e) {
    log.error("Action failed to get hostId from vCAC Entity.",e);
}

return hostId;