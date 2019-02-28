/*global ebsPayload*/

/**
 * Retrieves the virtual machine id from the event broker subscription payload.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getVirtualMachineIdFromEbsPayload
 * @param {Properties} ebsPayload - The event broker subscription payload.
 * @returns {string} The virtual machine id.
 */

function checkParams(ebsPayload) {
    var inputErrors = [];
    var errorMessage;
    if (!ebsPayload || !(ebsPayload instanceof Properties)) {
        inputErrors.push(" - ebsPayload missing or not of type 'Properties'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getVirtualMachineIdFromEbsPayload"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var virtualMachineId;

try {
    checkParams(ebsPayload);
    log.log("Getting virtual machine id from EBS Payload.");
    virtualMachineId = ebsPayload.machine.get("id");
    if (!virtualMachineId) {
        log.error("The virtual machine id was not found.");
    }
    log.log("Found virtual machine id '" + virtualMachineId + "'");
} catch (e) {
    log.error("Action failed to get virtual machine id from EBS payload.",e);
}

return virtualMachineId;