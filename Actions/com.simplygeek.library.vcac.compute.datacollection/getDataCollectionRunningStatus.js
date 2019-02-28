/*global vcacHost dataCollectionType dataCollectionEntityId*/

/**
 * Checks if a data collection task is running.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getDataCollectionRunningStatus
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} dataCollectionType - The data collection type i.e. inventory.
 * @param {string} dataCollectionEntityId - The data collection id (the compute resource id).
 * @returns {boolean} Returns true if a data collection task is running, otherwise returns false.
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
var logName = "getDataCollectionRunningStatus"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var dataCollectionIsRunning = false;
var dataCollectionEntity;
var dataCollectionRunningStatus;

try {
    checkParams(vcacHost, dataCollectionType, dataCollectionEntityId);
    log.debug("Retrieving the " + dataCollectionType + " data collection status.");
    dataCollectionEntity = System.getModule("com.simplygeek.library.vcac.compute.datacollection").getDataCollectionEntityByIdAndType(vcacHost,
                                                                                                                                     dataCollectionType,
                                                                                                                                     dataCollectionEntityId);
    dataCollectionRunningStatus = dataCollectionEntity.getProperty("LastCollectedTime");
    if (!dataCollectionRunningStatus) {
        dataCollectionIsRunning = true;
    }
    log.log(dataCollectionType + " data collection task running: " + dataCollectionIsRunning);
} catch (e) {
    log.error("Action failed to retrieve data collection status.",e);
}

return dataCollectionIsRunning;