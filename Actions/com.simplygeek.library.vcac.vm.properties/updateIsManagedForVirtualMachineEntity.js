/*global vcacVmEntity isManaged*/

/**
 * Updates the isManaged property to true or false for the virtual machine.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function updateIsManagedForVirtualMachineEntity
 * @param {vCAC:Entity} vcacVmEntity - The vCAC Virtual Machine Entity.
 * @param {boolean} isManaged - Set IsManaged to true or false.
 */

function checkParams(vcacVmEntity, isManaged) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if ((isManaged !== true || isManaged !== false ) || typeof isManaged !== "boolean") {
        inputErrors.push(" - IsManaged missing or not of type 'boolean'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updateIsManagedForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var propertyToUpdate = "IsManaged";

try {
    checkParams(vcacVmEntity, isManaged);
    System.getModule("com.simplygeek.library.vcac.entities").updatePropertyValueForVcacEntity(vcacVmEntity,
                                                                                              propertyToUpdate,
                                                                                              isManaged);
} catch (e) {
    log.error("Action failed to update '" + propertyToUpdate + "' on vcac vm entity.",e);
}