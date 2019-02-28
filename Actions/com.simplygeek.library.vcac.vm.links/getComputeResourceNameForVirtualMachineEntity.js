/*global vcacHost vcacVmEntity*/

/**
 * Get the compute resource name for the vcac virtual machine entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getComputeResourceNameForVirtualMachineEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The vCAC virtual machine entity.
 * @returns {string} Returns the compute resource name.
 */

function checkParams(vcacHost, vcacVmEntity) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getComputeResourceNameForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var hostEntities = [];
var hostEntity;
var hostName = "";
var hostId = "";
var vmEntityName = "";
var numHostEntities = 0;

try {
    checkParams(vcacHost, vcacVmEntity);
    vmEntityName = vcacVmEntity.getProperty("VirtualMachineName");
    log.log("Getting compute resource name for virtual machine entity: " + vmEntityName);
    hostEntities = vcacVmEntity.getLink(vcacHost, "Host");
    numHostEntities = hostEntities.length;
    if (numHostEntities > 1 ) {
        log.error("More than one compute resource was found.");
    } else if (numHostEntities > 0) {
        hostEntity = hostEntities[0];
        hostName = hostEntity.getProperty("HostName");
        hostId = hostEntity.getProperty("HostID");
        log.log("Found compute resource '" + hostName + "' with entity id '" + hostId + "'");
    } else {
        log.error("No compute resource was found.");
    }
} catch (e) {
    log.error("Action failed to get compute resource name for virtual machine entity.",e);
}

return hostName;