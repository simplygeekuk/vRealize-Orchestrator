/*global System Properties vmProperties nicIndex*/

/**
 * Gets the network name for the network adapter index.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getNetworkNameFromCustomProperties
 * @param {Properties} vmProperties - The Custom Properties payload.
 * @param {number} nicIndex - The network adaptor index.
 * @returns {string} Returns the network name for the specified network adapter index.
 */

function checkParams(vmProperties, nicIndex) {
    var inputErrors = [];
    var errorMessage;
    if (!vmProperties || !(vmProperties instanceof Properties)) {
        inputErrors.push(" - vmProperties missing or not of type 'Properties'");
    }
    if (typeof nicIndex !== "number") {
        inputErrors.push(" - nicIndex missing or not of type 'number'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getNetworkNameFromCustomProperties"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyKey = "VirtualMachine.Network##index##.Name";
var friendlyLabel = "Network Name";
var customPropertyValue;

try {
    checkParams(vmProperties, nicIndex);
    log.log("Retrieving " + friendlyLabel + " from custom properties with key: " + customPropertyKey);
    customPropertyKey = customPropertyKey.replace("##index##", nicIndex.toString());
    customPropertyValue = System.getModule("com.simplygeek.library.vcac.vm.customproperties").getValueFromCustomProperty(vmProperties,
                                                                                                                         customPropertyKey);
    log.log("Found " + friendlyLabel + ": " + customPropertyValue);
} catch (e) {
    log.error("Action failed to retrieve " + friendlyLabel + " from custom properties.",e);
}

return customPropertyValue;