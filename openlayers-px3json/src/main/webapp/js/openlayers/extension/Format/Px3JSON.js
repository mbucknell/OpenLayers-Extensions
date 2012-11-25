/**
 * Class: OpenLayers.Format.Px3JSON
 * 
 * NGA Palanterra x3 and USGS The National Map Viewer Configuration
 * 
 */
OpenLayers.Format.Px3JSON = OpenLayers.Class(OpenLayers.Format.JSON, {
    
    read: function(json, filter) {
        var obj = null;
        var requiredStringNode = 'defaultToolGroup';
        
        if (typeof json == "string") {
            obj = OpenLayers.Format.JSON.prototype.read.apply(this, [json, filter]);
        } else { 
            obj = json;
        }  
        
        if(!obj) {
            OpenLayers.Console.error("Bad JSON: " + json);
        } else if(typeof(obj[requiredStringNode]) != "string") {
            OpenLayers.Console.error("Bad Px3JSON - no "+requiredStringNode+": " + json);
        } else {
            for (key in obj) {
                
            }
        }
        return obj;
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
