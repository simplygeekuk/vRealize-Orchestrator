/*global vcacVmEntity reservationId, storageEntity*/

/**
 * Updates the reservation and storage cluster for a virtual machine entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function updateReservationForVirtualMachineEntity
 * @param {vCAC:Entity} vcacVmEntity - The vCAC Virtual Machine Entity.
 * @param {string} reservationId - The vCAC Reservation Id.
 * @param {vCAC:Entity} storageEntity - The vCAC Storage Entity.
 */

function checkParams(vcacVmEntity, reservationId, storageEntity) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (!reservationId || typeof reservationId !== "string") {
        inputErrors.push(" - reservationId missing or not of type 'string'");
    }
    if (!storageEntity || System.getObjectType(storageEntity) !== "vCAC:Entity") {
        inputErrors.push(" - storageEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "updateReservationForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vmEntityName = "";
var reservationEntityId = new Properties();
var storageEntityLink = new Properties();
var storageEntityId = "";
var updatedVcacEntity;
var newStorageEntityId = "";
var newReservationEntityId = "";

try {
    checkParams(vcacVmEntity, reservationId, storageEntity);
    vmEntityName = vcacVmEntity.getProperty("VirtualMachineName");
    log.log("Updating reservation for virtual machine entity: " + vmEntityName);
    storageEntityId = storageEntity.getProperty("HostReservationToStorageID");
    reservationEntityId.put("HostReservationID", reservationId);
    storageEntityLink.put("HostReservationToStorage", [storageEntity]);
    updatedVcacEntity = System.getModule("com.simplygeek.library.vcac.entities").updatevCACEntity(vcacVmEntity,
                                                                                                  reservationEntityId,
                                                                                                  storageEntityLink);
    newReservationEntityId = updatedVcacEntity.getProperty("HostReservationID");
    newStorageEntityId = updatedVcacEntity.getLink("HostReservationToStorage").getProperty("HostReservationToStorageID");
    if (reservationId !== newReservationEntityId || storageEntityId !== newStorageEntityId) {
        // Need to update this to identify which part failed and roll back anything that did change.
        log.error("Updating reservation failed.");
    }
    log.log("Successfully updated reservation for virtual machine entity: " + vmEntityName);
} catch (e) {
    log.error("Action failed to update reservation for virtual machine entity.",e);
}