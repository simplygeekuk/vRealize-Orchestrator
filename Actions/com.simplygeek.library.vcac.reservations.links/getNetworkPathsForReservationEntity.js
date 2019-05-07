/*global System vcacHost reservationEntity*/

/**
 * Gets a list of network paths that are enabled in the reservation.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getNetworkPathsForReservationEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @returns {string[]} Returns the list of network paths.
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
var logName = "getNetworkPathsForReservationEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var networkPaths = [];
var hostNicReservations = [];
var reservationName = "";
var numNetworkPaths = 0;

try {
    checkParams(vcacHost, reservationEntity);
    reservationName = reservationEntity.getProperty("HostReservationName");
    log.log("Getting a list of network paths enabled on vcac reservation '" + reservationName + "'");
    hostNicReservations = reservationEntity.getLink(vcacHost, "HostNicToReservations");
    networkPaths = hostNicReservations.map(function(x){return x.getLink(vcacHost, "HostNic")[0].getProperty("HostNicName");});
    numNetworkPaths = networkPaths.length;
    for (var i = 0; i < numNetworkPaths; i++) {
        log.log("Found network path '" + networkPaths[i] + "'");
    }
    log.log("Found " + numNetworkPaths + " network path(s).");
} catch (e) {
    log.error("Action failed to get a list of network paths enabled on vcac reservation.",e);
}

return networkPaths;