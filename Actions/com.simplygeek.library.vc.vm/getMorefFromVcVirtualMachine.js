/*global vcVm*/

/**
 * Gets the managed object reference id for the virtual machine.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getMorefFromVcVirtualMachine
 * @param {VC:VirtualMachine} vcVm - The vCenter virtual machine object.
 * @returns {string} Returns the managed object reference id.
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
var logName = "getMorefFromVcVirtualMachine"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vmMoref;
var vmName = "";

try {
    checkParams(vcVm);
    vmName = vcVm.name;
    log.log("Getting the managed object reference (MORef) id for virtual machine: " + vmName);
    vmMoref = vcVm.id;
    log.log("Found MORef id: " + vmMoref);
} catch (e) {
    log.error("Action failed to get moref id from virtual machine.",e);
}

return vmMoref;