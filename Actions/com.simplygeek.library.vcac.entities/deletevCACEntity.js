/*global System vcacEntity vCACEntityManager*/

/**
 * Deletes the provided vCAC Entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function deletevCACEntity
 * @param {vCAC:Entity} vcacEntity - vCAC Entity.
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
var logName = "deletevCACEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var hostId;
var modelName;
var entitySetName;
var entityId;
var parameters = null;
var links = null;
var headers = null;

try {
    checkParams(vcacEntity);
    hostId = vcacEntity.hostId;
    modelName = vcacEntity.modelName;
    entitySetName = vcacEntity.entitySetName;
    entityId = vcacEntity.keyString;
    log.log("Deleting vCAC entity with id: " + entityId);
    vCACEntityManager.deleteModelEntityBySerializedKey(hostId, modelName, entitySetName, entityId,
                                                       parameters, links, headers);
    log.log("Successfully deleted vCAC entity with id: " + entityId);
} catch (e) {
    log.error("Action failed to delete vCAC entity.",e);
}