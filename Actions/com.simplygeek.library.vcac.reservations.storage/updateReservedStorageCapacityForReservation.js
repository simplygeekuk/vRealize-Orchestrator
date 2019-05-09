/*global System vcacHost reservationEntity storagePath newReservedCapacity*/

/**
 * Updates the reserved storage capacity for the storage path in the reservation.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function updateReservedStorageCapacityForReservation
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @param {string} storagePath - The storage path.
 * @param {number} newReservedCapacity - The amount of storage to reserve.
 */

function checkParams(vcacHost, reservationEntity, storagePath, newReservedCapacity) {
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
    if (typeof newReservedCapacity !== "number") {
        inputErrors.push(" - newReservedCapacity missing or not of type 'number'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updateReservedStorageCapacityForReservation"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var currentReservedCapacity = 0;
var propertyToUpdate = "MaxCapacity";
var reservationName = "";
var storageReservationViewEntities = [];
var query = "";
var entitySetName = "HostReservationToStorages";

try {
    checkParams(vcacHost, reservationEntity, storagePath, newReservedCapacity);
    reservationName = reservationEntity.getProperty("HostReservationName");
    log.log("Updating reserved storage capacity for '" + storagePath + "' in reservation '" +
            reservationName + "' to " + newReservedCapacity + " GB.");
    currentReservedCapacity = System.getModule("com.simplygeek.library.vcac.reservations.storage").getReservedStorageCapacityTotalForReservation(vcacHost,
                                                                                                                                                 reservationEntity,
                                                                                                                                                 storagePath);
    if (newReservedCapacity < 0) {
        log.error("Cannot set reserved storage capacity to a value less than 0.");
    } else if (newReservedCapacity === currentReservedCapacity) {
        log.log("Current reserved storage capacity is already set to " + newReservedCapacity + " GB.");
    } else {
        query = "HostToStorage/StoragePath eq '" + storagePath + "'";
        storageReservationViewEntities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesBySystemQuery(vcacHost,
                                                                                                                               entitySetName,
                                                                                                                               query);
        System.getModule("com.simplygeek.library.vcac.entities").updatePropertyValueForVcacEntity(storageReservationViewEntities[0],
                                                                                                  propertyToUpdate,
                                                                                                  newReservedCapacity);
        log.log("Successfully updated reserved storage capacity to " + newReservedCapacity + " GB.");
    }
} catch (e) {
    log.error("Action failed to update reserved storage capacity for vcac reservation.",e);
}