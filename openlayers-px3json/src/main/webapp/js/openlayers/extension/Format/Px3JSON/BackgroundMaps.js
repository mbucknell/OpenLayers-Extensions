OpenLayers.Format.Px3JSON.BackgroundMaps = OpenLayers.Class(OpenLayers.Format.Px3JSON, {
    
    /**
    * Class: OpenLayers.Format.Px3JSON.BackgroundMaps
    * 
    * @requires OpenLayers/Format/Px3JSON.js
    * @requires OpenLayers/Format/Px3JSON/ServiceControls.js
    * 
    * More info @ https://my.usgs.gov/confluence/download/attachments/67862566/Configuring+Config_USGS_TNM.json.pdf
    */
     
    /**
     * Property: id
     * {String} An id to be used by other references to this map in the config.
     */
    id: null,
            
    /**
     * Property: displayName
     * {String} The name that will be displayed on the background map selector 
     * in the upper right hand corner of the map.
     */
    displayName: null,
       
    /**
     * Property: serviceGroupId
     * {String} The service group that this background map consists of.
     */
    serviceGroupId: null,
    
    /**
     * Property: serviceControls
     * {OpenLayers.Format.Px3JSON.ServiceControls[]} An array of service control 
     * configuration objects. Provides control of specific service visibility 
     * within background maps.
     */
    serviceControls: [],
   
    /**
     * Constructor: OpenLayers.Format.Px3JSON.BackgroundMaps
     * Construct an OpenLayers.Format.Px3JSON.BackgroundMaps object
     * 
     * Parameters:
     * options - {Object} Optional object whose properties will be set on
     *     the object.
     */
    initialize: function(options) {
        OpenLayers.Util.applyDefaults(this, options);
        if (options.serviceControls) {
            this.serviceControls = [];
            for (var serviceControlsIndex = 0;serviceControlsIndex < options.serviceControls.length;serviceControlsIndex++) {
                this.serviceControls.push(new OpenLayers.Format.Px3JSON.ServiceControls(options.serviceControls[serviceControlsIndex]));
            }
        }
    },
    
    /**
     * APIMethod: read
     * Read a JSON string into a OpenLayers.Format.Px3JSON.BackgroundMaps object
     *
     * Parameters:
     * obj - {Object} A JSON string
     *
     * Returns: 
     * {OpenLayers.Format.Px3JSON.BackgroundMaps} 
     */
    read : function(json) {
        return new OpenLayers.Format.Px3JSON.BackgroundMaps(OpenLayers.Format.JSON.prototype.read.apply(this, [json]));
    },
    
    createBackgroundMapServices : function(params) {
        var backgroundServiceLayers = params.backgroundServiceLayers || {};
        var parsedJSONObject = params.parsedJSONObject;
        var backgroundServiceLayerNames = params.backgroundServiceLayerNames;
        var backgroundServiceLayersCount = Object.keys(backgroundServiceLayers).length;
        var multiLayerArray = [];
    
        if (backgroundServiceLayersCount === backgroundServiceLayerNames.length) {
            Ext.each(parsedJSONObject.mapConfig.backgroundMaps, function(item, index) {
                var serviceGroupId = item.serviceGroupId;
                var layerNames = this.parsedJSONObject.serviceGroups[serviceGroupId].serviceIds;
                var layers = [];

                Ext.iterate(layerNames, function(item) {
                    this.layers.push(this.backgroundServiceLayers[item]);
                }, {
                    backgroundServiceLayers : this.backgroundServiceLayers,
                    layers : layers
                })
            
                var multiLayer = new OpenLayers.Layer.NationalMapMulti(
                    item.displayName,
                    {
                        layers : layers,
                        isBaseLayer : false
                    }
                    )
                this.multiLayerArray.push(multiLayer);
            }, {
                backgroundServiceLayers : backgroundServiceLayers,
                parsedJSONObject : parsedJSONObject,
                multiLayerArray : multiLayerArray
            })
        
            params.completedCallback({
                backgroundMaps : multiLayerArray,
                parsedJSONObject : parsedJSONObject
            })
        } else {
            var backgroundServiceLayerName = backgroundServiceLayerNames[backgroundServiceLayersCount];
            var serviceObject = parsedJSONObject.services[backgroundServiceLayerName];
        
            Ext.Ajax.request({
                url : OpenLayers.ProxyHost + escape(serviceObject.url + '/?f=json'),
                timeout: params.timeout || 10000,
                backgroundServiceLayers : backgroundServiceLayers,
                parsedJSONObject : parsedJSONObject,
                completedCallback : params.completedCallback,
                backgroundServiceLayerNames : backgroundServiceLayerNames,
                backgroundServiceLayerName : backgroundServiceLayerName,
                serviceObject : serviceObject,
                success : function(response, options) {
                    var parsedResponse = Ext.util.JSON.decode(response.responseText);
                    var backgroundServiceLayers = options.backgroundServiceLayers;
                
                    var layer = createLayer({
                        parsedResponse : parsedResponse,
                        serviceObject : serviceObject
                    })
                    backgroundServiceLayers[options.backgroundServiceLayerName] = layer;
                
                    createBackgroundMapServices({
                        backgroundServiceLayers : backgroundServiceLayers,
                        parsedJSONObject : options.parsedJSONObject,
                        completedCallback : options.completedCallback,
                        backgroundServiceLayerNames : options.backgroundServiceLayerNames
                    })
                },
                failure : function(response, options) {
                    console.log("Layer could not be created");
                }
            })
        }
    
    },
    
    CLASS_NAME: "OpenLayers.Format.Px3JSON.BackgroundMaps"
});