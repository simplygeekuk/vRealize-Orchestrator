/*global vcacHost, computeResourceEntity*/

/**
 * Returns the vCAC Agent status for the specified compute resource.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getAgentStatusForComputeResourceEntity
 * @param {vCAC:VCACHOST} vcacHost - The vCAC Host.
 * @param {vCAC:Entity} computeResourceEntity - The compute resource entity.
 * @returns {boolean} Returns the vCAC Agent status.
 */

function checkParams(vcacHost, computeResourceEntity) {
    var inputErrors = [];
    var errorMessage;
    if (!vcacHost || System.getObjectType(vcacHost) !== "vCAC:VCACHost") {
        inputErrors.push(" - vcacHost missing or not of type 'vCAC:VCACHost'");
    }
    if (!computeResourceEntity || System.getObjectType(computeResourceEntity) !== "vCAC:Entity") {
        inputErrors.push(" - computeResourceEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getAgentStatusForComputeResourceEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var entitySetName = "Agent";
var agentEntity;
var computeResourceName = "";
var agentStatus;

try {
    checkParams(vcacHost, computeResourceEntity);
    computeResourceName = computeResourceEntity.getProperty("HostName");
    log.log("Getting Agent status for compute resource '" + computeResourceName + "'");
    agentEntity = computeResourceEntity.getLink(vcacHost, entitySetName)[0];
    agentStatus = agentEntity.getProperty("AgentAlive");
    log.log("Agent Status: " + agentStatus);
} catch (e) {
    log.error("Action failed to get Agent status for compute resource.",e);
}

return agentStatus;