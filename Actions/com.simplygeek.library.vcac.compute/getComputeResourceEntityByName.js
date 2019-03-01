/*global vcacHost, computeResourceName*/

/**
 * Searches for a compute resource vCAC Entity by name and returns the entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getComputeResourceEntityByName
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} computeResourceName - The compute resource name.
 * @returns {vCAC:Entity} Returns the compute resource vCAC Entity.
 */

function checkParams(vcacHost, computeResourceName) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!computeResourceName || typeof computeResourceName !== "string") {
        inputErrors.push(" - computeResourceName missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getComputeResourceEntityByName"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var properties = new Properties();
var vcacComputeResourceEntity;
var entitySetName = "Hosts";
var computeResourceId = "";
var entities = [];
var numEntities = 0;

try {
    checkParams(vcacHost, computeResourceName);
    log.log("Retrieving vCAC Compute Resource entity with name: " + computeResourceName);
    properties.put("HostName", computeResourceName);
    entities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesByCustomFilter(vcacHost,
                                                                                                      entitySetName,
                                                                                                      properties);
    numEntities = entities.length;
    if (numEntities > 0) {
        vcacComputeResourceEntity = entities[0];
        computeResourceId = vcacComputeResourceEntity.getProperty("HostID");
        log.log("Found vCAC Compute Resource entity: " + computeResourceName + " with ID: " + computeResourceId);
    } else {
        log.error("No vCAC Compute Resource entity was found.");
    }
} catch (e) {
    log.error("Action failed to find vCAC Compute Resource entity.",e);
}

return vcacComputeResourceEntity;