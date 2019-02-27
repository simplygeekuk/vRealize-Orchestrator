/*global System Properties ebsPayload*/

/**
 * Gets the custom properties associated with the virtual machine from the event broker.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getCustomPropertiesFromEbsPayload
 * @param {Properties} ebsPayload - The event broker payload.
 * @returns {Properties} Returns the properties object containing the custom properties.
 */

function checkParams(ebsPayload) {
    var inputErrors = [];
    var errorMessage;
    if (!ebsPayload || !(ebsPayload instanceof Properties)) {
        inputErrors.push(" - ebsPayload missing or not of type 'Properties'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getCustomPropertiesFromEbsPayload"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vmProperties = new Properties();
var propertyValue;
var propertyNames = [];
var propertyName;

try {
    checkParams(ebsPayload);
    log.debug("Getting VM Custom Properties from EBS Payload");
    vmProperties = ebsPayload.machine.get("properties");
    propertyNames = vmProperties.keys;
    // eslint-disable-next-line space-infix-ops
    for (var i=0; i<propertyNames.length; i++) {
        propertyName = propertyNames[i];
        propertyValue = vmProperties.get(propertyName);
        log.debug("Found property " + propertyName + ": " + propertyValue);
    }
} catch (e) {
    log.error("Action failed to get VM Custom Properties from EBS payload.",e);
}

return vmProperties;