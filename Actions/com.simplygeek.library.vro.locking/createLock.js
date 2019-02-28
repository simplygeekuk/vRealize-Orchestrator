/*global lockId lockOwner*/

/**
 * Creates a process lock using the vRO Locking System.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function findVcVmByInstanceUuid
 * @param {string} lockId - What to lock.
 * @param {string} lockOwner - Who is creating the lock.
 * @returns {boolean} Returns true if the lock is created, otherwise returns false.
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
var logName = "createLock"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var lockCreated;

try {
    checkParams(lockId, lockOwner);
    log.log("Creating lock on '" + lockId + "' for '" + lockOwner + "'");
    lockCreated = LockingSystem.lock(lockId,lockOwner);
    if (lockCreated) {
        log.log("Lock created for '" + lockOwner + "'");
    } else {
        log.log("Exisiting lock found for '" + lockOwner + "'");
    }
} catch (e) {
    log.error("Action failed to create lock.",e);
}

return lockCreated;