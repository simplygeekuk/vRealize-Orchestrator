/**
 * Defines the ConfigElementService class.
 * @class
 * 
 * @returns {Any} An instance of the ConfigElementService class.
 */

function ConfigElementService() {

    var logType = "Action";
    var logName = "ConfigElementService";
    this.logger = new (System.getModule("com.vattenfall.library.logger.utils").loggerService())(logType,
                                                                                                logName);

    /**
     * Defines the getConfigElement method.
     * @method
     * @public
     * @param {string} configElementName - Configuration Element Name.
     * @param {string} categoryPath - Configuration Element Path.
     * 
     * @returns {ConfigurationElement} Configuration Element object.
     */

    this.getConfigElement = function (configElementName,
                                      categoryPath) {
        if (!configElementName || typeof configElementName !== "string") {
            throw new ReferenceError("configElementName is required and must be of type 'string'");
        }
        if (!categoryPath || typeof categoryPath !== "string") {
            throw new ReferenceError("categoryPath is required and must be of type 'string'");
        }

        var configElementCategory;
        var configElement;
        var configElements;
        var configElementsFound;

        this.logger.debug("Get Configuration Element '" + configElementName +
                          "' in path '" + categoryPath);
        this.logger.debug("Getting Configuration Element Category in path: " + categoryPath);
        configElementCategory = Server.getConfigurationElementCategoryWithPath(categoryPath);

        this.logger.debug("Get all Configuration Elements in category: " + categoryPath);
        configElements = configElementCategory.allConfigurationElements;

        configElementsFound = configElements.filter(
            function(configElement) {
                return configElement.name === configElementName;
            }
        );

        if (configElementsFound.length > 1) {
            throw new Error("More than one Configuration Element was found with the name '" +
                            configElementName + "'");
        } else if (configElementsFound.length > 0) {
            configElement = configElementsFound[0];
        } else {
            throw new Error("No Configuration Element found with the name '" +
                            configElementName + "'");
        }

        this.logger.debug("Found Configuration Element '" + configElement.name + "'");

        return configElement;
    }

    /**
     * Defines the createConfigElement method.
     * @method
     * @public
     * @param {string} configElementName - Configuration Element Name.
     * @param {string} categoryPath - Configuration Element Path.
     * 
     * @returns {ConfigurationElement} Configuration Elemenet object.
     */

    this.createConfigElement = function(configElementName,
                                        categoryPath) {
        if (!configElementName || typeof configElementName !== "string") {
            throw new ReferenceError("configElementName is required and must be of type 'string'");
        }
        if (!categoryPath || typeof categoryPath !== "string") {
            throw new ReferenceError("categoryPath is required and must be of type 'string'");
        }

        var configElement;

        this.logger.debug("Creating Configuration Element '" + configElementName +
                          "' in path '" + categoryPath + "'");
        try {
            configElement = Server.createConfigurationElement(categoryPath,
                                                              configElementName);

            this.logger.debug("Successfully created Configuration Element '" +
                            configElement.name + "'");
        } catch (e) {
            throw new Error("Failed to create Configuration Element: " + e);
        }

        return configElement;
    }

    /**
     * Defines the getConfigElementAttribute method.
     * @method
     * @public
     * @param {ConfigurationElement} configElement - Configuration Element Object.
     * @param {string} attributeName - Configuration Element Attribute Name.
     * 
     * @returns {Any} Configuration Elemenet Attribute.
     */

    this.getConfigElementAttribute = function (configElement,
                                               attributeName) {
        if (!configElement || System.getObjectType(configElement) !== "ConfigurationElement") {
            throw new ReferenceError("configElement is required and must be of type 'ConfigurationElement'");
        }
        if (!attributeName || typeof attributeName !== "string") {
            throw new ReferenceError("attributeName is required and must be of type 'string'");
        }

        var attribute;
        var attributes;
        var attributesFound;
        var attributeName;
        var attributeValue;
        var attributeType;

        this.logger.debug("Get Configuration Elemenet Attribute '" + attributeName + "'");
        attributes = configElement.attributes;
        attributesFound = attributes.filter(
            function(attribute) {
                return attribute.name === attributeName;
            }
        );

        if (attributesFound.length > 1) {
            throw new Error("More than one Configuration Element was found with the name '" +
                            attributeName + "'");
        } else if (attributesFound.length > 0) {
            attribute = attributesFound[0];
        } else {
            throw new Error("No Configuration Element found with the name '" +
                            attributeName + "'");
        }

        attributeName = attribute.name;
        attributeValue = attribute.value;
        attributeType = attribute.type;
        if (attribute.type === 'SecureString') attributeValue = '******'
        this.logger.debug("Found Configuration Element Attribute '" + attributeName +
                          "' with value '" + attributeValue + "'");

        return attribute;
    }

    /**
     * Defines the createConfigElementAttribute method.
     * @method
     * @public
     * @param {ConfigurationElement} configElement - Configuration Element Object.
     * @param {string} attributeName - Configuration Element Attribute Name.
     * @param {string} attributeValue - Configuration Element Attribute Value.
     * @param {string} attributeType - Configuration Element Attribute Type.
     * 
     * @returns {Any} Configuration Elemenet Attribute.
     */

    this.createConfigElementAttribute = function(configElement,
                                                 attributeName,
                                                 attributeValue,
                                                 attributeType) {
        if (!configElement || System.getObjectType(configElement) !== "ConfigurationElement") {
            throw new ReferenceError("configElement is required and must be of type 'ConfigurationElement'");
        }
        if (!attributeName || typeof attributeName !== "string") {
            throw new ReferenceError("attributeName is required and must be of type 'string'");
        }
        if (!attributeValue || typeof attributeValue !== "string") {
            throw new ReferenceError("attributeValue is required and must be of type 'string'");
        }
        if (!attributeType || typeof attributeType !== "string") {
            throw new ReferenceError("attributeType is required and must be of type 'string'");
        }

        var attribute;
        var existingAttribute;

        this.logger.debug("Creating Configuration Element Attribute '" + attributeName +
                          "' in Configuration Element '" + configElement.name + "'");
        
        try {
            existingAttribute = this.getConfigElementAttribute(configElement, attributeName);
        } catch (e) {
            // Catch if attribute not found - This comment is needed.
        }

        if (existingAttribute) {
            throw new Error("An existing attribute was found with the name '" + attributeName + "'");
        }

        try {
            configElement.setAttributeWithKey(attributeName, attributeValue, attributeType);
        } catch (e) {
            throw new Error("Failed to create Configuration Element Attribute: " + e);
        }

        attribute = this.getConfigElementAttribute(configElement, attributeName);
        this.logger.debug("Successfully created Configuration Element Attribute '" + attribute.name + "'");

        return attribute;
    }

    /**
     * Defines the updateConfigElementAttribute method.
     * @method
     * @public
     * @param {ConfigurationElement} configElement - Configuration Element Object.
     * @param {string} attributeName - Configuration Element Attribute Name.
     * @param {string} attributeValue - Configuration Element Attribute Value.
     * @param {string} [attributeType] - Configuration Element Attribute Type.
     * 
     * @returns {Any} Configuration Elemenet Attribute.
     */

    this.updateConfigElementAttribute = function(configElement,
                                                 attributeName,
                                                 attributeValue,
                                                 attributeType) {
        if (!configElement || System.getObjectType(configElement) !== "ConfigurationElement") {
            throw new ReferenceError("configElement is required and must be of type 'ConfigurationElement'");
        }
        if (!attributeName || typeof attributeName !== "string") {
            throw new ReferenceError("attributeName is required and must be of type 'string'");
        }
        if (!attributeValue || typeof attributeValue !== "string") {
            throw new ReferenceError("attributeValue is required and must be of type 'string'");
        }
        if (attributeType && typeof attributeType !== "string") {
            throw new ReferenceError("attributeType must be of type 'string'");
        }

        var attribute;
        var existingAttribute;

        this.logger.debug("Updating Configuration Element Attribute '" + attributeName +
                          "' in Configuration Element '" + configElement.name + "' with " +
                          "value '" + attributeValue + "'");
        
        try {
            existingAttribute = this.getConfigElementAttribute(configElement, attributeName);
        } catch (e) {
            // Catch if attribute not found - This comment is needed.
        }

        if (!existingAttribute) {
            throw new Error("No attribute found with the name '" + attributeName + "'");
        }

        try {
            if (attributeType) {
                configElement.setAttributeWithKey(attributeName, attributeValue, attributeType);
            } else {
                configElement.setAttributeWithKey(attributeName, attributeValue);
            }
        } catch (e) {
            throw new Error("Failed to update Configuration Element Attribute: " + e);
        }

        attribute = this.getConfigElementAttribute(configElement, attributeName);
        this.logger.debug("Successfully updated Configuration Element Attribute '" + attribute.name + "'");

        return attribute;
    }

    /**
     * Defines the removeConfigElementAttribute method.
     * @method
     * @public
     * @param {ConfigurationElement} configElement - Configuration Element Object.
     * @param {string} attributeName - Configuration Element Attribute Name.
     * 
     * @returns {void}
     */

    this.removeConfigElementAttribute = function(configElement,
                                                 attributeName) {
        if (!configElement || System.getObjectType(configElement) !== "ConfigurationElement") {
            throw new ReferenceError("configElement is required and must be of type 'ConfigurationElement'");
        }
        if (!attributeName || typeof attributeName !== "string") {
            throw new ReferenceError("attributeName is required and must be of type 'string'");
        }

        this.logger.debug("Removing Configuration Element Attribute '" + attributeName + "'");

        try {
            configElement.removeAttributeWithKey(attributeName);
        } catch (e) {
            throw new Error("Failed to remove Configuration Element Attribute: " + e);
        }

        this.logger.debug("Successfully removed Configuration Element Attribute '" + attributeName + "'");
    }
}

return ConfigElementService;