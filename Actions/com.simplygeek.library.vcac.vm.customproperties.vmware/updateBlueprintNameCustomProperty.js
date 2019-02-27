/*global System vcacHost, vcacVmEntity, blueprintName*/

/**
 * Updates the blueprint name that the virtual machine is assigned to.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function updateBlueprintNameCustomProperty
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The virtual machine entity.
 * @param {string} blueprintName - The blueprint name to set.
 */

function checkParams(vcacHost, vcacVmEntity, blueprintName) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
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
var logName = "updateBlueprintNameCustomProperty"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var providerBindingIdKey = "providerBindingId";
var blueprintIdKey = "VirtualMachine.Cafe.Blueprint.Id";
var blueprintNameKey = "VirtualMachine.Cafe.Blueprint.Name";
var friendlyLabel = "Blueprint Name";

try {
    checkParams(vcacHost, vcacVmEntity, blueprintName);
    log.log("Updating custom properties for " + friendlyLabel);
    System.getModule("com.simplygeek.library.vcac.vm.customproperties").addOrUpdateCustomProperty(vcacHost,
                                                                                                  vcacVmEntity,
                                                                                                  providerBindingIdKey,
                                                                                                  blueprintName);
    System.getModule("com.simplygeek.library.vcac.vm.customproperties").addOrUpdateCustomProperty(vcacHost,
                                                                                                  vcacVmEntity,
                                                                                                  blueprintIdKey,
                                                                                                  blueprintName);
    System.getModule("com.simplygeek.library.vcac.vm.customproperties").addOrUpdateCustomProperty(vcacHost,
                                                                                                  vcacVmEntity,
                                                                                                  blueprintNameKey,
                                                                                                  blueprintName);
    log.log("Successfully updated custom properties for " + friendlyLabel);
} catch (e) {
    log.error("Action failed to update custom properties.",e);
}