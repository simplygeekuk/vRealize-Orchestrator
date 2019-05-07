/*global System vcacHost reservationEntity*/

/**
 * Gets the compute cluster name that the reservation is assigned to.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getComputeClusterNameForReservationEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @returns {string} Returns the compute cluster name.
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
var logName = "getComputeClusterNameForReservationEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var computeClusterName = "";
var reservationName = "";
var hostEntity;

try {
    checkParams(vcacHost, reservationEntity);
    reservationName = reservationEntity.getProperty("HostReservationName");
    log.log("Getting compute cluster name for vcac reservation '" + reservationName + "'");
    hostEntity = reservationEntity.getLink(vcacHost, "Host")[0];
    computeClusterName = hostEntity.getProperty("HostName");
    log.log("Found compute cluster name '" + computeClusterName + "'");
} catch (e) {
    log.error("Action failed to retrieve compute cluster name for vcac reservation.",e);
}

return computeClusterName;