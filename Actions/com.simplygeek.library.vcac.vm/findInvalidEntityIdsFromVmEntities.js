/*global vcacVmEntities, validEntityId*/

/**
 * Gets a list of invalid entity ids associated with a vcac vm entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function findInvalidEntityIdsFromVmEntities
 * @param {vCAC:Entity[]} vcacVmEntities - The array of vcac virtual machines.
 * @param {string} validEntityId - The virtual machine entity id.
 * @returns {string[]} Returns the array of invalid vcac vm virtual machine ids.
 */

function checkParams(vcacVmEntities, validEntityId) {
    var inputErrors = [];
    var errorMessage;

    if (!vcacVmEntities || Array.isArray(vcacVmEntities) === false) {
        inputErrors.push(" - vcacVmEntities missing or not of type 'Array'");
    }
    if (!validEntityId || typeof validEntityId !== "string") {
        inputErrors.push(" - validEntityId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "findInvalidEntityIdsFromVmEntities"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var invalidEntities = [];
var invalidEntityIds = [];
var numEntities = 0;

try {
    checkParams(vcacVmEntities, validEntityId);
    log.log("Getting a list of invalid entities that do not match reference id: " + validEntityId);
    invalidEntities = vcacVmEntities.filter(function(x){return x.getProperty("VirtualMachineID") !== validEntityId;});
    invalidEntityIds = invalidEntities.map(function(x){return x.getProperty("VirtualMachineID");});
    numEntities = invalidEntityIds.length;
    log.log("Found " + numEntities + " invalid entities.");
    if (numEntities > 0) {
        log.log("The following invalid entity references were found.\n" + invalidEntityIds.join("\n"));
    }
} catch (e) {
    log.error("Action failed to get invalid entities.",e);
}

return invalidEntityIds;