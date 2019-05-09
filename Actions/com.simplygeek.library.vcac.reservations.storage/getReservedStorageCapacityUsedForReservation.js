/*global System vcacHost reservationEntity storagePath*/

/**
 * Gets the reserved storage capacity used for the storage path in the reservation.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getReservedStorageCapacityUsedForReservation
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @param {string} storagePath - The storage path.
 * @returns {number} Returns the reserved storage capacity used in GB.
 */

function checkParams(vcacHost, reservationEntity, storagePath) {
    var inputErrors = [];
    var errorMessage;

    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!reservationEntity || System.getObjectType(reservationEntity) !== "vCAC:Entity") {
        inputErrors.push(" - reservationEntity missing or not of type 'vCAC:Entity'");
    }
    if (!storagePath || typeof storagePath !== "string") {
        inputErrors.push(" - storagePath missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getReservedStorageCapacityUsedForReservation"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var reservedCapacityUsedGB = 0;
var reservationName = "";
var reservationId = "";
var hostReservationToStorages = [];
var hostReservationToStorage;
var resStoragePaths = [];
var query = "";
var entitySetName = "HostReservationToStorageStats";
var storageStatsEntities = [];
var hostToStorageId = "";

try {
    checkParams(vcacHost, reservationEntity, storagePath);
    reservationName = reservationEntity.getProperty("HostReservationName");
    reservationId = reservationEntity.getProperty("HostReservationID");
    log.log("Getting reserved storage capacity used for '" + storagePath + "' in reservation '" + reservationName + "'");
    hostReservationToStorages = reservationEntity.getLink(vcacHost, "HostReservationToStorages");
    resStoragePaths = hostReservationToStorages.map(function(x){return x.getLink(vcacHost,
                                                                                 "HostToStorage")[0].getProperty("StoragePath");});
    if (resStoragePaths.indexOf(storagePath) !== -1) {
        hostReservationToStorage = hostReservationToStorages.filter(function(x){return x.getLink(vcacHost,
                                                                                                 "HostToStorage")[0].getProperty("StoragePath") === storagePath;});
        hostToStorageId = hostReservationToStorage[0].getLink(vcacHost, "HostToStorage")[0].getProperty("HostToStorageID");
        query = "HostReservationID eq guid'" + reservationId + "' and HostToStorageID eq guid'" + hostToStorageId + "'";
        storageStatsEntities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesBySystemQuery(vcacHost,
                                                                                                                     entitySetName,
                                                                                                                     query);
        reservedCapacityUsedGB = storageStatsEntities[0].getProperty("StorageAllocated");
    } else {
        log.error("Storage path '" + storagePath + "' not found in reservation '" + reservationName + "'");
    }

    log.log("Reserved storage capacity used: " + reservedCapacityUsedGB + " GB");
} catch (e) {
    log.error("Action failed to get reserved storage capacity used for vcac reservation.",e);
}

return reservedCapacityUsedGB;