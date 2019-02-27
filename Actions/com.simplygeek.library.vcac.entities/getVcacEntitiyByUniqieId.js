/*global System Properties vCACEntityManager vcacHost entitySetName entityProperties*/

/**
 * Searches for an entity by its unique ID that is provided in the entityProperties object.
 * Uses a Properties object for the entity id because different entities do not share the same key for the id field.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.3.0
 * @function getVcacEntitiyByUniqieId
 * @param {vCAC:VCACHost} vcacHost - The vCAC Host.
 * @param {string} entitySetName - The Entity Set Name.
 * @param {Properties} entityProperties - Properties object containing the entity id.
 * @returns {vCAC:Entity} The vCAC Entity that is found.
 */

function checkParams(vcacHost, entitySetName, entityProperties) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!entitySetName || typeof entitySetName !== "string") {
        inputErrors.push(" - entitySetName missing or not of type 'string'");
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
var logName = "getVcacEntitiyByUniqieId";
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var modelName = "ManagementModelEntities.svc";
var headers = null;
var vcacEntity;

try {
    checkParams(vcacHost, entitySetName, entityProperties);
    log.debug("Retrieving vCAC Entity for set: " + entitySetName);
    vcacEntity = vCACEntityManager.readModelEntity(vcacHost.id, modelName, entitySetName,
                                                   entityProperties, headers);
    if (!vcacEntity) {
        log.error("No vCAC Entity was found.");
    } else {
        log.debug("Successfully retrieved vCAC entity.");
    }
} catch (e) {
    log.error("Action failed to retrieve vCAC Entity.",e);
}

return vcacEntity;