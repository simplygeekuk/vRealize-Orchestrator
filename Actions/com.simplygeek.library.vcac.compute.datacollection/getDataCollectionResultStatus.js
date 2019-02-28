/*global vcacHost dataCollectionType dataCollectionEntityId*/

/**
 * Checks the result of the previous data collection task.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getDataCollectionResultStatus
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} dataCollectionType - The data collection type i.e. inventory.
 * @param {string} dataCollectionEntityId - The data collection id (the compute resource id).
 * @returns {boolean} Returns true if data collection was successful, otherwise returns false.
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
var logName = "getDataCollectionResultStatus"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var dataCollectionEntity;
var dataCollectionResultStatus;
var lastCollectedTime;

try {
    checkParams(vcacHost, dataCollectionType, dataCollectionEntityId);
    log.log("Retrieving the '" + dataCollectionType + "' data collection result status.");
    dataCollectionEntity = System.getModule("com.simplygeek.library.vcac.compute.datacollection").getDataCollectionEntityByIdAndType(vcacHost,
                                                                                                                                     dataCollectionType,
                                                                                                                                     dataCollectionEntityId);
    dataCollectionResultStatus = dataCollectionEntity.getProperty("LastCollectedStatus");
    if (dataCollectionResultStatus) {
        lastCollectedTime = dataCollectionEntity.getProperty("LastCollectedTime");
        log.log("Data collection succeeded at: " + lastCollectedTime);
    } else {
        log.error("Data collection failed on the last attempt.");
    }

} catch (e) {
    log.error("Action failed to retrieve data collection result status.",e);
}

return dataCollectionResultStatus;