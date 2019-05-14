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

    this.get = function (restUri, expectedResponseCodes, headers) {
        System.log("[" + this.type + ": " + this.name + "] " + logMsg);
    };
    this.post = function (restUri, contentType, content, expectedResponseCodes, headers) {
        System.warn("[" + this.type + ": " + this.name + "] " + warnMsg);
    };
    this.put = function (restUri, contentType, content, expectedResponseCodes, headers) {
        System.warn("[" + this.type + ": " + this.name + "] " + warnMsg);
    };
    this.delete = function (restUri, contentType, content, expectedResponseCodes, headers) {
        System.warn("[" + this.type + ": " + this.name + "] " + warnMsg);
    };
    this.patch = function (restUri, contentType, content, expectedResponseCodes, headers) {
        System.warn("[" + this.type + ": " + this.name + "] " + warnMsg);
    };

    function _executeRequest(restHost, restUri, restMethod, acceptType,
                             contentType, content, expectedResponseCodes, headers) {
        if ((restMethod === "PUT" || 
             restMethod === "POST" || 
             restMethod === "DELETE" ||
             restMethod === "PATCH") && 
             !contentType) {
             contentType = "application/json";
        }
    }

}



function checkParams(resthost, restmethod, resturi) {
    if (!resthost) {
    	throw "The REST host must be provided.";
    }
    if (!restmethod) {
    	throw "The REST method must be provided.";
    }
    if (!resturi) {
    	throw "The REST URI must be provided.";
    }
}


var request = ""; //REST request object
var response = ""; //REST API request result
var responseContent = "";
var defaultAcceptType = "application/json";
var defaultContentType = "application/json";
var requestUrl = "";
var statusCode;

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

	if (headers) {
	    for each (var headerKey in headers.keys) {
	        headerValue = headers.get(headerKey);
	        logFunction(logElementType,logElementName,"debug","REST Header: " + headerKey + ":" + headerValue);
	        request.setHeader(headerKey, headerValue);
	    }
	}

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
