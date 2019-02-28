/*global vcacVmEntity blueprintName*/

/**
 * Updates the Blueprint that the virtual machine is assigned to.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function updateBlueprintNameForVirtualMachineEntity
 * @param {vCAC:Entity} vcacVmEntity - The vCAC Virtual Machine Entity.
 * @param {string} blueprintName - The Blueprint Name.
 */

function checkParams(vcacVmEntity, blueprintName) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (!blueprintName || typeof blueprintName !== "string") {
        inputErrors.push(" - blueprintName missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updateBlueprintNameForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var propertyToUpdate = "BlueprintName";

try {
    checkParams(vcacVmEntity, blueprintName);
    System.getModule("com.simplygeek.library.vcac.entities").updatePropertyValueForVcacEntity(vcacVmEntity,
                                                                                              propertyToUpdate,
                                                                                              blueprintName);
} catch (e) {
    log.error("Action failed to update '" + propertyToUpdate + "' on vcac vm entity.",e);
}