/*global nsxRestHost, vcVm, tagName*/

/**
 * Attaches the specified nsx security tag to a vCenter virtual machine.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function attachSecurityTagToVcVm
 * @param {REST:RESTHost} nsxRestHost - The NSX Rest Host.
 * @param {VC:VirtualMachine} vcVm - The vCenter Virtual Machine.
 * @param {string} tagName - The NSX security tag name.
 */

function checkParams(nsxRestHost, vcVm, tagName) {
    var inputErrors = [];
    var errorMessage;

    if (!nsxRestHost || System.getObjectType(nsxRestHost) !== "REST:RESTHost") {
        inputErrors.push(" - nsxRestHost missing or not of type 'REST:RESTHost'");
    }
    if (!vcVm || System.getObjectType(vcVm) !== "VC:VirtualMachine") {
        inputErrors.push(" - vcVm missing or not of type 'VC:VirtualMachine'");
    }
    if (!tagName || typeof tagName !== "string") {
        inputErrors.push(" - tagName missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "attachSecurityTagToVcVm"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger();
var log = new Logger(logType, logName);
var vmName = "";
var vmUuid = "";
var tagId = "";
// API variables
var HttpClient = System.getModule("com.simplygeek.library.rest").httpClient();
var acceptType = "application/json";
var restUrl = "/2.0/services/securitytags/tag/";
var response;

try {
    checkParams(nsxRestHost, vcVm, tagName);
    var http = new HttpClient(nsxRestHost, acceptType);

    vmName = vcVm.name;
    vmUuid = vcVm.config.instanceUuid;
    log.log("Attaching NSX security tag '" + tagName + "' to VM: '" + vmName + "'");
    tagId = System.getModule("com.simplygeek.library.nsx.rest.securitytags").getSecurityTagIdByName(nsxRestHost,
                                                                                                    tagName);
    restUrl += tagId + "/vm/" + vmUuid;
    response = http.put(restUrl);
    if (response) {
        log.log("Successfully attached NSX security tag '" + tagName + "' to VM: '" + vmName + "'");
    }
} catch (e) {
    log.error("Action failed to attach NSX security tag to vm.",e);
}