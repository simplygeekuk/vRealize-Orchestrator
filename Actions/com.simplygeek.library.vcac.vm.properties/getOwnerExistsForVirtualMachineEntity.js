/*global vcacVmEntity*/

/**
 * Retrieves the value of the 'OwnerExists' property for the provided vCAC virtual machine entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getOwnerExistsForVirtualMachineEntity
 * @param {vCAC:Entity} vcacVmEntity - The vCAC virtual machine entity.
 * @returns {boolean} Returns the value for the OwnerExists property.
 */

function checkParams(vcacVmEntity) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}
var logType = "Action";
var logName = "getOwnerExistsForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var propertyKey = "OwnerExists";
var propertyValue;

try {
    checkParams(vcacVmEntity);
    log.log("Retrieving property '" + propertyKey + "' from vm entity.");
    propertyValue = System.getModule("com.simplygeek.library.vcac.entities").getPropertyValueFromVcacEntity(vcacVmEntity, propertyKey);
    log.log("Found " + propertyKey + ": " + propertyValue);
} catch (e) {
    log.error("Action failed to get property from vm entity.",e);
}

return propertyValue;