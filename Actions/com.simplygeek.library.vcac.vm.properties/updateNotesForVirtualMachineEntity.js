/*global vcacVmEntity description*/

/**
 * Updates the virtual machine description.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function updateNotesForVirtualMachineEntity
 * @param {vCAC:Entity} vcacVmEntity - The vCAC Virtual Machine Entity.
 * @param {string} description - The virtual machine description.
 */

function checkParams(vcacVmEntity, description) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (!description || typeof description !== "string") {
        inputErrors.push(" - description missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updateNotesForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var propertyToUpdate = "Notes";

try {
    checkParams(vcacVmEntity, description);
    System.getModule("com.simplygeek.library.vcac.entities").updatePropertyValueForVcacEntity(vcacVmEntity,
                                                                                              propertyToUpdate,
                                                                                              description);
} catch (e) {
    log.error("Action failed to update '" + propertyToUpdate + "' on vcac vm entity.",e);
}