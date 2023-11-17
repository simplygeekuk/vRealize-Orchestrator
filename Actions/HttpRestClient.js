/**
 * Defines the HttpRestClient class.
 * @class
 * @param {REST:RESTHost} restHost - The HTTP REST host.
 * 
 * @returns {Any} An instance of the HttpRestClient class.
 */

function HttpRestClient(restHost) {
    if (!restHost || System.getObjectType(restHost) !== "REST:RESTHost") {
        throw "restHost is required and must be of type 'REST:RESTHost'";
    }

    this.restHost = restHost;

    /**
     * Defines the GET method.
     * @method
     * @public
     * @param {string} uri - The request uri.
     * @param {string} [acceptType] - The encoding format to accept.
     * @param {Array/number} [expectedResponseCodes] - A list of expected response codes.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * 
     * @returns {Any} The request response object.
     */

    this.get = function (uri,
                         acceptType,
                         expectedResponseCodes,
                         headers) {
        var response = invokeRequest("GET",
                                     uri,
                                     acceptType,
                                     null,
                                     null,
                                     expectedResponseCodes,
                                     headers);

        return response;
    }

    /**
     * Defines the POST method.
     * @method
     * @public
     * @param {string} uri - The request uri.
     * @param {string} [acceptType] - The encoding format to accept.
     * @param {Any} [content] - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {Array/number} [expectedResponseCodes] - A list of expected response codes.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * 
     * @returns {Any} The request response object.
     */

    this.post = function (uri,
                          acceptType,
                          content,
                          contentType,
                          expectedResponseCodes,
                          headers) {
        if (!content) {
            content = {};
        }
        var response = invokeRequest("POST",
                                     uri,
                                     acceptType,
                                     content,
                                     contentType,
                                     expectedResponseCodes,
                                     headers);

        return response;
    }

    /**
     * Defines the PUT method.
     * @method
     * @public
     * @param {string} uri - The request uri.
     * @param {string} [acceptType] - The encoding format to accept.
     * @param {Any} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {Array/number} [expectedResponseCodes] - A list of expected response codes.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * 
     * @returns {Any} The request response object.
     */

    this.put = function (uri,
                         acceptType,
                         content,
                         contentType,
                         expectedResponseCodes,
                         headers) {
        var response = invokeRequest("PUT",
                                     uri,
                                     acceptType,
                                     content,
                                     contentType,
                                     expectedResponseCodes,
                                     headers);

        return response;
    }

    /**
     * Defines the PATCH method.
     * @method
     * @public
     * @param {string} uri - The request uri.
     * @param {string} [acceptType] - The encoding format to accept.
     * @param {Any} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {Array/number} [expectedResponseCodes] - A list of expected response codes.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * 
     * @returns {Any} The request response object.
     */

    this.patch = function (uri,
                           acceptType,
                           content,
                           contentType,
                           expectedResponseCodes,
                           headers) {
        var response = invokeRequest("PATCH",
                                     uri,
                                     acceptType,
                                     content,
                                     contentType,
                                     expectedResponseCodes,
                                     headers);

        return response;
    }

    /**
     * Defines the DELETE method.
     * @method
     * @public
     * @param {string} uri - The request uri.
     * @param {string} [acceptType] - The encoding format to accept.
     * @param {Array/number} [expectedResponseCodes] - A list of expected response codes.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * 
     * @returns {Any} The request response object.
     */

    this.delete = function (uri,
                            acceptType,
                            expectedResponseCodes,
                            headers) {
        var response = invokeRequest("DELETE",
                                     uri,
                                     acceptType,
                                     null,
                                     null,
                                     expectedResponseCodes,
                                     headers);

        return response;
    }

    /**
     * A private method that invokes the request.
     * @method
     * @private
     * @param {string} restMethod - The request method.
     * @param {string} uri - The request uri.
     * @param {string} [acceptType] - The encoding format to accept.
     * @param {Any} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {Array/number} [expectedResponseCodes] - A list of expected response codes.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * 
     * @returns {Any} The request response object.
     */

    var invokeRequest = function (restMethod,
                                  uri,
                                  acceptType,
                                  content,
                                  contentType,
                                  expectedResponseCodes,
                                  headers) {

        var uriRegex = /^[-a-zA-Z0-9()@:%_$,.~#?&\+\/\/=\s]*$/i;
        var validMediaTypes = [
            "application/json",
            "application/xml"
        ];

        if (!uri || typeof uri !== "string") {
            throw new ReferenceError("uri is required and must be of type 'string'");
        } else if (uri && !uri.match(uriRegex)) {
            throw new ReferenceError("uri not a valid URI");
        }
        if (acceptType && typeof acceptType !== "string") {
            throw new TypeError("acceptType must be of type 'string'");
        } else if (acceptType && validMediaTypes.indexOf(acceptType.toLowerCase()) < 0) {
            throw new ReferenceError("Invalid media type '" + acceptType + "'." + 
            " Supported media types: " + validMediaTypes.join(', '));
        }
        if (content && typeof content !== "object") {
            throw new TypeError("content must be of type 'object'");
        }
        if (contentType && typeof contentType !== "string") {
            throw new TypeError("contentType must be of type 'string'");
        }
        if (expectedResponseCodes && !Array.isArray(expectedResponseCodes)) {
            throw new TypeError("expectedResponseCodes must be of type 'Array/number'");
        } else if (expectedResponseCodes && expectedResponseCodes.length > 0) {
            expectedResponseCodes.forEach(
                function(code) {
                    if (typeof code !== 'string') {
                        throw new TypeError("expectedResponseCodes must be of type 'Array/number'");
                    }
                }
            );
        }
        if (headers && typeof headers !== "Properties") {
            throw new TypeError("headers must be of type 'Properties'");
        }

        var response;
        var maxAttempts = 5;
        var timeout = 10;
        var success = false;
        var statusCode;

        // Default to status code '200' if no expected status codes have been defined.
        if (!expectedResponseCodes ||
            (Array.isArray(expectedResponseCodes) &&
            expectedResponseCodes.length < 1)) {
            expectedResponseCodes = [200];
        }

        createRequest(restMethod,
                      uri,
                      acceptType,
                      content,
                      contentType,
                      headers);

        System.debug("Invoking request...");
        System.debug("URL: " + this.request.fullUrl);
        System.debug("Method: " + restMethod);
        if (content) {
            var regex = new RegExp('(password|secret/i)', 'i');
            var contentString = JSON.stringify(content);
            if (contentString.match(regex)) {
                content['password'] = "*****";
                content['secret'] = "*****";
                contentString = JSON.stringify(content);
            }
            System.debug("Content: " + contentString);
        }

        for (var i = 0; i < maxAttempts; i++) {
            try {
                response = this.request.execute();
                success = true;
                break;
            } catch (e) {
                System.sleep(timeout * 1000);
                System.warn("Request failed: " + e + " retrying...");
                continue;
            }
        }

        if (!success) {
            throw "Request failed after " + maxAttempts.toString() +
                  " attempts. Aborting.";
        }

        statusCode = response.statusCode;
        if (expectedResponseCodes.indexOf(statusCode) > -1) {
            System.debug("Request completed successfully with status: " +
                         statusCode);
        } else {
            throw "Request failed, incorrect response code received: '" +
                  statusCode + "' expected one of: '" +
                  expectedResponseCodes.join(",") +
                  "'\n" + response.contentAsString;
        }

        return response;
    }

    /**
     * A private method that creates the request.
     * @method
     * @private
     * @param {string} restMethod - The request method.
     * @param {string} uri - The request uri.
     * @param {string} [acceptType] - The encoding format to accept.
     * @param {Any} [content] - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * 
     * @returns {Any} The request response object.
     */

    var createRequest = function (restMethod,
                                  uri,
                                  acceptType,
                                  content,
                                  contentType,
                                  headers) {
        if (uri.indexOf('%') > -1) {
            System.log("Possible encoding detected in URI, encoder will not be used.");
        } else {
            var uri = encodeURI(uri);
        }

        this.acceptType = acceptType || "application/json"

        System.debug("Creating REST request...");
        if (!content ) {
            this.request = this.restHost.createRequest(restMethod,
                                                       uri);
            this.request.contentType = this.acceptType;
        } else {
            this.request = this.restHost.createRequest(restMethod,
                                                       uri,
                                                       JSON.stringify(content));
            this.request.contentType = contentType || this.acceptType;
        }

        System.debug("Setting headers...");
        setHeaders(headers);
    }

    /**
     * A private method that sets the request headers.
     * @method
     * @private
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     */

    var setHeaders = function (headers) {
        System.debug("Adding Header: Accept: " + this.acceptType);
        this.request.setHeader("Accept", this.acceptType);
        if (headers && (headers instanceof Properties)) {
            headers.keys.forEach(
                function (headerKey) {
                    var headerValue = headers.get(headerKey);
                    System.debug("Adding Header: " + headerKey + ": " + headerValue);
                    this.request.setHeader(headerKey, headerValue);
                }

            );
        }
    }
}

return HttpRestClient;
