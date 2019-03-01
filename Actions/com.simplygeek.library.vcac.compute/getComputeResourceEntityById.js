/*global vcacHost, computeResourceEntityId*/

/**
 * Searches for a compute resource vCAC Entity by name and returns the entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getComputeResourceEntityById
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} computeResourceEntityId - The compute resource name.
 * @returns {vCAC:Entity} Returns the compute resource vCAC Entity.
 */

function checkParams(vcacHost, computeResourceEntityId) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!computeResourceEntityId || typeof computeResourceEntityId !== "string") {
        inputErrors.push(" - computeResourceName missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getComputeResourceEntityById"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var properties = new Properties();
var vcacComputeResourceEntity;
var entitySetName = "Hosts";
var computeResourceName = "";

try {
    checkParams(vcacHost, computeResourceEntityId);
    log.log("Retrieving vCAC Compute Resource entity with id: " + computeResourceEntityId);
    properties.put("HostID", computeResourceEntityId);
    vcacComputeResourceEntity = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiyByUniqieId(vcacHost,
                                                                                                                  entitySetName,
                                                                                                                  properties);
    if (vcacComputeResourceEntity) {
        computeResourceName = vcacComputeResourceEntity.getProperty("HostName");
        log.log("Found vCAC Compute Resource '" + computeResourceName + "' with ID '" + computeResourceEntityId + "'");
    } else {
        log.error("No vCAC Compute Resource entity was found.");
    }
} catch (e) {
    log.error("Action failed to find vCAC Compute Resource entity.",e);
}

return vcacComputeResourceEntity;