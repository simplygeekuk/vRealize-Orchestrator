/*global vcacHost vcacVmEntity*/

/**
 * Retrieves a list of snapshots created on the vCAC virtual machine entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getVMSnapshotsForVirtualMachineEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The vCAC virtual machine entity.
 * @returns {string[]} Returns the list of IPv4 addresses.
 */

function checkParams(vcacHost, vcacVmEntity) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

function getSnapshot(snapshot) {
    var snapshotName = snapshot.getProperty("Name");
    var snapshotDate = snapshot.getProperty("CreatedDatetime");
    log.log("Found snapshot '" + snapshotName + "' created on: " + snapshotDate);
    return snapshotName;
}

var logType = "Action";
var logName = "getVMSnapshotsForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var linkKey = "VMSnapshots";
var vmSnapshotEntities = [];
var vmSnapshots = [];
var numVmSnapshots = 0;
var vcacVmEntityName = "";

try {
    checkParams(vcacHost, vcacVmEntity);
    vcacVmEntityName = vcacVmEntity.getProperty("VirtualMachineName");
    log.log("Retrieving list of snapshots created on virtual machine: " + vcacVmEntityName);
    vmSnapshotEntities = vcacVmEntity.getLink(vcacHost, linkKey);
    vmSnapshots = vmSnapshotEntities.map(function(x){return getSnapshot(x);});
    numVmSnapshots = vmSnapshots.length;
    log.log("Found " + numVmSnapshots + " snapshots.");
} catch (e) {
    log.error("Action failed to get list of snapshots",e);
}

return vmSnapshots;