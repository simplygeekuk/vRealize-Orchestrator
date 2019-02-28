/*global vCenterSdk vcVmMoRefId*/

/**
 * Searches for a vCenter VM by its Managed Object Reference Id on the specified vCenter Server.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function findVcVmByMorefIdOnVcenterSdk
 * @param {VC:SdkConnection} vCenterSdk - The vCenter Server SDK Connection.
 * @param {string} vcVmMoRefId - The vCenter VM Managed Object Reference Id.
 * @returns {VC:VirtualMachine} returns the vCenter virtual machine object.
 */

function checkParams(vCenterSdk, vcVmMoRefId) {
    var inputErrors = [];
    var errorMessage;
    if (!vCenterSdk || System.getObjectType(vCenterSdk) !== "VC:SdkConnection") {
        inputErrors.push(" - vCenterSdk missing or not of type 'VC:SdkConnection'");
    }
    if (!vcVmMoRefId || typeof vcVmMoRefId !== "string") {
        inputErrors.push(" - vcVmMoRefId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "findVcVmByMorefIdOnVcenterSdk"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vcVmName = "";
var numVcVms = 0;
var vcVm;
var vcVms = [];
var xPath = "";

try {
    checkParams(vCenterSdk, vcVmMoRefId);
    log.log("Attempting to find vcenter vm with moref id '" + vcVmMoRefId + "'");
    xPath = "xpath:id='" + vcVmMoRefId + "'";
    vcVms = vCenterSdk.getAllVirtualMachines(null, xPath);
    numVcVms = vcVms.length;
    if (numVcVms > 1) {
        log.error("More than one vCenter VM found. I don't know which one you're looking for!");
    } else if (numVcVms > 0) {
        vcVm = vcVms[0];
        vcVmName = vcVm.name;
        log.log("Found vCenter virtual machine '" + vcVmName + "'");
    } else {
        log.error("No vCenter vm was found with MoRef Id '" + vcVmMoRefId + "'");
    }
} catch (e) {
    log.error("Action failed to find vCenter VM by MoRef Id.",e);
}

return vcVm;