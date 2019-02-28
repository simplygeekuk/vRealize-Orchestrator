/*global vcVmInstanceUuid*/

/**
 * Search for a virtual machine by its instance uuid on all available vCenter Server endpoints.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function findVcVmByInstanceUuid
 * @param {string} vcVmInstanceUuid - The vCenter virtual machine instance uuid.
 * @returns {VC:VirtualMachine} returns the vCenter virtual machine object.
 */

function checkParams(vcVmInstanceUuid) {
    var inputErrors = [];
    var errorMessage;
    if (!vcVmInstanceUuid || typeof vcVmInstanceUuid !== "string") {
        inputErrors.push(" - vcVmInstanceUuid missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "findVcVmByInstanceUuid"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vCenterVm;
var vCenterVmName = "";
var sdkConnections = [];
var found = false;
var vCenterSdkName;
var searchInVcDataCenter = null; // Set to vCDatacenter object to limit search or Null to search entire inventory.
var searchForVms = true; // false will search for hosts.
var searchByInstanceUuid = true; // false will search by BIOS UUID.

try {
    checkParams(vcVmInstanceUuid);
    sdkConnections = VcPlugin.allSdkConnections;
    if (sdkConnections.length > 0) {
        for (var i = 0; i < sdkConnections.length; i++) {
            log.log("Attempting to locate vcenter virtual machine with instance uuid '" + vcVmInstanceUuid + "'");
            vCenterVm = sdkConnections[i].searchIndex.findByUuid(searchInVcDataCenter, vcVmInstanceUuid, searchForVms, searchByInstanceUuid);
            if (vCenterVm) {
                vCenterVmName = sdkConnections[i].name;
                vCenterSdkName = sdkConnections[i].name;
                log.log("Found vcenter virtual machine '" + vCenterVmName + "' on vCenter '" + vCenterSdkName + "'");
                found = true;
                break;
            }
        }
    } else {
        log.error("No vcenter server endpoints were found to perform the search.");
    }
    if (!found) {
        log.error("The vcenter virtual machine could not be found with instance uuid '" + vcVmInstanceUuid + "'");
    }
} catch (e) {
    log.error("Action failed to locate vCenter virtual machine.",e);
}

return vCenterVm;