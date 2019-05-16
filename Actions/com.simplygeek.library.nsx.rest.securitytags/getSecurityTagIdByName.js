/*global nsxRestHost, tagName*/

/**
 * Finds an NSX security tag by its name and returns the tag id.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getSecurityTagIdByName
 * @param {REST:RESTHost} nsxRestHost - The NSX Rest Host.
 * @param {string} tagName - The NSX security tag name.
 * @returns {string} Returns the security tag id.
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
var logName = "getSecurityTagIdByName"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger();
var log = new Logger(logType, logName);
var tagId = "";
var tagList = [];
var tagFound = false;
var allSecurityTags = "";
var xTagName = "";

try {
    checkParams(nsxRestHost, tagName);
    log.log("Getting NSX security tag id for tag '" + tagName + "'");
    allSecurityTags = System.getModule("com.simplygeek.library.nsx.rest.securitytags").getSecurityTags(nsxRestHost);
    tagList = JSON.parse(allSecurityTags);
    for (var i = 0; i < tagList.length; i++) {
        xTagName = tagList[i].name;
        if (tagName === xTagName) {
            tagId = tagList[i].objectId;
            log.log("Found NSX security tag '" + tagName + "' with Id '" + tagId + "'");
            tagFound = true;
            break;
        }
    }
    if (!tagFound) {
        log.error("Unable to find NSX security tag '" + tagName + "'");
    }
} catch (e) {
    log.error("Action failed to get NSX security tag id.",e);
}

return tagId;