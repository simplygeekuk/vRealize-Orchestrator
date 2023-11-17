/**
 * Defines the ResourceElementService class.
 * @class
 * 
 * @returns {Any} An instance of the ResourceElementService class.
 */

function ResourceElementService() {

    var logType = "Action";
    var logName = "ResourceElementService";
    this.logger = new (System.getModule("com.simplygeek.logger").loggerService())(logType,
                                                                                  logName);

    /**
     * Defines the getResourceElement method.
     * @method
     * @public
     * @param {string} resourceName - Resource Element Name.
     * @param {string} resourcePath - Resource Element Path.
     * 
     * @returns {ResourceElement} The Resource Element object
     */

    this.getResourceElement = function (resourceName,
                                        resourcePath) {
        if (!resourceName || typeof resourceName !== "string") {
            throw new ReferenceError("resourceName is required and must be of type 'string'");
        }
        if (!resourcePath || typeof resourcePath !== "string") {
            throw new ReferenceError("resourcePath is required and must be of type 'string'");
        }

        var resourceElementCategory;
        var resourceElement;
        var resourceElements;
        var resourceElementsFound;

        this.logger.debug("Get Resource Element '" + resourceName +
                          "' in path '" + resourcePath);
        this.logger.debug("Getting Resource Element Category in path: " + resourcePath);
        resourceElementCategory = Server.getResourceElementCategoryWithPath(resourcePath);
        if (resourceElementCategory) {
            this.logger.debug("Get all Resource Elements in category: " + resourcePath);
            resourceElements = resourceElementCategory.allResourceElements;
        } else {
            throw new Error("Resource Element category not found in path: '" + resourcePath + "'");
        }

        resourceElementsFound = resourceElements.filter(
            function(resourceElement) {
                return resourceElement.name === resourceName;
            }
        );

        if (resourceElementsFound.length > 1) {
            throw new Error("More than one Resource Element was found with the name '" +
                            resourceName + "'");
        } else if (resourceElementsFound.length > 0) {
            resourceElement = resourceElementsFound[0];
        } else {
            throw new Error("No Resource Element found with the name '" +
                            resourceName + "'");
        }

        this.logger.debug("Found Resource Element '" + resourceElement.name + "'");

        return resourceElement;
    }

    /**
     * Defines the getResourceElementContent method.
     * @method
     * @public
     * @param {ResourceElement} resourceElement - Resource Element Object.
     * 
     * @returns {Any} The Resource Element content
     */
    this.getResourceElementContent = function (resourceElement) {
        if (!resourceElement || System.getObjectType(resourceElement) !== "ResourceElement") {
            throw new ReferenceError("resourceElement is required and must be of type 'ResourceElement'");
        }

        var resourceContent;
        var resourceMimeAttachment;
        var resourceContentType;

        this.logger.debug("Getting content for Resource Element '" + resourceElement.name + "'");
        resourceMimeAttachment = resourceElement.getContentAsMimeAttachment();
        resourceContentType = resourceMimeAttachment.mimeType;
        this.logger.debug("Found content with mime type '" + resourceContentType + "'");
        if (resourceContentType === 'application/json') {
            resourceContent = JSON.parse(resourceMimeAttachment.content);
        } else {
            resourceContent = resourceMimeAttachment.content;
        }
        
        return resourceContent;
    }
}

return ResourceElementService;
