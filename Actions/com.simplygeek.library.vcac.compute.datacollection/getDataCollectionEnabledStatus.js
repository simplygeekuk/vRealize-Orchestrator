/*global vcacHost dataCollectionType dataCollectionEntityId*/

/**
 * Checks the data collector status and returns true if it is enabled otherwise returns false.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getDataCollectionEnabledStatus
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} dataCollectionType - The data collection type i.e. inventory.
 * @param {string} dataCollectionEntityId - The data collection id (the compute resource id).
 * @returns {boolean} Returns true if the data collector is enabled, otherwise returns false.
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
var logName = "getDataCollectionEnabledStatus"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var dataCollectionEntity;
var dataCollectionEnabledStatus = true;
var dataCollectionEnabled = true;

try {
    checkParams(vcacHost, dataCollectionType, dataCollectionEntityId);
    log.log("Checking if '" + dataCollectionType + "' data collection is enabled.");
    dataCollectionEntity = System.getModule("com.simplygeek.library.vcac.compute.datacollection").getDataCollectionEntityByIdAndType(vcacHost, dataCollectionType, dataCollectionEntityId);
    dataCollectionEnabledStatus = dataCollectionEntity.getProperty("IsDisabled");
    if (dataCollectionEnabledStatus) {
        dataCollectionEnabled = false;
    }
    log.log("Data collection '" + dataCollectionType + "' enabled: " + dataCollectionEnabled);
} catch (e) {
    log.error("Action failed to retrieve data collection enabled status.",e);
}

return dataCollectionEnabled;