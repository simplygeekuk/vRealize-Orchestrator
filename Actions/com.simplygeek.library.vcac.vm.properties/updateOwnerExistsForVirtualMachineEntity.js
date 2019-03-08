/*global vcacVmEntity ownerExists*/

/**
 * Updates the OwnerExists property to true or false for the virtual machine.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.2.0
 * @function updateOwnerExistsForVirtualMachineEntity
 * @param {vCAC:Entity} vcacVmEntity - The vCAC Virtual Machine Entity.
 * @param {boolean} ownerExists - Set OwnerExists to true or false.
 */

function checkParams(vcacVmEntity, ownerExists) {
    var inputErrors = [];
    var errorMessage;

    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (typeof ownerExists !== "boolean") {
        inputErrors.push(" - ownerExists missing or not of type 'boolean'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updateOwnerExistsForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var propertyToUpdate = "OwnerExists";

try {
    checkParams(vcacVmEntity, ownerExists);
    System.getModule("com.simplygeek.library.vcac.entities").updatePropertyValueForVcacEntity(vcacVmEntity,
                                                                                              propertyToUpdate,
                                                                                              ownerExists);
} catch (e) {
    log.error("Action failed to update '" + propertyToUpdate + "' on vcac vm entity.",e);
}