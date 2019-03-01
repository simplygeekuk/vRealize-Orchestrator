/*global arrayOfItems*/

/**
 * Accepts an array of any data type and returns an array with any duplicates removed.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getUniqueArray
 * @param {Any[]} arrayOfItems - An array of any data types.
 * @returns {Any[]} Returns the array with unique items.
 */

function checkParams(arrayOfItems) {
    var inputErrors = [];
    var errorMessage;
    if (!arrayOfItems || !Array.isArray(arrayOfItems)) {
        inputErrors.push(" - arrayOfItems missing or not of type 'Array'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}
var logType = "Action";
var logName = "getUniqueArray"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var seen = {};
var uniqueArray = [];

try {
    checkParams(arrayOfItems);
    log.debug("Constructing unique array of items.");
    uniqueArray = arrayOfItems.filter(function(item) { return seen.hasOwnProperty(item) ? false : (seen[item] = true); });
} catch (e) {
    log.error("Action failed to construct unique array of items. ",e);
}

return uniqueArray;