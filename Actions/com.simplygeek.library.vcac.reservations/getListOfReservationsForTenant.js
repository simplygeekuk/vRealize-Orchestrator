/*global vcacHost tenantId enabledOnly*/

/**
 * Gets a list of reservations that have been created for the
 * specified tenant id.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getListOfReservationNamesForTenant
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} tenantId - The tenant id.
 * @param {boolean} [enabledOnly] - Show only Enabled reservations?
 * @returns {string[]} return a list of reservations for the tenant.
 */

function checkParams(vcacHost, tenantId) {
    var inputErrors = [];
    var errorMessage;

    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!tenantId || typeof tenantId !== "string") {
        inputErrors.push(" - tenantId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getListOfReservationNamesForTenant"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var entitySetName = "HostReservations";
var reservationNames = [];
var numReservations = 0;
var query = "";
var reservationEntities = [];
var enabledReservations = true;

try {
    checkParams(vcacHost, tenantId);
    log.log("Getting a list of reservations for tenant: " + tenantId);
    if (!enabledOnly) {
        enabledReservations = false;
    }
    query = "ProvisioningGroup/TenantID eq '" + tenantId.toLowerCase() + "'";
    if (enabledReservations) {
        query += " and Enabled eq " + enabledReservations;
    }
    reservationEntities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesBySystemQuery(vcacHost,
                                                                                                                entitySetName,
                                                                                                                query);
    numReservations = reservationEntities.length;
    reservationNames = reservationEntities.map(function(x){return x.getProperty("HostReservationName");});
    for (var i = 0; i < numReservations; i++) {
        var reservationName = reservationEntities[i].getProperty("HostReservationName");
        var reservationId = reservationEntities[i].getProperty("HostReservationID");

        log.log("Found reservation '" + reservationName + "' with id '" + reservationId + "'");
    }
    log.log("Found a total of " + numReservations + " reservation(s).");
} catch (e) {
    log.error("Failed to get a list of reservations for tenant.",e);
}

return reservationNames;