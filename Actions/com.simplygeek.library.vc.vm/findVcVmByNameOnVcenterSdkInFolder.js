/*global vCenterSdk vmName folderName*/

/**
 * Searches for a vCenter VM by its name on the specified vCenter Server and folder name.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function findVcVmByNameOnVcenterSdkInFolder
 * @param {VC:SdkConnection} vCenterSdk - The vCenter Server SDK Connection.
 * @param {string} vmName - The virtual machine name.
 * @param {string} folderName - The vCenter virtual machine folder name.
 * @returns {VC:VirtualMachine} returns the vCenter virtual machine object.
 */

function checkParams(vCenterSdk, vmName, folderName) {
    var inputErrors = [];
    var errorMessage;
    if (!vCenterSdk || System.getObjectType(vCenterSdk) !== "VC:SdkConnection") {
        inputErrors.push(" - vCenterSdk missing or not of type 'VC:SdkConnection'");
    }
    if (!vmName || typeof vmName !== "string") {
        inputErrors.push(" - vmName missing or not of type 'string'");
    }
    if (!folderName || typeof folderName !== "string") {
        inputErrors.push(" - folderName missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "findVcVmByNameOnVcenterSdkInFolder"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vcVms = [];
var vcVmsInFolder = [];
var vcVm;
var numVcVms = 0;
var vcVmName = "";
var xPath = "";
var vcVmInstanceUuid = "";

try {
    checkParams(vCenterSdk, vmName, folderName);
    xPath = "xpath:name='" + vmName + "'";
    log.log("Attempting to locate vCenter vm '" + vmName + "' in folder '" + folderName + "'");
    vcVms = vCenterSdk.getAllVirtualMachines(null, xPath);
    numVcVms = vcVms.length;
    log.log("Found " + numVcVms + " vCenter virtual machine(s).");
    if (numVcVms > 0) {
        vcVmsInFolder = vcVms.filter(function(x){return x.parent.name.toLowerCase() === folderName.toLowerCase();});
        if (vcVmsInFolder.length > 0) {
            vcVm = vcVmsInFolder[0];
            vcVmName = vcVm.name;
            vcVmInstanceUuid = vcVm.config.instanceUuid;
            log.log("Found vCenter virtual machine '" + vcVmName + "' with instance uuid '" + vcVmInstanceUuid + "'");
        }
    }
    if (!vcVm) {
        log.error("No vCenter vm was found with the name '" + vmName + "' in folder '" + folderName + "'");
    }
} catch (e) {
    log.error("Action failed to locate vCenter vm.",e);
}

return vcVm;