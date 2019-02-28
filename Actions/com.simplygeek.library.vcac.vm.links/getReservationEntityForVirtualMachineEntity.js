/*global vcacHost vcacVmEntity*/

/**
 * Get the reservation entity for the vcac virtual machine entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getReservationEntityForVirtualMachineEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The vCAC virtual machine entity.
 * @returns {vCAC:Entity} Returns the reservation entity.
 */

function checkParams(vcacHost, vcacVmEntity) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getReservationEntityForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var reservationEntities = [];
var reservationEntity;
var reservationName = "";
var reservationId = "";
var vmEntityName = "";
var numResEntities = 0;

try {
    checkParams(vcacHost, vcacVmEntity);
    vmEntityName = vcacVmEntity.getProperty("VirtualMachineName");
    log.debug("Getting reservation name for virtual machine entity: " + vmEntityName);
    reservationEntities = vcacVmEntity.getLink(vcacHost, "HostReservation");
    numResEntities = reservationEntities.length;
    if (numResEntities > 1 ) {
        log.error("More than one reservation was found.");
    } else if (numResEntities > 0) {
        reservationEntity = reservationEntities[0];
        reservationName = reservationEntity.getProperty("HostReservationName");
        reservationId = reservationEntity.getProperty("HostReservationID");
        log.debug("Found reservation '" + reservationName + "' with entity id '" + reservationId + "'");
    } else {
        log.error("No reservation was found.");
    }
} catch (e) {
    log.error("Action failed to get reservation name for virtual machine entity.",e);
}

return reservationEntity;