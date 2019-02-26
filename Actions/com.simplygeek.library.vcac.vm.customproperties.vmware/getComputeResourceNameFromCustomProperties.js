/*global System Properties vmProperties*/

/**
 * Gets the compute resource name that the virtual machine is hosted on.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getComputeResourceNameFromCustomProperties
 * @param {Properties} vmProperties - The Custom Properties payload.
 * @returns {string} Returns the template name.
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
var logName = "getComputeResourceNameFromCustomProperties"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyKey = "VirtualMachine.Admin.Hostname";
var customPropertyValue;
var friendlyLabel = "Compute Resource Name";

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