/*global siteId*/

/**
 * Finds a vCenter Server endpoint for the specified site id.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getVcenterSdkBySiteId
 * @param {string} siteId - The site identifier.
 * @returns {data_type} Returns the vCenter Server SDK Connection object.
 */

function checkParams(siteId) {
    var inputErrors = [];
    var errorMessage;
    if (!siteId || typeof siteId !== "string") {
        inputErrors.push(" - siteId missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getVcenterSdkBySiteId"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var vCenterSdkConnection;
var allVcenterSdks = [];
var vCenterSdkName = "";
var vCenterSdksFiltered = [];

try {
    checkParams(siteId);
    log.log("Locating vCenter Server with site id: " + siteId);
    allVcenterSdks = VcPlugin.allSdkConnections;
    vCenterSdksFiltered = allVcenterSdks.filter(function(x){return x.name.indexOf(siteId.toLowerCase()) !== -1;});
    if (vCenterSdksFiltered.length > 0) {
        vCenterSdkConnection = vCenterSdksFiltered[0];
        vCenterSdkName = vCenterSdkConnection.name;
        log.log("Found vCenter Server '" + vCenterSdkName + "'");
    } else {
        log.error("No vCenter Server found for site '" + siteId + "'");
    }
} catch (e) {
    log.error("Action failed locate a vCenter Server for the specified site id.",e);
}

return vCenterSdkConnection;