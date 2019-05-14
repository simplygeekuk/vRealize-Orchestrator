/*global restHost, restMethod, restUri, acceptType, contentType, content, expectedResponseCodes, headers*/

/**
 * Updates the reserved storage capacity for the storage path in the reservation.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @class
 * @function httpRestClient
 * @param {REST:RESTHost} restHost - The HTTP REST host.
 * @param {string} restMethod - The request method.
 * @param {string} restUri - The request uri.
 * @param {string} [acceptType] - The encoding to accept.
 * @param {string} [contentType] - The encoding for content.
 * @param {string} [content] - The request content.
 * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
 * @param {Properties} [headers] - A key/value set of headers to include in the request.
 * @returns {*} The HttpClient object.
 */

var logType = "Action";
var logName = "httpRestClient"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var request = ""; //REST request object
var response = ""; //REST API request response
var responseContent = "";
var requestUrl = "";
var statusCode;

function HttpClient(restHost, acceptType) {
    this.restHost = restHost;

    if (acceptType) {
        this.acceptType = acceptType;
    } else {
        this.acceptType = "application/json";
    }

    this.get = function (restUri, headers, expectedResponseCodes) {
        response = _executeRequest(this.restHost, "GET", restUri, headers, expectedResponseCodes);
    };
    this.post = function (restUri, contentType, content, expectedResponseCodes, headers) {
        response = _executeRequest();
    };
    this.put = function (restUri, contentType, content, expectedResponseCodes, headers) {
        response = _executeRequest();
    };
    this.delete = function (restUri, contentType, content, expectedResponseCodes, headers) {
        response = _executeRequest();
    };
    this.patch = function (restUri, contentType, content, expectedResponseCodes, headers) {
        response = _executeRequest();
    };

    function _executeRequest(restUri, restMethod, contentType,
                             content, headers, expectedResponseCodes) {
        log.log("Creating REST request...");

        if (restMethod === "GET") {
            this.request = this.restHost.createRequest(restMethod, restUri);
        } else {
            this.request = this.restHost.createRequest(restMethod, restUri, content);
            if (!contentType) {
                contentType = this.acceptType;
            }
            this.request.contentType = contentType;
        }

        this.request.setHeader("Accept", this.acceptType);



    }

    function _setHeaders() {
        for (var headerKey in headers.keys) {
            var headerValue = headers.get(headerKey);
            // eslint-disable-next-line padding-line-between-statements
            log.debug("Adding Header: " + headerKey + ": " + headerValue);
            this.request.setHeader(headerKey, headerValue);
        }
    }

}

return HttpClient;

try {
    checkParams(restHost, restMethod, restUri);
    logFunction(logElementType,logElementName,"debug","Creating REST request...");
    restMethod = restMethod.toUpperCase();
    logFunction(logElementType,logElementName,"debug","REST Method: " + restMethod);
    if (restMethod === "PUT" || restMethod === "POST" || restMethod === "DELETE") {
        if (!content) {
            request = restHost.createRequest(restMethod, restUri);
        } else {
            request = restHost.createRequest(restMethod, restUri, content);
            if (!contentType) {
                contentType = defaultContentType;
            }
            request.contentType = contentType;
            logFunction(logElementType,logElementName,"debug","REST Content-Type: " + contentType);
            logFunction(logElementType,logElementName,"debug","REST Content: " + content);
        }
    } else {
        request = restHost.createRequest(restMethod, restUri);
    }

    //Build up the Session Header information
    if (!acceptType) {
        acceptType = defaultAcceptType;
    }
    request.setHeader("Accept", acceptType);
    logFunction(logElementType,logElementName,"debug","REST Accept: " + acceptType);

    requestUrl = request.fullUrl;
    logFunction(logElementType,logElementName,"debug","REST URL: " + requestUrl);

    // Execute REST call
    logFunction(logElementType,logElementName,"debug","Executing '" + restMethod + "' on " + requestUrl);
    response = request.execute();
    statusCode = response.statusCode;
    responseContent = response.contentAsString;

    // for debug only - can be noisy.
    //logFunction(logElementType,logElementName,"debug","Request response: " + responseContent);

    // Check response status code
    if (!expectedResponseCode) {
        expectedResponseCode = 200;
    }
    if (statusCode === expectedResponseCode) {
        logFunction(logElementType,logElementName,"debug","REST request executed successfully with status: " + statusCode);
    } else {
        throw "Incorrect response code received from REST host: '" + statusCode + "' expected: '" + expectedResponseCode + "'\n" + responseContent;
    }
} catch (e) {
    throw "Executing REST request failed. " + e;
}

return responseContent;
