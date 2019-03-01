/*global vcacHost*/

/**
 * Gets all compute resource entities and returns the compute resource names.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getComputeResourceNames
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @returns {string[]} Returns an array of compute resource names.
 */

function checkParams(vcacHost) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getComputeResourceNames"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var entitySetName = "Hosts";
var entities = [];
var numEntities = 0;
var computeResourceNames = [];
var query;

try {
    checkParams(vcacHost);
    log.log("Retrieving vCAC compute resource entities.");
    query = "IsVRMManaged eq true and IsCluster eq true";
    entities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesBySystemQuery(vcacHost,
                                                                                                     entitySetName,
                                                                                                     query);
    numEntities = entities.length;
    if (numEntities > 0) {
        computeResourceNames = entities.map(function(x) { return x.getProperty("HostName");});
    } else {
        throw "No vCAC Compute Resource entity was found.";
    }
} catch (e) {
    log.error("Action failed to find vCAC compute resource entity.",e);
}

return computeResourceNames.sort();