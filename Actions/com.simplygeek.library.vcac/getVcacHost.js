/*global System Server*/

/**
 * Searches the vRO inventory for any instance of a vCACHost object and returns it.
 * Note that this action assumes that only a single vCACHost is present (as is usually the case).
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getVcacHost
 * @returns {vCAC:vCACHost} returns the vCAC host object.
 */

var logType = "Action";
var logName = "getVcacHost";
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vcacHosts = [];
var vcacHost;

try {
    log.log("Locating vCAC IaaS Host...");
    vcacHosts = Server.findAllForType("VCAC:VCACHost");
    if (vcacHosts.length === 1) {
        vcacHost = vcacHosts[0];
        log.log("Found vCAC IaaS host: " + vcacHost.name + " [" + vcacHost.url + "]");
    } else if (vcacHosts.length > 1) {
        log.error("More than 1 vCAC IaaS host was found, which this action does not support.");
    } else {
        log.error("Unable to find vCAC IaaS host from the vRO plugins.");
    }
} catch (e) {
    log.error("Failed to locate vCAC IaaS Host.",e);
}

return vcacHost;