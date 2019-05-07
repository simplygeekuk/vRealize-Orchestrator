/*global vcacHost tenantId reservationName*/

/**
 * Finds the vCAC reservation entity for a tenant by name.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function findReservationEntityByName
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} tenantId - The tenant id.
 * @param {string} reservationName - The reservation name.
 * @returns {vCAC:Entity} returns the vcac reservation entity.
 */

function checkParams(vcacHost, tenantId, reservationName) {
    var inputErrors = [];
    var errorMessage;

    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!tenantId || typeof tenantId !== "string") {
        inputErrors.push(" - tenantId missing or not of type 'string'");
    }
    if (!reservationName || typeof reservationName !== "string") {
        inputErrors.push(" - reservationName missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "findReservationEntityByName"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vcacEntity;
var entitySetName = "HostReservations";
var entityId = "";
var numEntities = 0;
var reservationEntities = [];
var query = "";

try {
    checkParams(vcacHost, tenantId, reservationName);
    log.log("Finding vCAC reservation entity with name '" + reservationName + "'");
    query = "ProvisioningGroup/TenantID eq '" + tenantId.toLowerCase() +
            "' and HostReservationName eq '" + reservationName + "'";
    reservationEntities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesBySystemQuery(vcacHost,
                                                                                                                entitySetName,
                                                                                                                query);
    numEntities = reservationEntities.length;
    if (numEntities > 0) {
        vcacEntity = reservationEntities[0];
        entityId = vcacEntity.getProperty("HostReservationID");
        log.log("Found vCAC reservation entity '" + reservationName + "' with id '" + entityId + "'");
    } else {
        log.error("No vCAC reservation entity was found.");
    }
} catch (e) {
    log.error("Unable to find vCAC reservation entity.",e);
}

return vcacEntity;