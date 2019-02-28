/*global vcacHost vcacVmEntity*/

/**
 * Get the reservation name for the vcac virtual machine entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getReservationNameForVirtualMachineEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The vCAC virtual machine entity.
 * @returns {string} Returns the reservation name.
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
var logName = "getReservationNameForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var reservationEntity;
var reservationName = "";
var vmEntityName = "";

try {
    checkParams(vcacHost, vcacVmEntity);
    vmEntityName = vcacVmEntity.getProperty("VirtualMachineName");
    log.log("Getting reservation name for virtual machine entity: " + vmEntityName);
    reservationEntity = System.getModule("com.simplygeek.library.vcac.vm.links").getReservationEntityForVirtualMachineEntity(vcacHost,
                                                                                                                             vcacVmEntity);
    reservationName = reservationEntity.getProperty("HostReservationName");
    log.log("Found reservation: " + reservationName);
} catch (e) {
    log.error("Action failed to get reservation name for virtual machine entity.",e);
}

return reservationName;