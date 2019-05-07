/*global System vcacHost reservationEntity*/

/**
 * Gets a list of storage paths that are enabled in the reservation.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getStoragePathsForReservationEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @returns {string[]} Returns the list of storage paths.
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
var logName = "getStoragePathsForReservationEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var storagePaths = [];
var hostReservationStorages = [];
var reservationName = "";
var numStoragePaths = 0;

try {
    checkParams(vcacHost, reservationEntity);
    reservationName = reservationEntity.getProperty("HostReservationName");
    log.log("Getting a list of storage paths enabled on vcac reservation '" + reservationName + "'");
    hostReservationStorages = reservationEntity.getLink(vcacHost, "HostReservationToStorages");
    storagePaths = hostReservationStorages.map(function(x){return x.getLink(vcacHost, "HostToStorage")[0].getProperty("StoragePath");});
    numStoragePaths = storagePaths.length;
    for (var i = 0; i < numStoragePaths; i++) {
        log.log("Found storage path '" + storagePaths[i] + "'");
    }
    log.log("Found " + numStoragePaths + " storage path(s).");
} catch (e) {
    log.error("Action failed to get a list of storage paths enabled on vcac reservation.",e);
}

return storagePaths;