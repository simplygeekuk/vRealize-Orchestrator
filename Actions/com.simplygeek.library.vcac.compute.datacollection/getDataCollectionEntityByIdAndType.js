/*global vcacHost dataCollectionType dataCollectionEntityId*/

/**
 * Searches for and returns the data collection entity of the provided type by the entity id.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getDataCollectionEntityByIdAndType
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} dataCollectionType - The data collection type i.e. inventory.
 * @param {string} dataCollectionEntityId - The data collection id (the compute resource id).
 * @returns {vCAC:Entity} Returns the data collection vCAC Entity.
 */

function checkParams(vcacHost, dataCollectionType, dataCollectionEntityId) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!dataCollectionType || typeof dataCollectionType !== "string") {
        inputErrors.push(" - dataCollectionType missing or not of type 'string'");
    }
    if (!dataCollectionEntityId || typeof dataCollectionEntityId !== "string") {
        inputErrors.push(" - dataCollectionEntityId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getDataCollectionEntityByIdAndType"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var dataCollectionEntity;
var entitySetName = "DataCollectionStatuses";
var query = "";
var numEntities = 0;
var entities = [];

try {
    checkParams(vcacHost, dataCollectionType, dataCollectionEntityId);
    log.debug("Retrieving " + dataCollectionType + " data collection entity with ID: " + dataCollectionEntityId);
    query = "FilterSpec/FilterSpecGroup/FilterSpecGroupName eq '" + dataCollectionType.toLowerCase() + "' and EntityID eq guid'" +
             dataCollectionEntityId + "'";
    entities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesBySystemQuery(vcacHost,
                                                                                                     entitySetName,
                                                                                                     query);
    numEntities = entities.length;
    if (numEntities > 0) {
        log.debug("Found " + dataCollectionType + " data collection entity.");
        dataCollectionEntity = entities[0];
    } else {
        throw "No " + dataCollectionType + " data collection entities were found using the provided query.";
    }
} catch (e) {
    log.error("Action failed to find data collection entity.",e);
}

return dataCollectionEntity;