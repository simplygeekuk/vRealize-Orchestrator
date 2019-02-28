/*global vcacVmEntity externalReferenceId*/

/**
 * Updates the external reference id of the virtual machine object on the parent platform.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function updateExternalReferenceIdForVirtualMachineEntity
 * @param {vCAC:Entity} vcacVmEntity - The vCAC Virtual Machine Entity.
 * @param {string} externalReferenceId - The ExternalReferenceId (i.e. MoRef Id).
 */

function checkParams(vcacVmEntity, externalReferenceId) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (!externalReferenceId || typeof externalReferenceId !== "string") {
        inputErrors.push(" - externalReferenceId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updateExternalReferenceIdForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var propertyToUpdate = "ExternalReferenceId";

try {
    checkParams(vcacVmEntity, externalReferenceId);
    System.getModule("com.simplygeek.library.vcac.entities").updatePropertyValueForVcacEntity(vcacVmEntity,
                                                                                              propertyToUpdate,
                                                                                              externalReferenceId);
} catch (e) {
    log.error("Action failed to update '" + propertyToUpdate + "' on vcac vm entity.",e);
}