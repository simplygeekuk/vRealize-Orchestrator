/*global System Properties vmProperties diskIndex*/

/**
 * Gets the network name for the network adapter index.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getDiskDeviceIdFromCustomProperties
 * @param {Properties} vmProperties - The Custom Properties payload.
 * @param {number} diskIndex - The disk index.
 * @returns {string} Returns the network name for the specified network adapter index.
 */

function checkParams(vmProperties, diskIndex) {
    var inputErrors = [];
    var errorMessage;
    if (!vmProperties || !(vmProperties instanceof Properties)) {
        inputErrors.push(" - vmProperties missing or not of type 'Properties'");
    }
    if (typeof diskIndex !== "number") {
        inputErrors.push(" - diskIndex missing or not of type 'number'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getDiskDeviceIdFromCustomProperties"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyKey = "VirtualMachine.Disk##index##.DeviceID";
var friendlyLabel = "Disk Device ID";
var customPropertyValue;

try {
    checkParams(vmProperties, diskIndex);
    log.log("Retrieving " + friendlyLabel + " from custom properties with key: " + customPropertyKey);
    customPropertyKey = customPropertyKey.replace("##index##", diskIndex.toString());
    /* eslint-disable indent */
    customPropertyValue = System.getModule("com.simplygeek.library.vcac.vm.customproperties").getValueFromCustomProperty(vmProperties,
                                                                                                                         customPropertyKey);
    /* eslint-enable indent */
    log.log("Found " + friendlyLabel + ": " + customPropertyValue);
} catch (e) {
    log.error("Action failed to retrieve " + friendlyLabel + " from custom properties.",e);
}

return customPropertyValue;