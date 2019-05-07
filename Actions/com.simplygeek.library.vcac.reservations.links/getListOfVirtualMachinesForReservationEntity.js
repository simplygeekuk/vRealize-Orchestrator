/*global System vcacHost reservationEntity*/

/**
 * Gets a list of virtual machines that have been provisioned using the reservation.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getListOfVirtualMachinesForReservationEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @returns {string[]} Returns a list of virtual machine names.
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
var logName = "getListOfVirtualMachinesForReservationEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vmEntities = [];
var vmNames = [];
var reservationName = "";
var numVms = 0;

try {
    checkParams(vcacHost, reservationEntity);
    reservationName = reservationEntity.getProperty("HostReservationName");
    log.log("Getting a list of virtual machines for vcac reservation '" + reservationName + "'");
    vmEntities = reservationEntity.getLink(vcacHost, "VirtualMachines");
    vmNames = vmEntities.map(function(x){return x.getProperty("VirtualMachineName");});
    numVms = vmNames.length;
    log.log("Found " + numVms + " virtual machines.");
} catch (e) {
    log.error("Action failed to get a list of virtual machines for vcac reservation.",e);
}

return vmNames;