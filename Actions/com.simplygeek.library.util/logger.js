/*global System*/

/**
 * This action creates a Logger object that can be used to standardise the log output in workflows.
 * This provides greater visibility into what code is executing and where, which makes troubleshooting easier.
 * @function logger
 * @param {string} logType - The component type i.e. Action or Workflow.
 * @param {string} logName - The Action or Workflow name.
 * @returns {*} The Logger object.
 */

function Logger(logType, logName) {
    this.type = logType;
    this.name = logName;
    this.log = function (logMsg) {
        System.log("[" + this.type + ": " + this.name + "] " + logMsg);
    };
    this.warn = function (warnMsg) {
        System.warn("[" + this.type + ": " + this.name + "] " + warnMsg);
    };
    this.error = function (errMsg, exception) {
        System.error("[" + this.type + ": " + this.name + "] " + errMsg);
        if (exception) {
            throw "[" + this.type + ": " + this.name + "] " + errMsg + " " + exception;
        } else {
            throw errMsg;
        }
    };
    this.debug = function (debugMsg) {
        System.debug("[" + this.type + ": " + this.name +"] " + debugMsg);
    };

}

return Logger;