/*global vcacHost virtualMachineId*/

/**
 * Searches for a vcac virtual machine entity by its entity id.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function findVirtualMachineEntityByVirtualMachineId
 * @param {vCAC:VCACHost} vcacHost - The vCAC Host.
 * @param {string} virtualMachineId - The virtual machine entity id.
 * @returns {vCAC:Entity} Returns the virtual machine entity.
 */

function checkParams(vcacHost, virtualMachineId) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!virtualMachineId || typeof virtualMachineId !== "string") {
        inputErrors.push(" - virtualMachineId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "findVirtualMachineEntityByVirtualMachineId"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var properties = new Properties();
var vcacVmEntity;
var vcacEntityFieldName = "VirtualMachineID";
var entitySetName = "VirtualMachines";
var vcacVmName = "";

try {
    checkParams(vcacHost, virtualMachineId);
    log.log("finding virtual machine entity with entity id: " + virtualMachineId);
    properties.put(vcacEntityFieldName, virtualMachineId);
    vcacVmEntity = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiyByUniqieId(vcacHost,
                                                                                                     entitySetName,
                                                                                                     properties);
    vcacVmName = vcacVmEntity.getProperty("VirtualMachineName");
    log.log("Found virtual machine entity: " + vcacVmName + " with entity id: " + virtualMachineId);
} catch (e) {
    log.error("Action failed to locate vCAC virtual machine entity.",e);
}

return vcacVmEntity;