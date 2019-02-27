/*global vcacHost virtualMachineName*/

/**
 * Searches for a vcac virtual machine entity by VirtualMachineName.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function findVirtualMachineEntityByVirtualMachineName
 * @param {vCAC:VCACHost} vcacHost - The vCAC Host.
 * @param {string} virtualMachineName - The virtual machine name.
 * @returns {vCAC:Entity} Returns the virtual machine entity.
 */

function checkParams(vcacHost, virtualMachineName) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!virtualMachineName || typeof virtualMachineName !== "string") {
        inputErrors.push(" - virtualMachineName missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "findVirtualMachineEntityByVirtualMachineName"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vmEntity;
var vmEntities = [];
var entitySetName = "VirtualMachines";
var query = "";
var numVmEntities = 0;
var vcacVmEntityId = "";

try {
    checkParams(vcacHost, virtualMachineName);
    log.log("Finding virtual machine entity with vm name: " + virtualMachineName);
    query = "VirtualMachineName eq '" + virtualMachineName + "'";
    vmEntities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesBySystemQuery(vcacHost,
                                                                                                       entitySetName,
                                                                                                       query);
    numVmEntities = vmEntities.length;
    if (numVmEntities > 1 ) {
        log.error("More than one virtual machine entity was found with the name: " + virtualMachineName);
    } else if (numVmEntities > 0) {
        vmEntity = vmEntities[0];
        vcacVmEntityId = vmEntity.getProperty("VirtualMachineID");
        log.log("Found virtual machine entity '" + virtualMachineName + "' with entity id: " + vcacVmEntityId);
    } else {
        log.error("No virtual machine entity was found with the name: " + virtualMachineName);
    }
} catch (e) {
    log.error("Action failed to find virtual machine entity by VirtualMachineName",e);
}

return vmEntity;