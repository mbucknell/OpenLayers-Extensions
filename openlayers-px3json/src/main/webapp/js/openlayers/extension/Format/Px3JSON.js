/**
 * @requires OpenLayers/Format/Px3JSON/v17.js
 * @requires OpenLayers/Format/Px3JSON/Service.js
 */

/**
 * Class: OpenLayers.Format.Px3JSON
 * 
 * NGA Palanterra x3 and USGS The National Map Viewer Configuration
 * 
 */
OpenLayers.Format.Px3JSON = OpenLayers.Class(OpenLayers.Format.JSON, {
    
   /**
     * APIMethod: read
     * Deserialize a OpenLayers.Format.Px3JSON string.
     *
     * Parameters:
     * json - {String} A PxOpenLayers.Format.Px3JSON3JSON string
     *
     * Returns: 
     * {OpenLayers.Format.Px3JSON.v1} Null is returned if the serialized Px3JSON is invalid
     */
    read: function(json) {
        return OpenLayers.Format.Px3JSON.v17.prototype.read.apply(this, [json]);
    },
    
    /**
     * Method: isValidType
     * Check if an object is a valid representative of the given type.
     * 
     * Parameters:
     * obj - {Object} An initialized object of this type
     * 
     * Returns:
     * {Boolean} The object is valid object of the given type.
     */
    isValidType : function(obj) {
        return true;
    },

    CLASS_NAME: "OpenLayers.Format.Px3JSON"
});     
