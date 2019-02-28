/*global System Properties vCACEntityManager vcacHost entitySetName*/

/**
 * Returns an array of vcac entities by using a property set of key/values to filter the search on.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getVcacEntitiesByCustomFilter
 * @param {vCAC:VCACHost} vcacHost - The vCAC Host.
 * @param {string} entitySetName - The Entity Set Name.
 * @param {Properties} [entityProperties] - Properties to filter the query on. Returnd all entities if no properties provided.
 * @returns {vCAC:Entity[]} Returns an array of vCAC entities.
 */

function checkParams(vcacHost, entitySetName) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!entitySetName || typeof entitySetName !== "string") {
        inputErrors.push(" - entitySetName missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getVcacEntitiesByCustomFilter";
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var modelName = "ManagementModelEntities.svc";
var headers = null;
var entities = [];
var numEntitiesFound = 0;

try {
    checkParams(vcacHost, entitySetName);
    log.log("Retrieving vCAC Entities for set: " + entitySetName);
    if (!entityProperties) {
        log.debug("No properties were provided, all entities will be returned.");
        var entityProperties = new Properties();
    }
    log.debug("Querying vCAC Host for entities in set '" + entitySetName + "'");
    entities = vCACEntityManager.readModelEntitiesByCustomFilter(vcacHost.id,
                                                                 modelName,
                                                                 entitySetName,
                                                                 entityProperties,
                                                                 headers);
    numEntitiesFound = entities.length;
    log.debug("Found: " + numEntitiesFound + " entities.");
    if (numEntitiesFound < 1) {
        log.error("Unable to locate vCAC entities using the properties provided.");
    }
} catch (e) {
    log.error("Action failed to retrieve vCAC Entities.",e);
}

return entities;