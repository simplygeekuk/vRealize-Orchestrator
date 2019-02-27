/*global System Server tenantId*/

/**
 * Searches for the vCACCAFE:VCACHost that is associated with the provided tenent and returns it.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getVcacCafeHost
 * @param {string} tenantId - The tenant identifier.
 * @returns {vCACCAFE:VCACHost} The vCACCAFE:VCACHost object for the tenant.
 */

function checkParams(tenantId) {
    var inputErrors = [];
    var errorMessage;
    if (!tenantId || typeof tenantId !== "string") {
        inputErrors.push(" - tenantId missing or not of type 'String'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getVcacCafeHost";
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vcacCafeHosts = [];
var vcacCafeTenantHosts = [];
var vcacCafeHost;

try {
    checkParams(tenantId);
    log.log("Locating vCAC Cafe Host for tenant: " + tenantId);
    vcacCafeHosts = Server.findAllForType("VCACCAFE:VCACHost", tenantId);
    vcacCafeTenantHosts = vcacCafeHosts.filter(function(x){return x.tenant === tenantId;});
    if (vcacCafeTenantHosts.length > 0) {
        vcacCafeHost = vcacCafeTenantHosts[0];
    } else {
        log.error("Unable to find vCAC Cafe host for tenant: " + tenantId);
    }
    log.log("Found vCAC Cafe host: " + vcacCafeHost.name + " [" + vcacCafeHost.url + "] [" + vcacCafeHost.tenant + "]");
} catch (e) {
    log.error("Action failed when attempting to find vCACCAFE:VCACHost for the provided tenant.",e);
}

return vcacCafeHost;