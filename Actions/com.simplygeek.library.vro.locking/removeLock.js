/*global lockId lockOwner*/

/**
 * Creates a process lock using the vRO Locking System.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function removeLock
 * @param {string} lockId - What to unlock.
 * @param {string} lockOwner - Who is removing the lock.
 */

function checkParams(lockId, lockOwner) {
    var inputErrors = [];
    var errorMessage;
    if (!lockId || typeof lockId !== "string") {
        inputErrors.push(" - lockId missing or not of type 'string'");
    }
    if (!lockOwner || typeof lockOwner !== "string") {
        inputErrors.push(" - lockOwner missing or not of type 'string'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "removeLock"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);

try {
    checkParams(lockId, lockOwner);
    log.log("Removing lock on '" + lockId + "' for '" + lockOwner + "'");
    LockingSystem.unlock(lockId,lockOwner);
    log.log("Lock removed for '" + lockId + "'");
} catch (e) {
    log.error("Action failed to remove lock.",e);
}