/*global vcacVirtualMachine*/

/**
 * Search for a virtual machine by its instance uuid on all available vCenter Server endpoints.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getVirtualMachineEntityFromVcacVirtualMachine
 * @param {vCAC:VirtualMachine} vcacVirtualMachine - The vCAC Virtual Machine object.
 * @returns {VC:VirtualMachine} returns the vCenter virtual machine object.
 */

function checkParams(vcacVirtualMachine) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacVirtualMachine || System.getObjectType(vcacVirtualMachine) !== "vCAC:VirtualMachine") {
        inputErrors.push(" - vcacVirtualMachine missing or not of type 'vCAC:VirtualMachine'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}
var logType = "Action";
var logName = "getVirtualMachineEntityFromVcacVirtualMachine"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vmEntity;
var vmEntityName;

try {
    checkParams(vcacVirtualMachine);
    log.log("Getting virtual machine entity from vcac virtual machine.");
    vmEntity = vcacVirtualMachine.getEntity();
    vmEntityName = vmEntity.getProperty("VirtualMachineName");
    log.log("Found virtual machine entity: " + vmEntityName);
} catch (e) {
    log.error("Action failed to get virtual machine entity from vcac virtual machine.",e);
}

return vmEntity;