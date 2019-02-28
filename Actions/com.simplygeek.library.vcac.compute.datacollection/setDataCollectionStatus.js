/*global vcacHost dataCollectionType dataCollectionEntityId dataCollectionEnabledStatus*/

/**
 * Enables/Disables a data collection task for a compute resource.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function setDataCollectionStatus
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} dataCollectionType - The data collection type i.e. inventory.
 * @param {string} dataCollectionEntityId - The data collection id (the compute resource id).
 * @param {boolean} [dataCollectionEnabledStatus] - The data collection status to set [optional].
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
var logName = "setDataCollectionStatus"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var dataCollectionProps = new Properties();
var datacollectionEntity;
var disableCollector = true;

try {
    checkParams(vcacHost, dataCollectionType, dataCollectionEntityId);
    log.log("Setting '" + dataCollectionType + "' data collection enabled: " + dataCollectionEnabledStatus);
    if (dataCollectionEnabledStatus) {
        disableCollector = false;
    }
    datacollectionEntity = System.getModule("com.simplygeek.library.vcac.compute.datacollection").getDataCollectionEntityByIdAndType(vcacHost,
                                                                                                                                     dataCollectionType,
                                                                                                                                     dataCollectionEntityId);
    dataCollectionProps.put("IsDisabled", disableCollector);
    System.getModule("com.simplygeek.library.vcac.entities").updatevCACEntity(datacollectionEntity,
                                                                              dataCollectionProps);
} catch (e) {
    log.error("Action failed to start data collection process on compute resource.",e);
}