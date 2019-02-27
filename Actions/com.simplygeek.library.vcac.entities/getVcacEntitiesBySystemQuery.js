/*global System vCACEntityManager vcacHost entitySetName query*/

/**
 * Returns an array of vcac entities by using an OData system query to filter the search on.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getVcacEntitiesBySystemQuery
 * @param {vCAC:VCACHost} vcacHost - The vCAC Host.
 * @param {string} entitySetName - The Entity Set Name.
 * @param {string} query - Query string.
 * @returns {vCAC:Entity[]} Returns an array of vCAC entities.
 */

function checkParams(vcacHost, entitySetName, query) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!entitySetName || typeof entitySetName !== "string") {
        inputErrors.push(" - entitySetName missing or not of type 'string'");
    }
    if (!query || typeof query !== "string") {
        inputErrors.push(" - query missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getVcacEntitiesBySystemQuery";
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var modelName = "ManagementModelEntities.svc";
var entities = [];
var numEntitiesFound = 0;

try {
    checkParams(vcacHost, entitySetName, query);
    log.debug("Retrieving vCAC Entities for set: " + entitySetName);
    entities = vCACEntityManager.readModelEntitiesBySystemQuery(vcacHost.id, modelName,
                                                                entitySetName, query);
    numEntitiesFound = entities.length;
    log.debug("Found: " + numEntitiesFound + " entities.");
    if (numEntitiesFound < 1) {
        log.error("Unable to locate vCAC entities using the provided query.");
    }
} catch (e) {
    log.error("Action failed to retrieve vCAC Entities.",e);
}

return entities;