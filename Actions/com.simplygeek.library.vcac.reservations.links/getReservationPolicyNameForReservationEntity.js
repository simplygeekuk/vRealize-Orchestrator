/*global System vcacHost reservationEntity*/

/**
 * Gets the reservation policy name assigned to the reservation.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getReservationPolicyNameForReservationEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @returns {string} Returns the reservation policy name.
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
var logName = "getReservationPolicyNameForReservationEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var reservationPolicyName = "";
var reservationPolicyEntity;
var reservationName = "";

try {
    checkParams(vcacHost, reservationEntity);
    reservationName = reservationEntity.getProperty("HostReservationName");
    log.log("Getting reservation policy name for vcac reservation '" + reservationName + "'");
    reservationPolicyEntity = reservationEntity.getLink(vcacHost, "HostReservationPolicy")[0];
    reservationPolicyName = reservationPolicyEntity.getProperty("name");
    log.log("Found reservation policy name '" + reservationPolicyName + "'");
} catch (e) {
    log.error("Action failed to get reservation policy name for vcac reservation.",e);
}

return reservationPolicyName;