/*global vcacHost vcacVmEntity*/

/**
 * Get the owner username for the vcac virtual machine entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getOwnerForVirtualMachineEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The vCAC virtual machine entity.
 * @returns {string} Returns the owner username in UPN format.
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

var logType = "Action";
var logName = "getOwnerForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var ownerEntities = [];
var ownerEntity;
var ownerUsername = "";
var vmEntityName = "";
var numOwnerEntities = 0;

try {
    checkParams(vcacHost, vcacVmEntity);
    vmEntityName = vcacVmEntity.getProperty("VirtualMachineName");
    log.log("Getting owner username for virtual machine entity: " + vmEntityName);
    ownerEntities = vcacVmEntity.getLink(vcacHost, "Owner");
    numOwnerEntities = ownerEntities.length;
    if (numOwnerEntities > 1 ) {
        log.error("More than one owner was found.");
    } else if (numOwnerEntities > 0) {
        ownerEntity = ownerEntities[0];
        ownerUsername = ownerEntity.getProperty("UserName");
        log.log("Found owner username: " + ownerUsername);
    } else {
        log.error("No owner was found.");
    }
} catch (e) {
    log.error("Action failed to get owner username for virtual machine entity.",e);
}

return ownerUsername;