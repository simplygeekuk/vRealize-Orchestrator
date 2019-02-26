/*global System Properties vmProperties*/

/**
 * Looks up the number of CPUs assigned to the virtual machine from the custom properties.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getCpuCountFromCustomProperties
 * @param {Properties} vmProperties - The Custom Properties payload.
 * @returns {number} Returns the number of CPUs.
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
var logName = "getCpuCountFromCustomProperties"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyKey = "VirtualMachine.CPU.Count";
var customPropertyValue;
var friendlyLabel = "CPU Count";
var cpuCount = 0;

try {
    checkParams(vmProperties);
    log.log("Retrieving " + friendlyLabel + " from custom properties with key: " + customPropertyKey);
    /* eslint-disable indent */
    customPropertyValue = System.getModule("com.simplygeek.library.vcac.vm.customproperties").getValueFromCustomProperty(vmProperties,
                                                                                                                         customPropertyKey);
    /* eslint-enable indent */
    cpuCount = parseInt(customPropertyValue);
    log.log("Found " + friendlyLabel + ": " + customPropertyValue);
} catch (e) {
    log.error("Action failed to retrieve " + friendlyLabel + " from custom properties.",e);
}

return cpuCount;