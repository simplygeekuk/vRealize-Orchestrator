/*global System vcacEntity Properties propertyKey propertyValue*/

/**
 * Updates the value of a property on a vcac entity using the value provided.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.2.3
 * @function updatePropertyValueForVcacEntity
 * @param {vCAC:Entity} vcacEntity - The vCAC Entity.
 * @param {string} propertyKey - The property key.
 * @param {Any} propertyValue - The property value.
 */

function checkParams(vcacEntity, propertyKey, propertyValue) {
    var inputErrors = [];
    var errorMessage;

    if (!vcacEntity || System.getObjectType(vcacEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacEntity missing or not of type 'vCAC:Entity'");
    }
    if (!propertyKey || typeof propertyKey !== "string") {
        inputErrors.push(" - propertyKey missing or not of type 'string'");
    }
    if (!propertyValue && propertyValue !== false) {
        inputErrors.push(" - propertyValue missing.");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updatePropertyValueForVcacEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var entityProperties = new Properties();
var entityLink = new Properties();
var updatedEntity;
var currentPropertyValue = "";
var updatedPropertyValue = "";

try {
    checkParams(vcacEntity, propertyKey, propertyValue);
    log.debug("Attempting to update '" + propertyKey + "' on vcac entity to '" + propertyValue + "'");
    currentPropertyValue = vcacEntity.getProperty(propertyKey);
    if (currentPropertyValue === propertyValue) {
        log.debug("Property '" + propertyKey + "' already set to '" + propertyValue + "', no update required.");
    } else {
        log.debug("Updating '" + propertyKey + "' on vcac entity.");
        entityProperties.put(propertyKey, propertyValue);
        updatedEntity = System.getModule("com.simplygeek.library.vcac.entities").updatevCACEntity(vcacEntity, entityProperties, entityLink);
        updatedPropertyValue = updatedEntity.getProperty(propertyKey);
        if (updatedPropertyValue === propertyValue) {
            log.debug("Successfully updated '" + propertyKey + "' on vcac entity to '" + updatedPropertyValue + "'");
        } else {
            log.error("Failed to update '" + propertyKey + "' on vcac entity.");
        }
    }
} catch (e) {
    log.error("Action failed to update property on vcac entity.",e);
}