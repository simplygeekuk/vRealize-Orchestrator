/*global nsxRestHost*/

/**
 * Gets all security tags that exist on the NSX manager.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getSecurityTags
 * @param {REST:RESTHost} nsxRestHost - The NSX Rest Host.
 * @returns {string} Returns the security tags in JSON format.
 */

function checkParams(nsxRestHost) {
    var inputErrors = [];
    var errorMessage;

    if (!nsxRestHost || System.getObjectType(nsxRestHost) !== "REST:RESTHost") {
        inputErrors.push(" - nsxRestHost missing or not of type 'REST:RESTHost'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getSecurityTags"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var tagList = [];
var numTagsFound = 0;
var tags = "";
// API variables
var HttpClient = System.getModule("com.simplygeek.library.rest").httpClient();
var acceptType = "application/json";
var restUrl = "/2.0/services/securitytags/tag";
var response;

try {
    checkParams(nsxRestHost);
    log.debug("Getting NSX security tags.");
    var http = new HttpClient(nsxRestHost, acceptType);

    response = http.get(restUrl).contentAsString;
    tagList = JSON.parse(response).securityTagDtoList;
    numTagsFound = tagList.length;
    tags = JSON.stringify(tagList);
    log.debug("Found " + numTagsFound.toString() + " NSX security tags.");
} catch (e) {
    log.error("Action failed to get NSX security tags.",e);
}

return tags;