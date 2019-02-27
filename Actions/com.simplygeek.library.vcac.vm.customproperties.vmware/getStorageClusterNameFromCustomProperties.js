/*global System Properties vmProperties*/

/**
 * Gets the name of the storage cluster that the primary virtual machine disks are stored on.
 * Note: If the VM is located on a standalone datastore, then use getStorageNameFromCustomProperties instead.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getStorageClusterNameFromCustomProperties
 * @param {Properties} vmProperties - The Custom Properties payload.
 * @returns {string} Returns the storage cluster name.
 */

function checkParams(vmProperties) {
    var inputErrors = [];
    var errorMessage;
    if (!vmProperties || !(vmProperties instanceof Properties)) {
        inputErrors.push(" - vmProperties missing or not of type 'Properties'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getStorageClusterNameFromCustomProperties"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyKey = "VirtualMachine.Storage.Cluster.Name";
var customPropertyValue;
var friendlyLabel = "Storage Cluster Name";

try {
    checkParams(vmProperties);
    log.log("Retrieving " + friendlyLabel + " from custom properties with key: " + customPropertyKey);
    customPropertyValue = System.getModule("com.simplygeek.library.vcac.vm.customproperties").getValueFromCustomProperty(vmProperties,
                                                                                                                         customPropertyKey);
    log.log("Found " + friendlyLabel + ": " + customPropertyValue);
} catch (e) {
    log.error("Action failed to retrieve " + friendlyLabel + " from custom properties.",e);
}

return customPropertyValue;