/**
 * Defines the VaHostRestClient object.
 * @class
 * @param {REST:RESTHost} vraHost - The HTTP REST host.
 * @returns {*} Returns an instance of the VaHostRestClient object.
 */

function VaHostRestClient(vraHost) {
    this.vraHost = vraHost;

    /**
     * Defines the GET method.
     * @method
     * @param {string} restUri - The request uri.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @returns {*} The request response object.
     */

    this.get = function (restUri, expectedResponseCodes) {
        var reqResponse;

        reqResponse = this._executeRequest("GET", restUri, null,
                                           expectedResponseCodes);

        return reqResponse;
    };

    /**
     * Defines the POST method.
     * @method
     * @param {string} restUri - The request uri.
     * @param {string} [content] - The request content.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @returns {*} The request response object.
     */

    this.post = function (restUri, content,
                          expectedResponseCodes) {
        if (!content) {
            content = "{}";
        }
        reqResponse = this._executeRequest("POST", restUri, content,
                                           expectedResponseCodes);

        return reqResponse;
    };

    /**
     * Defines the PUT method.
     * @method
     * @param {string} restUri - The request uri.
     * @param {string} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * @returns {*} The request response object.
     */

    this.put = function (restUri, content, contentType,
                         expectedResponseCodes, headers) {
        reqResponse = this._executeRequest("PUT", restUri, content,
                                           contentType, expectedResponseCodes,
                                           headers);

        return reqResponse;
    };

    /**
     * Defines the DELETE method.
     * @method
     * @param {string} restUri - The request uri.
     * @param {string} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * @returns {*} The request response object.
     */

    this.delete = function (restUri, content, contentType,
                            expectedResponseCodes, headers) {
        reqResponse = this._executeRequest("DELETE", restUri, content,
                                           contentType, expectedResponseCodes,
                                           headers);

        return reqResponse;
    };

    /**
     * Defines the PATCH method.
     * @method
     * @param {string} restUri - The request uri.
     * @param {string} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * @returns {*} The request response object.
     */

    this.patch = function (restUri, content, contentType,
                           expectedResponseCodes, headers) {
        reqResponse = this._executeRequest("PATCH", restUri, content,
                                           contentType, expectedResponseCodes,
                                           headers);

        return reqResponse;
    };

    /**
     * A private method that executes the request.
     * @method
     * @private
     * @param {string} restMethod - The request method.
     * @param {string} restUri - The request uri.
     * @param {string} content - The request content.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @returns {*} The request response object.
     */

        this._executeRequest = function (restMethod, restUri, content,
                                     expectedResponseCodes) {
        var response;
        var maxAttempts = 3;
        var timeout = 5;
        var success = false;
        var statusCode;

        // Default to status code '200' if no expected codes have been defined.
        if (!expectedResponseCodes ||
            (Array.isArray(expectedResponseCodes) &&
            expectedResponseCodes.length < 1)) {
            expectedResponseCodes = [200];
        }

        System.debug("Executing request...");
        System.debug("Method: " + restMethod);
        System.debug("URI: " + restUri);

        this._createRequest(restMethod, restUri, content);

        for (var i = 0; i < maxAttempts; i++) {
            try {
                response = this.vraRestClient.execute(this.request);
                success = true;
                break;
            } catch (e) {
                System.sleep(timeout * 1000);
                System.warn("Request failed: " + e + " retrying...");
                continue;
            }
        }

        if (!success) {
            throw("Request failed after " + maxAttempts.toString() +
                      " attempts. Aborting.");
        }

        statusCode = response.statusCode;
        if (expectedResponseCodes.indexOf(statusCode) > -1) {
            System.debug("Request executed successfully with status: " +
                      statusCode);
        } else {
            throw("Request failed, incorrect response code received: '" +
                      statusCode + "' expected one of: '" +
                      expectedResponseCodes.join(",") +
                      "'\n" + response.contentAsString);
        }

        var responseContent = JSON.parse(response.contentAsString);

        // Check if we have a collection
        if (responseContent.totalElements) {
            var totalItems = responseContent.totalElements;
            var elements = responseContent.content;
            var numElements = responseContent.numberOfElements;
             System.debug("Found " + numElements + " of " + totalItems + " Elements")

            if (numElements > 0 && numElements < totalItems) {
                // Get additional pages
                do {
                    System.debug("Getting additional Elements");
                    var uriParam1 = "$skip=" + numElements;
                    var restUri = restUri + "&" + uriParam1
        
                    this._createRequest(restMethod, restUri, content);

                    for (var i = 0; i < maxAttempts; i++) {
                        try {
                            response = this.vraRestClient.execute(this.request);
                            success = true;
                            break;
                        } catch (e) {
                            System.sleep(timeout * 1000);
                            System.warn("Request failed: " + e + " retrying...");
                            continue;
                        }
                    }

                    if (!success) {
                        throw("Request failed after " + maxAttempts.toString +
                                    " attempts. Aborting.");
                    }

                    var statusCode = response.statusCode;
                    if (expectedResponseCodes.indexOf(statusCode) > -1) {
                        System.debug("Request executed successfully with status: " +
                                    statusCode);
                    } else {
                        throw("Request failed, incorrect response code received: '" +
                                    statusCode + "' expected one of: '" +
                                    expectedResponseCodes.join(",") +
                                    "'\n" + response.contentAsString);
                    }

                    var responseContent = JSON.parse(response.contentAsString);
                    elements = elements.concat(responseContent.content);
                    System.debug("Found " + elements.length + " of " + totalItems + " Elements")
                    numElements += numElements;
                } while (elements.length < totalItems)
            }
            var responseContent = elements;
        }
        return responseContent;
    };

    /**
     * A private method that creates the request.
     * @method
     * @private
     * @param {string} restMethod - The request method.
     * @param {string} restUri - The request uri.
     * @param {string} content - The request content.
      */

    this._createRequest = function (restMethod, restUri, content) {
        var uri = encodeURI(restUri);
        this.vraRestClient = this.vraHost.createRestClient();

        System.debug("Creating REST request...");
        if (restMethod === "GET" || !content) {
            this.request = this.vraRestClient.createRequest(restMethod, uri);
        } else {
            this.request = this.vraRestClient.createRequest(restMethod, uri, content);
        }
    };
}

return VaHostRestClient;
