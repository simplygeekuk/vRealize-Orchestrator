/*global System vcacHost, vcacVmEntity, blueprintComponentId*/

/**
 * Updates the virtual machine component id within a blueprint.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function updateBlueprintComponentIdCustomProperty
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The virtual machine entity.
 * @param {string} blueprintComponentId - The blueprint component id to set.
 */

function checkParams(vcacHost, vcacVmEntity, blueprintComponentId) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (!blueprintComponentId || typeof blueprintComponentId !== "string") {
        inputErrors.push(" - blueprintComponentId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updateBlueprintComponentIdCustomProperty"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyKey = "VirtualMachine.Cafe.Blueprint.Component.Id";
var friendlyLabel = "Blueprint Component Id";

try {
    checkParams(vcacHost, vcacVmEntity, blueprintComponentId);
    log.log("Updating custom property '" + friendlyLabel + "' with key '" + customPropertyKey + "'");
    System.getModule("com.simplygeek.library.vcac.vm.customproperties").addOrUpdateCustomProperty(vcacHost,
                                                                                                  vcacVmEntity,
                                                                                                  customPropertyKey,
                                                                                                  blueprintComponentId);
    log.log("Successfully updated custom property for: " + friendlyLabel);
} catch (e) {
    log.error("Action failed to update custom property",e);
}