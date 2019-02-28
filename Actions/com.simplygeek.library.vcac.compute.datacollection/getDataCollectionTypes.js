/*global vcacHost computeResourceName*/

/**
 * Gets a list of data collection types that are associated with the compute resource.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getDataCollectionTypes
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {string} computeResourceName - The compute resource name.
 * @returns {string[]} Returns a list of data collection types associated with the compute resource.
 */

function checkParams(vcacHost, computeResourceName) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!computeResourceName || typeof computeResourceName !== "string") {
        inputErrors.push(" - computeResourceName missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getDataCollectionTypes"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var dataCollectionEntities = [];
var computeResourceEntity;
var dataCollectionProps = new Properties();
var dataCollectionEntitySet = "DataCollectionStatuses";
var dataCollectionTypes = [];
var dataCollectionEntityId;
var numDataCollectionTypes = 0;
var filterSpecEntities = [];
var filterSpecGroupEntities = [];

try {
    checkParams(vcacHost, computeResourceName);
    log.log("Getting data collection types for compute resource ''");
    computeResourceEntity = System.getModule("com.simplygeek.library.vcac.compute").getComputeResourceEntityByName(vcacHost,
                                                                                                                   computeResourceName);
    dataCollectionEntityId = computeResourceEntity.getProperty("HostID");
    dataCollectionProps.put("EntityID", dataCollectionEntityId);
    dataCollectionEntities = System.getModule("com.simplygeek.library.vcac.entities").getVcacEntitiesByCustomFilter(vcacHost,
                                                                                                                    dataCollectionEntitySet,
                                                                                                                    dataCollectionProps);
    filterSpecEntities = dataCollectionEntities.map(function(x){return x.getLink(vcacHost,"FilterSpec")[0];});
    filterSpecGroupEntities = filterSpecEntities.map(function(x){return x.getLink(vcacHost,"FilterSpecGroup")[0];});
    dataCollectionTypes = filterSpecGroupEntities.map(function(x){return x.getProperty("FilterSpecGroupName");});
    numDataCollectionTypes = filterSpecGroupEntities.length;
    log.log("Found " + numDataCollectionTypes + " data collection types.");
} catch (e) {
    log.error("Action failed to retrieve data collection enabled status.",e);
}

return dataCollectionTypes.sort();