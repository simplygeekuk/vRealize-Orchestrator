/*
Purpose:
This action is used to provide consistent logging output for the calling actions/workflows.
This allows greater visibility into what code is executing and where, which makes troubleshooting easier.
 
Parameters:
– logType (string)
– logName (string)
– logLevel (string)
– logMessage (Any)
 
Return Type : void
*/

switch(logLevel) {
    case "log":
        System.log("[" + logType + ": " + logName + "]: " + logMessage);
        break;
    case "debug":
        System.debug("[" + logType + ": " + logName + "]: " + logMessage);
        break;
    case "error":
        System.error("[" + logType + ": " + logName + "]: " + logMessage);
        break;
    case "warn":
        System.warn("[" + logType + ": " + logName + "]: " + logMessage);
        break;
    default:
        System.log("[" + logType + ": " + logName + "]: " + logMessage);
}
