/*global System Properties vmProperties, customPropertyKey*/

/**
 * Looks up the provided Custom Property and returns its value.
 * @param {Properties} vmProperties - The Custom Properties payload.
 * @param {string} customPropertyKey - The Custom Property key to get the value of.
 * @returns {string} Returns the value found for the specified Custom Property.
 */

function checkParams(vmProperties, customPropertyKey) {
    var inputErrors = [];
    var errorMessage;
    if (!vmProperties || !(vmProperties instanceof Properties)) {
        inputErrors.push(" - vmProperties missing or not of type 'Properties'");
    }
    if (!customPropertyKey || typeof customPropertyKey !== "string") {
        inputErrors.push(" - customPropertyKey missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getValueFromCustomProperty"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyValue;

try {
    checkParams(vmProperties, customPropertyKey);
    log.debug("Retrieving value for custom property with key: " + customPropertyKey);
    customPropertyValue = vmProperties.get(customPropertyKey);
    if (!customPropertyValue) {
        log.error("No value was found or custom property does not exist.");
    }
    log.debug("Found value: " + customPropertyValue);
} catch (e) {
    log.error("Action failed to retrieve value for custom property.",e);
}

return customPropertyValue;