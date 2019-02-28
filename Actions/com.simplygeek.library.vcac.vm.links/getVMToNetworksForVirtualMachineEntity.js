/*global vcacHost vcacVmEntity*/

/**
 * Retrieves a list of networks assigned to the vCAC virtual machine entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getVMToNetworksForVirtualMachineEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} vcacVmEntity - The vCAC virtual machine entity.
 * @returns {string[]} Returns the list of IPv4 addresses.
 */

function checkParams(vcacHost, vcacVmEntity) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!vcacVmEntity || System.getObjectType(vcacVmEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacVmEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

function getNetwork(network) {
    var networkName = network.getLink(vcacHost, "HostNic")[0].getProperty("NetworkName");
    log.log("Found network '" + networkName);
    return networkName;
}

var logType = "Action";
var logName = "getVMToNetworksForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var linkKey = "VMToNetworks";
var networkEntities = [];
var networks = [];
var numNetworks = 0;
var vcacVmEntityName = "";

try {
    checkParams(vcacHost, vcacVmEntity);
    vcacVmEntityName = vcacVmEntity.getProperty("VirtualMachineName");
    log.log("Retrieving list of networks assigned to vcac vm entity: " + vcacVmEntityName);
    networkEntities = vcacVmEntity.getLink(vcacHost, linkKey);
    networks = networkEntities.map(function(x){return getNetwork(x);});
    numNetworks = networks.length;
    log.log("Found " + numNetworks + " networks.");
} catch (e) {
    log.error("Action failed to get list of networks.",e);
}

return networks;