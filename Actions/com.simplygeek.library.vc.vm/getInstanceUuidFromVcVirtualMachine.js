/*global vcVm*/

/**
 * Gets the instance uuid for the virtual machine.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getInstanceUuidFromVcVirtualMachine
 * @param {VC:VirtualMachine} vcVm - The vCenter virtual machine object.
 * @returns {string} Returns the instance uuid.
 */

function checkParams(vcVm) {
    var inputErrors = [];
    var errorMessage;

    if (!vcVm || System.getObjectType(vcVm) !== "VC:VirtualMachine") {
        inputErrors.push(" - vcVm missing or not of type 'VC:VirtualMachine'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getInstanceUuidFromVcVirtualMachine"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vmUuid;
var vmName = "";

try {
    checkParams(vcVm);
    vmName = vcVm.name;
    log.log("Getting the instance uuid for virtual machine: " + vmName);
    vmUuid = vcVm.config.instanceUuid;
    log.log("Found instance uuid: " + vmUuid);
} catch (e) {
    log.error("Failed to get instance uuid from virtual machine.",e);
}

return vmUuid;