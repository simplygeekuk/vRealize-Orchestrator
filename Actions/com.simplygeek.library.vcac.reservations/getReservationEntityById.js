/*global vcacHost tenantId reservationId*/

/**
 * Finds the vCAC reservation entity for a tenant by its id.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getReservationEntityById
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} tenantId - The tenant id.
 * @param {string} reservationId - The reservation id.
 * @returns {vCAC:Entity} returns the vcac reservation entity.
 */

function checkParams(vcacHost, tenantId, reservationId) {
    var inputErrors = [];
    var errorMessage;

    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!tenantId || typeof tenantId !== "string") {
        inputErrors.push(" - tenantId missing or not of type 'string'");
    }
    if (!reservationId || typeof reservationId !== "string") {
        inputErrors.push(" - reservationId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getReservationEntityById"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vcacEntity;
var entitySetName = "HostReservations";
var entityName = "";
var numEntities = 0;
var reservationEntities = [];
var query = "";

try {
    checkParams(vcacHost, tenantId, reservationId);
    log.log("Finding vCAC reservation entity with id '" + reservationId + "'");
    query = "ProvisioningGroup/TenantID eq '" + tenantId.toLowerCase() +
            "' and HostReservationID eq guid'" + reservationId + "'";
    reservationEntities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesBySystemQuery(vcacHost,
                                                                                                                entitySetName,
                                                                                                                query);
    numEntities = reservationEntities.length;
    if (numEntities > 0) {
        vcacEntity = reservationEntities[0];
        entityName = vcacEntity.getProperty("HostReservationName");
        log.log("Found vCAC reservation entity '" + entityName + "' with id '" + reservationId + "'");
    } else {
        log.error("No vCAC reservation entity was found.");
    }
} catch (e) {
    log.error("Unable to find vCAC reservation entity.",e);
}

return vcacEntity;