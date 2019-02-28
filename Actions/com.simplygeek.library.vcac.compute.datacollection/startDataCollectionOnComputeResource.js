/*global vcacHost dataCollectionType dataCollectionEntityId*/

/**
 * Starts a data collection task on a compute resource.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function startDataCollectionOnComputeResource
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} dataCollectionType - The data collection type i.e. inventory.
 * @param {string} dataCollectionEntityId - The data collection id (the compute resource id).
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
var logName = "startDataCollectionOnComputeResource"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var dataCollectionProps = new Properties();
var datacollectionEntity;
var computeResourceName;
var computeResourceEntity;

try {
    checkParams(vcacHost, dataCollectionType, dataCollectionEntityId);
    computeResourceEntity = System.getModule("com.simplygeek.library.vcac.compute").getComputeResourceEntityById(vcacHost, dataCollectionEntityId);
    computeResourceName = computeResourceEntity.getProperty("HostName");
    log.log("Starting '" + dataCollectionType + "' data collection on compute resource '" + computeResourceName + "'");
    datacollectionEntity = System.getModule("com.simplygeek.library.vcac.compute.datacollection").getDataCollectionEntityByIdAndType(vcacHost, dataCollectionType, dataCollectionEntityId);
    dataCollectionProps.put("LastCollectedTime", null);
    System.getModule("com.simplygeek.library.vcac.entities").updatevCACEntity(datacollectionEntity, dataCollectionProps);
    log.log("The '" + dataCollectionType + "' data collection process on compute resource '" + computeResourceName + "' has started.");
} catch (e) {
    log.error("Action failed to start data collection process on compute resource.",e);
}