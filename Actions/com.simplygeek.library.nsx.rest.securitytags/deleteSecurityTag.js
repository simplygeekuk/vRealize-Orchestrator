/*global nsxRestHost, tagName*/

/**
 * Deletes an NSX security tag by its name.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function deleteSecurityTag
 * @param {REST:RESTHost} nsxRestHost - The NSX Rest Host.
 * @param {string} tagName - The NSX security tag name.
 */

function checkParams(nsxRestHost, tagName) {
    var inputErrors = [];
    var errorMessage;

    if (!nsxRestHost || System.getObjectType(nsxRestHost) !== "REST:RESTHost") {
        inputErrors.push(" - nsxRestHost missing or not of type 'REST:RESTHost'");
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
var logName = "deleteSecurityTag"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger();
var log = new Logger(logType, logName);
var tagId = "";
// API variables
var HttpClient = System.getModule("com.simplygeek.library.rest").httpClient();
var acceptType = "application/json";
var restUrl = "/2.0/services/securitytags/tag/";
var response;

try {
    checkParams(nsxRestHost, tagName);
    log.log("Deleting NSX security tag '" + tagName + "'");
    var http = new HttpClient(nsxRestHost, acceptType);

    tagId = System.getModule("com.simplygeek.library.nsx.rest.securitytags").getSecurityTagIdByName(nsxRestHost,
                                                                                                    tagName);
    restUrl += tagId;
    response = http.delete(restUrl);
    if (response) {
        log.log("Successfully deleted NSX security tag '" + tagName + "'");
    }
} catch (e) {
    log.error("Action failed to delete NSX security tag.",e);
}