/*global System Properties vcacHost vCACEntityManager entitySetName entityProperties entityLinks*/

/**
 * Creates a new vCAC Entity with the provided property values and optional entity links.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.2.0
 * @function createvCACEntity
 * @param {vCAC:VCACHost} vcacHost - The vCAC Host.
 * @param {string} entitySetName - The Entity Set Name.
 * @param {Properties} entityProperties - The Entity properties as a collection of key/value pairs.
 * @param {Properties} [entityLinks] - Links to other entities.
 * @returns {vCAC:Entity} Returns the vCAC Entity object after it has been created.
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
var logName = "createvCACEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var hostId;
var modelName = "ManagementModelEntities.svc";
var headers = null;
var newEntity;
var entityLinkProps = new Properties();

try {
    checkParams(vcacHost, entitySetName, entityProperties);
    log.debug("Creating vCAC entity...");
    if (entityLinks) {
        entityLinkProps = entityLinks;
    }
    hostId = vcacHost.id;
    newEntity = vCACEntityManager.createModelEntity(hostId, modelName, entitySetName,
                                                    entityProperties, entityLinkProps, headers);
    log.debug("Successfully created vCAC entity.");
} catch (e) {
    log.error("Action failed trying to create vCAC Entity.",e);
}

return newEntity;