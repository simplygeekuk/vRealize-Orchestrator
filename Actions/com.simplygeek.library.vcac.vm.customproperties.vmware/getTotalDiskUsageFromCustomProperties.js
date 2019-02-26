/*global System Properties vmProperties*/

/**
 * Gets the total amount of disk used by (allocated to) the virtual machine, in MB.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getTotalDiskUsageFromCustomProperties
 * @param {Properties} vmProperties - The Custom Properties payload.
 * @returns {number} Returns the toal disk used by the virtual machine.
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
var logName = "getTotalDiskUsageFromCustomProperties"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyKey = "VirtualMachine.Admin.TotalDiskUsage";
var customPropertyValue;
var friendlyLabel = "Total Disk Usage";

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