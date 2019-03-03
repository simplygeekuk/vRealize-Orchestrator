/*global hostId*/

/**
 * Searches the vRO inventory for a vCACHost with the specified id.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function findVcacHostById
 * @param {string} hostId - The vCAC Host id.
 * @returns {vCAC:vCACHost} returns the vCAC host object.
 */

function checkParams(hostId) {
    var inputErrors = [];
    var errorMessage;
    if (!hostId || typeof hostId !== "string") {
        inputErrors.push(" - hostId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "findVcacHostById";
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vcacHosts = [];
var vcacHost;

try {
    checkParams(hostId);
    log.log("Finding vCAC Host with id '" + hostId + "'");
    vcacHosts = Server.findAllForType("VCAC:VCACHost",hostId);
    if (vcacHosts.length === 1) {
        vcacHost = vcacHosts[0];
        log.log("Found vCAC host: " + vcacHost.name + " [" + vcacHost.url + "]");
    } else if (vcacHosts.length > 1) {
        log.error("More than 1 vCAC host was found, which is unexpected.");
    } else {
        log.error("Unable to find vCAC host in the vRO plugins inventory.");
    }
} catch (e) {
    log.error("Failed to find vCAC Host by id.",e);
}

return vcacHost;