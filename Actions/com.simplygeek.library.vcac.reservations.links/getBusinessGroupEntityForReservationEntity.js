/*global System vcacHost reservationEntity*/

/**
 * Gets the business group entity that the reservation belongs to.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getBusinessGroupEntityForReservationEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @returns {vCAC:Entity} Returns the business group entity.
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
var logName = "getBusinessGroupEntityForReservationEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var businessGroupEntities = [];
var reservationId = "";
var entitySetName = "ProvisioningGroups";
var reservationName = "";
var businessGroupEntity;
var businessGroupName = "";
var businessGroupId = "";

try {
    checkParams(vcacHost, reservationEntity);
    reservationName = reservationEntity.getProperty("HostReservationName");
    log.debug("Getting business group entity for vcac reservation '" + reservationName + "'");
    reservationId = reservationEntity.getProperty("HostReservationID");
    businessGroupEntities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesByCustomFilter(vcacHost,
                                                                                                                   entitySetName);
    for (var i = 0; i < businessGroupEntities.length; i++) {
        var linkedBusinessGroupEntity = businessGroupEntities[i];
        var reservationEntities = linkedBusinessGroupEntity.getLink(vcacHost, "HostReservations");

        if (reservationEntities.length > 0) {
            for (var j = 0; j < reservationEntities.length; j++){
                var linkedReservationId = reservationEntities[j].getProperty("HostReservationID");

                if (linkedReservationId === reservationId) {
                    businessGroupEntity = linkedBusinessGroupEntity;
                    break;
                }
            }
        }
    }
    if (!businessGroupEntity) {
        log.error("No business group entity was found.");
    }
    businessGroupId = businessGroupEntity.getProperty("GroupID");
    businessGroupName = businessGroupEntity.getProperty("GroupName");
    log.debug("Found business group entity '" + businessGroupName + "' with id '" + businessGroupId + "'");
} catch (e) {
    log.error("Action failed to retrieve business group entity for vcac reservation.",e);
}

return businessGroupEntity;