/*global nsxRestHost, tagName, tagDescription*/

/**
 * Creates an NSX security tag with the specified name and description.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function createNsxSecurityTag
 * @param {REST:RESTHost} nsxRestHost - The NSX Rest Host.
 * @param {string} tagName - The NSX security tag name.
 * @param {string} tagDescription - The NSX security tag description.
 */

function checkParams(nsxRestHost, tagName, tagDescription) {
    var inputErrors = [];
    var errorMessage;

    if (!nsxRestHost || System.getObjectType(nsxRestHost) !== "REST:RESTHost") {
        inputErrors.push(" - nsxRestHost missing or not of type 'REST:RESTHost'");
    }
    if (!tagName || typeof tagName !== "string") {
        inputErrors.push(" - tagName missing or not of type 'string'");
    }
    if (!tagDescription || typeof tagDescription !== "string") {
        inputErrors.push(" - tagDescription missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "createNsxSecurityTag"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger();
var log = new Logger(logType, logName);
var tagConfigObj = {};
var tagConfig;
var allSecurityTags;
var tagList = [];
var xTagName = "";
var tagId;
var tagFound = false;
// API variables
var HttpClient = System.getModule("com.simplygeek.library.rest").httpClient();
var contentType = "application/json";
var acceptType = "application/json";
var restUrl = "/2.0/services/securitytags/tag";
var expectedResponseCodes = [201];
var response;

try {
    checkParams(nsxRestHost, tagName, tagDescription);
    log.log("Creating NSX security tag '" + tagName + "'");
    var http = new HttpClient(nsxRestHost, acceptType);

    allSecurityTags = System.getModule("com.simplygeek.library.nsx.rest.securitytags").getSecurityTags(nsxRestHost);
    tagList = JSON.parse(allSecurityTags);
    for (var i = 0; i < tagList.length; i++) {
        xTagName = tagList[i].name;
        if (tagName === xTagName) {
            tagId = tagList[i].objectId;
            log.log("An existing NSX security tag '" + tagName + "' with Id '" + tagId + "' was found.");
            tagFound = true;
            break;
        }
    }

    if (!tagFound) {
        tagConfigObj.name = tagName;
        tagConfigObj.description = tagDescription;
        tagConfig = JSON.stringify(tagConfigObj);
        response = http.post(restUrl,tagConfig,contentType,expectedResponseCodes);
        if (response) {
            log.log("Successfully created NSX security tag '" + tagName + "'");
        }
    }

} catch (e) {
    log.error("Action failed to create NSX security tag.",e);
}