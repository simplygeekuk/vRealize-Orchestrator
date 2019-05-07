/*global System vcacHost reservationEntity*/

/**
 * Gets the resource pool name that the reservation is assigned to.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getResourcePoolNameForReservationEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @returns {string} Returns the resource pool name.
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
var logName = "getResourcePoolNameForReservationEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var resourcePoolName = "";
var reservationName = "";
var hostEntity;

try {
    checkParams(vcacHost, reservationEntity);
    reservationName = reservationEntity.getProperty("HostReservationName");
    log.log("Getting resource pool name for vcac reservation '" + reservationName + "'");
    hostEntity = reservationEntity.getLink(vcacHost, "ResourcePool")[0];
    resourcePoolName = hostEntity.getProperty("ResourcePoolName");
    log.log("Found resource pool name '" + resourcePoolName + "'");
} catch (e) {
    log.error("Action failed to retrieve resource pool name for vcac reservation.",e);
}

return resourcePoolName;