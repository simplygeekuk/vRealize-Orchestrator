/*global vcacHost externalReferenceId*/

/**
 * Searches for a vcac virtual machine entity by ExternalReferenceId.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function findVirtualMachineEntityByExternalReferenceId
 * @param {vCAC:VCACHost} vcacHost - The vCAC Host.
 * @param {string} externalReferenceId - The virtual machine external reference id.
 * @returns {vCAC:Entity} Returns the virtual machine entity.
 */

function checkParams(vcacHost, externalReferenceId) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!externalReferenceId || typeof externalReferenceId !== "string") {
        inputErrors.push(" - externalReferenceId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "findVirtualMachineEntityByExternalReferenceId"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vmEntity;
var vmEntities = [];
var entitySetName = "VirtualMachines";
var query = "";
var numVmEntities = 0;
var virtualMachineName = "";
var vcacVmEntityId = "";

try {
    checkParams(vcacHost, externalReferenceId);
    log.log("Finding virtual machine entity with external reference id: " + externalReferenceId);
    query = "ExternalReferenceId eq '" + externalReferenceId + "'";
    vmEntities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesBySystemQuery(vcacHost,
                                                                                                       entitySetName,
                                                                                                       query);
    numVmEntities = vmEntities.length;
    if (numVmEntities > 1 ) {
        log.error("More than one virtual machine entity was found with unique id: " + externalReferenceId);
    } else if (numVmEntities > 0) {
        vmEntity = vmEntities[0];
        virtualMachineName = vmEntity.getProperty("VirtualMachineName");
        vcacVmEntityId = vmEntity.getProperty("VirtualMachineID");
        log.log("Found virtual machine entity '" + virtualMachineName + "' with entity id: " + vcacVmEntityId);
    } else {
        log.error("No virtual machine entity was found with unique id: " + externalReferenceId);
    }
} catch (e) {
    log.error("Action failed to find virtual machine entity by ExternalReferenceId",e);
}

return vmEntity;