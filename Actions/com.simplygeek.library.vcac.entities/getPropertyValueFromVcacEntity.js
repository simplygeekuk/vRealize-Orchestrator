/*global vcacEntity, propertyKey*/

/**
 * Retrieves the property value from the provided vCAC Entity and property key.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getPropertyValueFromVcacEntity
 * @param {vCAC:Entity} vcacEntity - The vCAC Entity to get the property value from.
 * @param {string} propertyKey - The property key.
 * @returns {Any} returns the property value.
 */

function checkParams(vcacEntity, propertyKey) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacEntity || System.getObjectType(vcacEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacEntity missing or not of type 'vCAC:Entity'");
    }
    if (!propertyKey || typeof propertyKey !== "string") {
        inputErrors.push(" - propertyKey missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getPropertyValueFromVcacEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var propertyValue;

try {
    checkParams(vcacEntity, propertyKey);
    log.debug("Getting property value from vcac entity using key: " + propertyKey);
    propertyValue = vcacEntity.getProperty(propertyKey);
    if (!propertyValue) {
        if (propertyValue !== false) {
            log.error("No property value found for '" + propertyKey + "' on vcac entity.");
        }
    }
    log.debug("Found value: " + propertyValue);
} catch (e) {
    log.error("Action failed to get property value from vcac entity.",e);
}

return propertyValue;