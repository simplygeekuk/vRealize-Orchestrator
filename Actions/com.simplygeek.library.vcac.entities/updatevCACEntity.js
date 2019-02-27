/*global System Properties vCACEntityManager vcacEntity entityProperties*/

/**
 * Updates an existing vCAC Entity with new property values including optional updates to linked entities.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function updatevCACEntity
 * @param {vCAC:Entity} vcacEntity - vCAC Entity.
 * @param {Properties} entityProperties - Properties to update.
 * @param {Properties} [entityLinks] - Links to update [optional].
 * @returns {vCAC:Entity} Returns the updated vCAC Entity object.
 */

function checkParams(vcacEntity, entityProperties) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacEntity || System.getObjectType(vcacEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacEntity missing or not of type 'vCAC:Entity'");
    }
    if (!entityProperties || !(entityProperties instanceof Properties)) {
        inputErrors.push(" - entityProperties missing or not of type 'Properties'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updatevCACEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var hostId;
var modelName;
var entitySetName;
var entityId;
var headers = null;
var updatedEntity;

try {
    checkParams(vcacEntity, entityProperties);
    hostId = vcacEntity.hostId;
    modelName = vcacEntity.modelName;
    entitySetName = vcacEntity.entitySetName;
    entityId = vcacEntity.keyString;
    log.debug("Updating vCAC entity...");
    if (!entityLinks) {
        var entityLinks = new Properties();
    }
    updatedEntity = vCACEntityManager.updateModelEntityBySerializedKey(hostId, modelName, entitySetName,
                                                                       entityId, entityProperties,
                                                                       entityLinks, headers);
    log.debug("Updating vCAC entity complete.");
} catch (e) {
    log.error("Action failed to update vCAC entity.",e);
}

return updatedEntity;