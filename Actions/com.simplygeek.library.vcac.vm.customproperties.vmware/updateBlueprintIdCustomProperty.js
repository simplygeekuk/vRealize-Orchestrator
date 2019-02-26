/*global System vcacHost, vcacVmEntity, blueprintId*/

/**
 * Updates the blueprint id that the virtual machine is assigned to.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function updateBlueprintIdCustomProperty
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The virtual machine entity.
 * @param {string} blueprintId - The blueprint component id to set.
 */

function checkParams(vcacHost, vcacVmEntity, blueprintId) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (!blueprintId || typeof blueprintId !== "string") {
        inputErrors.push(" - blueprintId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updateBlueprintIdCustomProperty"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyKey = "VirtualMachine.Cafe.Blueprint.Component.Id";
var friendlyLabel = "Blueprint Id";

try {
    checkParams(vcacHost, vcacVmEntity, blueprintId);
    log.log("Updating custom property '" + friendlyLabel + "' with key '" + customPropertyKey + "'");
    /* eslint-disable indent */
    System.getModule("com.simplygeek.library.vcac.vm.customproperties").addOrUpdateCustomProperty(vcacHost,
                                                                                                  vcacVmEntity,
                                                                                                  customPropertyKey,
                                                                                                  blueprintId);
    /* eslint-enable indent */
    log.log("Successfully updated custom property for: " + friendlyLabel);
} catch (e) {
    log.error("Action failed to update custom property.",e);
}