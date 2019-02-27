/*global System Properties
         vcacHost vcacVmEntity customPropertyKey customPropertyValue
         propertyIsHidden propertyIsRuntime propertyIsEncrypted
*/

/**
 * Adds a new custom property or updates an existing one.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function addOrUpdateCustomProperty
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The vcac virtual machine entity.
 * @param {string} customPropertyKey - The custom property key.
 * @param {string} customPropertyValue - The custom property value.
 * @param {boolean} [propertyIsHidden] - Property 'isHidden' flag [optional].
 * @param {boolean} [propertyIsRuntime] - Property 'isRuntime' flag [optional].
 * @param {boolean} [propertyIsEncrypted] - Property 'isHidden' flag [optional].
 * @returns {vCAC:Entity} Returns the new or updated custom property entity.
 */

function checkParams(vcacHost, vcacVmEntity, customPropertyKey, customPropertyValue) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (!customPropertyKey || typeof customPropertyKey !== "string") {
        inputErrors.push(" - customPropertyKey missing or not of type 'string'");
    }
    if (!customPropertyValue || typeof customPropertyValue !== "string") {
        inputErrors.push(" - customPropertyValue missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "addOrUpdateCustomProperty"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var newOrUpdatedEntity;
var customPropertyExists = false;
var properties = new Properties();
var links = new Properties();
var currentPropertyValue;
var newOrUpdatedPropertyValue;
var customPropertyEntities = [];
var customPropertyEntitiesFiltered = [];
var customPropertyEntity;
var entitySetName = "VirtualMachineProperties";
var isHidden = false;
var isRuntime = false;
var isEncrypted = false;

try {
    checkParams(vcacHost, vcacVmEntity, customPropertyKey, customPropertyValue);
    log.log("Adding or updating custom property '" + customPropertyKey + "' with value '" + customPropertyValue + "'");
    if (propertyIsHidden) {
        isHidden = true;
    }
    if (propertyIsRuntime) {
        isRuntime = true;
    }
    if (propertyIsEncrypted) {
        isEncrypted = true;
    }
    properties.put("PropertyName", customPropertyKey);
    properties.put("PropertyValue", customPropertyValue);
    properties.put("IsHidden", isHidden);
    properties.put("IsRuntime", isRuntime);
    properties.put("IsEncrypted", isEncrypted);
    links.put("VirtualMachine",vcacVmEntity);

    customPropertyEntities = vcacVmEntity.getLink(vcacHost, "VirtualMachineProperties");
    customPropertyEntitiesFiltered = customPropertyEntities.filter(function(x){return x.getProperty("PropertyName") === customPropertyKey;});
    if (customPropertyEntitiesFiltered.length > 0) {
        customPropertyEntity = customPropertyEntitiesFiltered[0];
        customPropertyExists = true;
    }

    if (customPropertyExists) {
        log.log("An existing Custom Property was found and will be updated.");
        currentPropertyValue = customPropertyEntity.getProperty("PropertyValue");
        if (currentPropertyValue === customPropertyValue) {
            log.log("Custom Property '" + customPropertyKey + "' already set to: '" + customPropertyValue + "', no update required.");
        } else {
            newOrUpdatedEntity = System.getModule("com.simplygeek.library.vcac.entities").updatevCACEntity(customPropertyEntity,
                                                                                                           properties,
                                                                                                           links);
            newOrUpdatedPropertyValue = newOrUpdatedEntity.getProperty("PropertyValue");
            if (newOrUpdatedPropertyValue === customPropertyValue) {
                log.log("Successfully updated '" + customPropertyKey + "' to '" + newOrUpdatedPropertyValue + "'");
            } else {
                log.error("Custom Property failed to update.");
            }
        }
    } else {
        log.log("No existing Custom Property was not found and will be created.");
        newOrUpdatedEntity = System.getModule("com.simplygeek.library.vcac.entities").createvCACEntity(vcacHost,
                                                                                                       entitySetName,
                                                                                                       properties,
                                                                                                       links);
        newOrUpdatedPropertyValue = newOrUpdatedEntity.getProperty("PropertyValue");
        if (newOrUpdatedPropertyValue === customPropertyValue) {
            log.log("Successfully created '" + customPropertyKey + "' with value '" + newOrUpdatedPropertyValue + "'");
        } else {
            log.error("Custom property failed to create.");
        }
    }
} catch (e) {
    log.error("Action failed to add or update custom property.",e);
}