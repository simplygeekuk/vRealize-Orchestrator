/*global vcacHost vmName*/

/**
 * Finds all vCAC entities that have the same virtual machine name.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function findEntitiesForVirtualMachineByName
 * @param {vCAC:VCACHost} vcacHost - The vCAC Host.
 * @param {string} vmName - The virtual machine name.
 * @returns {vCAC:Entity[]} Returns the array of virtual machine entities.
 */

function checkParams(vcacHost, vmName) {
    var inputErrors = [];
    var errorMessage;

    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!vmName || typeof vmName !== "string") {
        inputErrors.push(" - vmName missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "findEntitiesForVirtualMachineByName"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vmEntities = [];
var entitySetName = "VirtualMachines";
var vmProperties = new Properties();
var numEntities = 0;

try {
    checkParams(vcacHost, vmName);
    log.log("Finding entities for virtual machine with the name: " + vmName);
    vmProperties.put("VirtualMachineName", vmName);
    vmEntities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesByCustomFilter(vcacHost, entitySetName, vmProperties);
    numEntities = vmEntities.length;
    log.log("Found " + numEntities + " entities.");
} catch (e) {
    log.error("Action failed to get entities for virtual machine by name.",e);
}

return vmEntities;