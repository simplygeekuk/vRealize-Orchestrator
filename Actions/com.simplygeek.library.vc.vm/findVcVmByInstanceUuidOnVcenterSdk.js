/*global vCenterSDK vcVmInstanceUuid*/

/**
 * Search for a virtual machine by its instance uuid on a specific vCenter Server.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function findVcVmByInstanceUuidOnVcenterSdk
 * @param {VC:SdkConnection} vCenterSdk - The vCenter Server SDK Connection.
 * @param {string} vcVmInstanceUuid - The vCenter virtual machine instance uuid.
 * @returns {VC:VirtualMachine} returns the vCenter virtual machine object.
 */

function checkParams(vCenterSDK, vcVmInstanceUuid) {
    var inputErrors = [];
    var errorMessage;
    if (!vCenterSDK || System.getObjectType(vCenterSDK) !== "VC:SdkConnection") {
        inputErrors.push(" - vCenterSDK missing or not of type 'VC:SdkConnection'");
    }
    if (!vcVmInstanceUuid || typeof vcVmInstanceUuid !== "string") {
        inputErrors.push(" - vcVmInstanceUuid missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "findVcVmByInstanceUuidOnVcenterSdk"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vcVm;
var vcVmName = "";
var vCenterSdkName;
var searchInVcDataCenter = null; // Set to vCDatacenter object to limit search or Null to search entire inventory.
var searchForVms = true; // false will search for hosts.
var searchByInstanceUuid = true; // false will search by BIOS UUID.

try {
    checkParams(vCenterSDK, vcVmInstanceUuid);
    vCenterSdkName = vCenterSDK.name;
    log.log("Attempting to locate vcenter vm with instance uuid '" + vcVmInstanceUuid +
            "' on vCenter '" + vCenterSdkName + "'");
    vcVm = vCenterSDK.searchIndex.findByUuid(searchInVcDataCenter, vcVmInstanceUuid,
                                             searchForVms, searchByInstanceUuid);
    if (vcVm) {
        vcVmName = vcVm.name;
        log.log("Found vcenter virtual machine '" + vcVmName + "'");
    } else {
        log.error("The vcenter virtual machine could not be found with instance uuid '" + vcVmInstanceUuid + "'");
    }
} catch (e) {
    log.error("Action failed to locate vCenter virtual machine.",e);
}

return vcVm;