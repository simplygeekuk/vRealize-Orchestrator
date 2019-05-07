/*global System vcacHost reservationEntity*/

/**
 * Gets the business group name that the reservation belongs to.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getBusinessGroupNameForReservationEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @returns {string} Returns the business group name.
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
var logName = "getBusinessGroupNameForReservationEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var businessGroupName = "";
var businessGroupEntity;
var reservationName = "";

try {
    checkParams(vcacHost, reservationEntity);
    reservationName = reservationEntity.getProperty("HostReservationName");
    log.log("Getting business group name for vcac reservation '" + reservationName + "'");
    businessGroupEntity = System.getModule("com.simplygeek.library.vcac.reservations.links").getBusinessGroupEntityForReservationEntity(vcacHost,
                                                                                                                                        reservationEntity);
    businessGroupName = businessGroupEntity.getProperty("GroupName");
    if (!businessGroupName) {
        log.error("No business group was found.");
    }
    log.log("Found business group '" + businessGroupName + "'");
} catch (e) {
    log.error("Action failed to retrieve business group name for vcac reservation.",e);
}

return businessGroupName;