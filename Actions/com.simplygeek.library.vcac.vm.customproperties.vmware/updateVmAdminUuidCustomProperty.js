/*global System vcacHost, vcacVmEntity, virtualMachineAdminUuid*/

/**
 * Updates the virtual machine uuid pointer for the virtual machine entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function updateVmAdminUuidCustomProperty
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The virtual machine entity.
 * @param {string} blueprintName - The virtual machine uuid to set.
 */

function checkParams(vcacHost, vcacVmEntity, virtualMachineAdminUuid) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (!virtualMachineAdminUuid || typeof virtualMachineAdminUuid !== "string") {
        inputErrors.push(" - virtualMachineAdminUuid missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updateVmAdminUuidCustomProperty"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyKey = "VirtualMachine.Admin.UUID";
var friendlyLabel = "Virtual Machine UUID";

try {
    checkParams(vcacHost, vcacVmEntity, virtualMachineAdminUuid);
    log.log("Updating custom property '" + friendlyLabel + "' with key '" + customPropertyKey + "'");
    System.getModule("com.simplygeek.library.vcac.vm.customproperties").addOrUpdateCustomProperty(vcacHost,
                                                                                                  vcacVmEntity,
                                                                                                  customPropertyKey,
                                                                                                  virtualMachineAdminUuid);
    log.log("Successfully updated custom property for: " + friendlyLabel);
} catch (e) {
    log.error("Action failed to update custom property.",e);
}