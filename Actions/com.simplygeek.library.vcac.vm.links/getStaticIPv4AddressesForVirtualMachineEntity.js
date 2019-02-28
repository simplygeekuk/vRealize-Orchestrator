/*global vcacHost vcacVmEntity*/

/**
 * Retrieves a list of IPv4 addresses assigned to the vCAC virtual machine entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getStaticIPv4AddressesForVirtualMachineEntity
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
var logType = "Action";
var logName = "getStaticIPv4AddressesForVirtualMachineEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var linkKey = "StaticIPv4Addresses";
var ipv4AddressEntities = [];
var ipv4Addresses = [];
var numIpv4Addresses = 0;
var vcacVmEntityName = "";

try {
    checkParams(vcacHost, vcacVmEntity);
    vcacVmEntityName = vcacVmEntity.getProperty("VirtualMachineName");
    log.log("Retrieving list of IPv4 Addresses assigned to vcac vm entity: " + vcacVmEntityName);
    ipv4AddressEntities = vcacVmEntity.getLink(vcacHost, linkKey);
    ipv4Addresses = ipv4AddressEntities.map(function(x){return x.getProperty("IPv4Address");});
    numIpv4Addresses = ipv4Addresses.length;
    log.log("Found " + numIpv4Addresses + " IPv4 Addresses.");
} catch (e) {
    log.error("Action failed to get list of IPv4 Addresses",e);
}

return ipv4Addresses;