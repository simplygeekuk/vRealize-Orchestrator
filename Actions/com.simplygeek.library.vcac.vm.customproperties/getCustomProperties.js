/*global System Properties vcacHost vcacVmEntity*/

/**
 * Gets the custom properties that are associated with the provided vcac virtual machine.
 * @function getCustomProperties
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The vCAC virtual machine entity.
 * @returns {Properties} Returns the custom properties.
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
var logName = "getCustomProperties"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vmProperties = new Properties();
var vmPropertiesEntities = [];
var propertyName = "";
var propertyValue = "";

try {
    checkParams(vcacHost, vcacVmEntity);
    log.debug("Retrieving custom properties for vcac virtual machine.");
    vmPropertiesEntities = vcacVmEntity.getLink(vcacHost, "VirtualMachineProperties");
    log.debug("The following Custom Properties were found:");
    for (var i=0; i<vmPropertiesEntities.length; i++) {
        propertyName = vmPropertiesEntities[i].getProperty("PropertyName");
        propertyValue = vmPropertiesEntities[i].getProperty("PropertyValue");
        log.debug(propertyName + ": " + propertyValue);
        vmProperties.put(propertyName, propertyValue);
    }
} catch (e) {
    log.error("Action failed to retrieve custom properties for vcac virtual machine.",e);
}

return vmProperties;