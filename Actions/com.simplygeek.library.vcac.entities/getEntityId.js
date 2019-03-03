/*global vcacEntity*/

/**
 * Gets the entity id from the vCAC Entity object.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getEntityId
 * @param {vCAC:Entity} vcacEntity - vCAC Entity.
 * @returns {string} Returns the entity id.
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
var logName = "getEntityId"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var entityKey;
var entityId;

try {
    checkParams(vcacEntity);
    log.log("Getting entity id from vCAC Entity.");
    entityKey = vcacEntity.entityKey;
    entityId = entityKey.get(entityKey.keys[0]);
    if (entityId) {
        log.log("Found entity id.");
    } else {
        log.error("No entity id was found.");
    }

} catch (e) {
    log.error("Action failed to get entity id from vCAC Entity.",e);
}

return entityId;