/*global computeResourceEntity*/

/**
 * Returns the HostId for the provided compute resource entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getHostIDFromComputeResourceEntity
 * @param {vCAC:Entity} computeResourceEntity - Compute resource entity.
 * @returns {string} Returns the compute resource HostId.
 */

function checkParams(computeResourceEntity) {
    var inputErrors = [];
    var errorMessage;
    if (!computeResourceEntity || System.getObjectType(computeResourceEntity) !== "vCAC:Entity") {
        inputErrors.push(" - computeResourceEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getHostIDFromComputeResourceEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var computeResourceName = "";
var hostId = "";

try {
    checkParams(computeResourceEntity);
    computeResourceName = computeResourceEntity.getProperty("HostName");
    log.log("Retrieving Host ID for compute resource entity: " + computeResourceName);
    hostId = computeResourceEntity.getProperty("HostID");
    log.log("Found Host ID for compute resource entity:" + hostId);
} catch (e) {
    log.error("Action failed to get Host ID for compute resource entity.",e);
}

return hostId;