/*global System Properties vmProperties*/

/**
 * Gets the vCenter VM folder path that the virtual machine is stored in.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getVcFolderFromCustomProperties
 * @param {Properties} vmProperties - The Custom Properties payload.
 * @returns {string} Returns vCenter VM folder path.
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
var logName = "getVcFolderFromCustomProperties"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyKey = "VMware.VirtualCenter.Folder";
var customPropertyValue;
var friendlyLabel = "vCenter Folder";

try {
    checkParams(vmProperties);
    log.log("Retrieving " + friendlyLabel + " from custom properties with key: " + customPropertyKey);
    /* eslint-disable indent */
    customPropertyValue = System.getModule("com.simplygeek.library.vcac.vm.customproperties").getValueFromCustomProperty(vmProperties,
                                                                                                                         customPropertyKey);
    /* eslint-enable indent */
    log.log("Found " + friendlyLabel + ": " + customPropertyValue);
} catch (e) {
    log.error("Action failed to retrieve " + friendlyLabel + " from custom properties.",e);
}

return customPropertyValue;