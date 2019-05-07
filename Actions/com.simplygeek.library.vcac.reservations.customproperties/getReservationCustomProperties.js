/*global System Properties vcacHost reservationEntity*/

/**
 * Gets the custom properties that are associated with the provided vcac reservation.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getReservationCustomProperties
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @returns {Properties} Returns the custom properties.
 */

function checkParams(vcacHost, reservationEntity) {
    var inputErrors = [];
    var errorMessage;

    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!reservationEntity || System.getObjectType(reservationEntity) !== "vCAC:Entity") {
        inputErrors.push(" - reservationEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getReservationCustomProperties"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customProperties = new Properties();
var propertiesEntities = [];
var propertyName = "";
var propertyValue = "";
var numProperties = 0;

try {
    checkParams(vcacHost, reservationEntity);
    log.debug("Retrieving custom properties for vcac reservation.");
    propertiesEntities = reservationEntity.getLink(vcacHost, "HostReservationProperties");
    numProperties = propertiesEntities.length;
    if (numProperties > 0) {
        log.debug("The following custom properties were found:");
        for (var i = 0; i < numProperties; i++) {
            propertyName = propertiesEntities[i].getProperty("PropertyName");
            propertyValue = propertiesEntities[i].getProperty("PropertyValue");
            log.debug(propertyName + ": " + propertyValue);
            customProperties.put(propertyName, propertyValue);
        }
        log.debug("Found " + numProperties + " custom properties.");
    } else {
        log.debug("No custom properties found.");
    }
} catch (e) {
    log.error("Action failed to retrieve custom properties for vcac reservation.",e);
}

return customProperties;