
/**
 * Class: OpenLayers.Format.Px3JSON.v17
 * 
 * @see https://my.usgs.gov/confluence/download/attachments/67862566/Configuring+Config_USGS_TNM.json.pdf
 * 
 * @requires OpenLayers/Format/Px3JSON.js
 * @requires OpenLayers/Format/Px3JSON/Services.js
 * @requires OpenLayers/Format/Px3JSON/ServiceGroups.js
 * @requires OpenLayers/Format/Px3JSON/Locators.js
 * @requires OpenLayers/Format/Px3JSON/BandwidthTestEndpoints.js
 * @requires OpenLayers/Format/Px3JSON/Tasks.js
 * @requires OpenLayers/Format/Px3JSON/Tools.js
 * @requires OpenLayers/Format/Px3JSON/MapConfig.js
 * @requires OpenLayers/Format/Px3JSON/LayoutConfig.js
 * @requires OpenLayers/Format/Px3JSON/InfoWindowConfig.js
 * @requires OpenLayers/Format/Px3JSON/RouterConfig.js
 * @requires OpenLayers/Format/Px3JSON/SelectionResultsConfig.js
 * @requires OpenLayers/Format/Px3JSON/NSSEEventEntryConfig.js
 * @requires OpenLayers/Format/Px3JSON/NSSEEventListConfig.js
 * @requires OpenLayers/Format/Px3JSON/DynamicUserServicesConfig.js
 * @requires OpenLayers/Format/Px3JSON/GMTIConfig.js
 * @requires OpenLayers/Format/Px3JSON/EditUtilConfig.js
 * @requires OpenLayers/Format/Px3JSON/PreviousSearchDataStore.js
 * @requires OpenLayers/Format/Px3JSON/WMSErrorConfig.js
 * 
 */
OpenLayers.Format.Px3JSON.v17 = OpenLayers.Class(OpenLayers.Format.Px3JSON, {
    
    /**
     * Property : services
     * The services object can be thought of as a hash map with the key being 
     * the service id and value being a service configuration object.
     * {OpenLayers.Format.Px3JSON.Services} 
     */
    services : {},
    
    /**
     * Property : serviceGroups
     * The servicesGroups object can be thought of as a hash map with the key 
     * being the service group id and value being an array of service ids.	
     * This is used to help organize the services into grouped menus for the 
     * overlay services and into buttons for the basemaps
     * {OpenLayers.Format.Px3JSON.ServiceGroups} 
     */
    serviceGroups : {},
    
    /**
     * Property : locators
     * The locators object can be thought of as a hash map with the key being 
     * the locator id and value a locator configuration object.
     * {OpenLayers.Format.Px3JSON.Locators} 
     */
    locators : {},
    
    /**
     * Property : bandwidthTestEndpoints
     * The bandwidthTestEndpoints object can be thought of as a hash map with 
     * the key being the endpoint id and value being an endpoint configuration object.
     * {OpenLayers.Format.Px3JSON.BandwidthTestEndpoints} 
     */
    bandwidthTestEndpoints : {},

    /**
     * Property : extents
     * The extents object can be thought of as a hash map with the key being the
     * extent id and value being an extent configuration object.
     * {OpenLayers.Format.Px3JSON.Extents} 
     */
    extents : {},
    
    /**
     * Property : tasks
     * The tasks object can be thought of as a hash map with the key being the 
     * task id and value being a task configuration object. This is included in 
     * the NGA Palanterra x3 Toolbox, but not used by USGS The National Map
     * {OpenLayers.Format.Px3JSON.Tasks} 
     */
    tasks : {},
    
    /**
     * Property : tools
     * An array of tool group configuration objects.
     * {OpenLayers.Format.Px3JSON.Tools[]} 
     */
    tools : [],    
        
    /**
     * Property : mapConfig
     * An object used to set the initial map settings.
     * {OpenLayers.Format.Px3JSON.MapConfig} 
     */
    mapConfig : {},  
        
    /**
     * Property : layoutConfig
     * An object containing various properties used to setup the layout of 
     * the application.
     * {OpenLayers.Format.Px3JSON.LayoutConfig} 
     */
    layoutConfig : {},  
       
    /**
     * Property : infoWindowConfig
     * An object containing configuration information related to the info window.
     * {OpenLayers.Format.Px3JSON.InfoWindowConfig} 
     */
    infoWindowConfig : {},  
    
    /**
     * Property : searchConfig
     * An object used to configure the search function.
     * {OpenLayers.Format.Px3JSON.SearchConfig} 
     */
    searchConfig : {},
    
    /**
     * Property : routerConfig
     * An object containing configuration information related to the router. 
     * This is included in the NGA Palanterra x3 Toolbox, 
     * but not used by USGS The National Map
     * {OpenLayers.Format.Px3JSON.RouterConfig} 
     */
    routerConfig : {}, 
    
    /**
     * Property : selectionResultsConfig
     * An object containing configuration information related to the 
     * selection results.
     * {OpenLayers.Format.Px3JSON.SelectionResultsConfig} 
     */
    selectionResultsConfig: {},
    
    /**
     * Property : nsseEventEntryConfig
     * An object containing configuration information related to the NSSE event 
     * entry form. This is included in the NGA Palanterra x3 Toolbox, but not 
     * used by USGS The National Map
     * {OpenLayers.Format.Px3JSON.NSSEEventEntryConfig} 
     */
    nsseEventEntryConfig : {},
        
    /**
     * Property : nsseEventListConfig
     * An object containing configuration information related to the NSSE event 
     * list. This is included in the NGA Palanterra x3 Toolbox, 
     * but not used by USGS The National Map
     * {OpenLayers.Format.Px3JSON.NSSEEventListConfig} 
     */
    nsseEventListConfig : {},
    
    /**
     * Property : dynamicUserServicesConfig
     * An object containing configuration information related to WMS dynamic user services.
     * {OpenLayers.Format.Px3JSON.DynamicUserServicesConfig} 
     */  
    dynamicUserServicesConfig : {},
        
    /**
     * Property : gmtiConfig
     * An object containing configuration information related to GMTI 
     * functionality and validation. This is included in the NGA Palanterra x3 
     * Toolbox, but not used by USGS The National Map
     * {OpenLayers.Format.Px3JSON.GMTIConfig} 
     */  
    gmtiConfig : {},
    
    /**
     * Property : editUtilConfig
     * An object containing configuration information related to editing annotations.
     * {OpenLayers.Format.Px3JSON.EditUtilConfig} 
     */  
    editUtilConfig : {},
    
    /**
     * Property : previousSearchDataStore
     * An object containing configuration information related to storing previous 
     * search text. 
     * Note: to prevent storing any previous search text, remove this object from the configuration
     * {OpenLayers.Format.Px3JSON.PreviousSearchDataStore} 
     */  
    previousSearchDataStore : {},
    
    /**
     * Property : wmsErrorConfig
     * An object containing configuration information related to showing 
     * error messages on WMS layer interaction.
     * {OpenLayers.Format.Px3JSON.WMSErrorConfig} 
     */  
    wmsErrorConfig : {},
    
    /**
     * Constructor: OpenLayers.Format.Px3JSON.v17
     * Construct an OpenLayers.Format.Px3JSON.v17 object
     * 
     * Parameters:
     * json - {Object} The object from which this object is constructed
     */    
    initialize : function(options) {
        OpenLayers.Util.applyDefaults(this, options);
        for (var option in options) {
            var val = options[option];
            var obj = {};
            switch(option) {
                case 'services' :
                    for (var key in val) {
                        obj = new OpenLayers.Format.Px3JSON.Services(val[key]);
                        if (obj.isValidType(obj)) {
                            this[option][key] = obj;
                        }
                    }
                    break;
                case 'serviceGroups' :
                    for (var key in val) {
                        obj = new OpenLayers.Format.Px3JSON.ServiceGroups({
                            id : key,
                            serviceIds : val[key]
                        });
                        if (obj.isValidType(obj)) {
                            this[option][key] = obj;
                        }
                    }
                    break;
                case 'locators' :
                    for (var key in val) {
                        obj = new OpenLayers.Format.Px3JSON.Locators(val[key]);
                        if (obj.isValidType(obj)) {
                            this[option][key] = obj;
                        }
                    }
                    break;
                case 'bandwidthTestEndpoints' :
                    for (var key in val) {
                        obj = new OpenLayers.Format.Px3JSON.BandwidthTestEndpoints(val[key]);
                        if (obj.isValidType(obj)) {
                            this[option][key] = obj;
                        }
                    }
                    break;
                case 'extents' :
                    for (var key in val) {
                        obj = new OpenLayers.Format.Px3JSON.Extents(val[key]);
                        if (obj.isValidType(obj)) {
                            this[option][key] = obj;
                        }
                    }
                    break;
                case 'tasks' :
                    for (var key in val) {
                        obj = new OpenLayers.Format.Px3JSON.Tasks(val[key]);
                        if (obj.isValidType(obj)) {
                            this[option][key] = obj;
                        }
                    }
                    break;
                case 'tools' :
                    this[option] = [];
                    for (var key in val) {
                        obj = new OpenLayers.Format.Px3JSON.Tools(val[key]);
                        if (obj.isValidType(obj)) {
                            this[option].push(obj);
                        }
                    }
                    break;
                case 'mapConfig' :
                    obj = new OpenLayers.Format.Px3JSON.MapConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break;                   
                case 'layoutConfig' :
                    obj = new OpenLayers.Format.Px3JSON.LayoutConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break; 
                case 'infoWindowConfig' :
                    obj = new OpenLayers.Format.Px3JSON.InfoWindowConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break; 
                case 'searchConfig' :
                    obj = new OpenLayers.Format.Px3JSON.SearchConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break;      
                    
                case 'routerConfig' :
                    obj = new OpenLayers.Format.Px3JSON.RouterConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break;    
                case 'selectionResultsConfig' :
                    obj = new OpenLayers.Format.Px3JSON.SelectionResultsConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break;   
                case 'nsseEventEntryConfig' :
                    obj = new OpenLayers.Format.Px3JSON.NSSEEventEntryConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break;   
                case 'nsseEventListConfig' :
                    obj = new OpenLayers.Format.Px3JSON.NSSEEventListConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break;   
                case 'dynamicUserServicesConfig' :
                    obj = new OpenLayers.Format.Px3JSON.DynamicUserServicesConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break;   
                case 'gmtiConfig' :
                    obj = new OpenLayers.Format.Px3JSON.GMTIConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break;   
                case 'editUtilConfig' :
                    obj = new OpenLayers.Format.Px3JSON.EditUtilConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break;   
                case 'previousSearchDataStore' :
                    obj = new OpenLayers.Format.Px3JSON.PreviousSearchDataStore(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break;   
                case 'wmsErrorConfig' :
                    obj = new OpenLayers.Format.Px3JSON.WMSErrorConfig(val);
                    if (obj.isValidType(obj)) {
                        this[option] = obj;
                    }
                    break;   
            }
        }
    },
    
    read : function(json) {
        var obj = null;
        
        if (typeof json == "string") {
            obj = OpenLayers.Format.JSON.prototype.read.apply(this, [json]);
        } else { 
            obj = json;
        }  
        
        if(!obj) {
            OpenLayers.Console.error("JSON string could not be parsed: " + json);
            return null;
        } else {
            return new OpenLayers.Format.Px3JSON.v17(obj);
        }
    }, 
    
    createNationalMapMultiLayersObject : function(params) {
        var serviceLayers = params.serviceLayers;
        var serviceGroup = params.serviceGroup;
        var serviceGroupId = serviceGroup.serviceGroupId || serviceGroup.id;
        var layerNames = this.serviceGroups[serviceGroupId].serviceIds;
        var layers = [], scales = [];
        var multiLayer;
                
        for (var layerNamesIdx = 0;layerNamesIdx < layerNames.length;layerNamesIdx++) {
            layers.push(serviceLayers[layerNames[layerNamesIdx]]);
        }
                
        multiLayer = new OpenLayers.Layer.NationalMapMulti(
            serviceGroup.displayName,
            {
                layers : layers,
                isBaseLayer : false,
                alwaysInRange : true
            }
            )
                        
        scales = multiLayer.getScales();
        for (var serviceLayersIdx = 0;serviceLayersIdx < layers.length;serviceLayersIdx++) {
            var serviceLayer = layers[serviceLayersIdx];
            if (!serviceLayer) {
                var a= 1;
            }
            if (!serviceLayer.minZoom && !serviceLayer.maxZoom && serviceLayer.scales) {
                var minScale = serviceLayer.scales[0]
                var maxScale = serviceLayer.scales[serviceLayer.scales.length - 1];
                var minZoom = scales.indexOf(minScale) < 0 ? 0 : scales.indexOf(minScale);
                var maxZoom = scales.indexOf(maxScale);
                multiLayer.layers[serviceLayersIdx].minZoom = minZoom;
                multiLayer.layers[serviceLayersIdx].maxZoom = maxZoom;
                multiLayer.layers[serviceLayersIdx].minScale = minScale;
                multiLayer.layers[serviceLayersIdx].maxScale = maxScale;
            }
        }
        
        multiLayer.numZoomLevels = multiLayer.getNumZoomLevels();
        
        return multiLayer;
    },
    
    /**
     * Returns a list of the layer names that are background services
     */
    getBackgroundServiceLayerNames :  function() {
        var backgroundServiceLayerNames = [];

        for (var backgroundMapsIdx = 0;backgroundMapsIdx < this.mapConfig.backgroundMaps.length;backgroundMapsIdx++) {
            var backgroundMapObject = this.mapConfig.backgroundMaps[backgroundMapsIdx];
            var serviceGroupId = backgroundMapObject.serviceGroupId;
            var serviceIds = this.serviceGroups[serviceGroupId].serviceIds;
            for (var serviceIdsIdx = 0;serviceIdsIdx < serviceIds.length;serviceIdsIdx++) {
                var item = serviceIds[serviceIdsIdx];
                var indexOf = function(array, item) {
                    for (var i=0;i<array.length;i++) {
                        if (array[i] === item) return i;
                    }
                    return -1
                }
                if (indexOf(backgroundServiceLayerNames, item) == -1) backgroundServiceLayerNames.push(item);
            }
        }
        return backgroundServiceLayerNames;
    },
    
    getNonBackgroundServiceLayerNames : function() {
        
        var nonBackgroundServiceLayerNames = [];
        var backgrounsServicesLayerNames = this.getBackgroundServiceLayerNames();
        
        for (var key in this.services) {
            if (backgrounsServicesLayerNames.indexOf(key) == -1) {
                nonBackgroundServiceLayerNames.push(key)
            }
        }
        
        return nonBackgroundServiceLayerNames;
    },
    
    createServicesObject : function(params) {
        var completedCallbacks = params.completedCallbacks;
        var backgroundServiceLayers = params.backgroundServiceLayers || {};
        var backgroundServiceLayerNames = params.backgroundServiceLayerNames || this.getBackgroundServiceLayerNames();
        var backgroundServiceLayersCount = Object.keys(backgroundServiceLayers).length;
        var px3jsonObject = params.px3jsonObject || this;
        var useTNMLayers = params.useTNMLayers || false;
        var autoParseArcGISCache = params.autoParseArcGISCache;
        
        if (autoParseArcGISCache == undefined) autoParseArcGISCache = true;
        
        // Have we completed filling out our background services object? 
        if (backgroundServiceLayersCount === backgroundServiceLayerNames.length) {
            var multiLayerArray = [];
            var backgroundServiceGroupIds = [];
            for (var backgroundMapsIdx = 0;backgroundMapsIdx < this.mapConfig.backgroundMaps.length;backgroundMapsIdx++) {
                multiLayerArray.push(this.createNationalMapMultiLayersObject({
                    serviceLayers : backgroundServiceLayers,
                    serviceGroup : px3jsonObject.mapConfig.backgroundMaps[backgroundMapsIdx]
                }));
                backgroundServiceGroupIds.push(px3jsonObject.mapConfig.backgroundMaps[backgroundMapsIdx].serviceGroupId);
            }
            
            // Create the rest of the service groups - these will be dummy layers. We 
            // leave it up to the client to decide how to handle these. 
            // In our case, the layer switcher, when seeing a dummy layer, will then
            // create the actual layer using remote calls
            for (var serviceGroupName in this.serviceGroups) {
                if (backgroundServiceGroupIds.indexOf(serviceGroupName) == -1) {
                    var serviceIds = this.serviceGroups[serviceGroupName].serviceIds;
                    var serviceLayers = {};
                    for (var serviceIdsIndex = 0;serviceIdsIndex < serviceIds.length;serviceIdsIndex++) {
                        var service = this.services[serviceIds[serviceIdsIndex]];
                        var layer = service.createLayer();
                        serviceLayers[layer.id] = layer;
                    }
                    multiLayerArray.push(this.createNationalMapMultiLayersObject({
                        serviceLayers : serviceLayers,
                        serviceGroup : this.serviceGroups[serviceGroupName]
                    }));
                }
            }
        
            for (var completedCallbacksIndex = 0;completedCallbacksIndex < completedCallbacks.length;completedCallbacksIndex++) {
                var completedCallback = completedCallbacks[completedCallbacksIndex];
                completedCallback({
                    serviceGroups : multiLayerArray,
                    px3jsonObject : px3jsonObject
                })
            }
            
        } else {
            // We've not yet completed filling out our background service layers
            
            // Pick up the name of the next background service we'd like to fill
            var backgroundServiceLayerName = backgroundServiceLayerNames[backgroundServiceLayersCount];
            
            // Pull the service object for that layer 
            var serviceObject = this.services[backgroundServiceLayerName];
        
            // Based on that layer's URL, we pull info for that 
            // layer from the remote server
            OpenLayers.Request.GET({
                url: serviceObject.url + '/?f=json&pretty=true',
                scope: {
                    that : this,
                    backgroundServiceLayers : backgroundServiceLayers,
                    px3jsonObject : this,
                    completedCallbacks : params.completedCallbacks,
                    backgroundServiceLayerNames : backgroundServiceLayerNames,
                    backgroundServiceLayerName : backgroundServiceLayerName,
                    serviceObject : serviceObject,
                    useTNMLayers : useTNMLayers,
                    autoParseArcGISCache : autoParseArcGISCache
                },
                success: function(request) {
                    var doc = request.responseXML;
                    if (!doc || !doc.documentElement) {
                        doc = request.responseText;
                    }
                    var parsedResponse = (new OpenLayers.Format.JSON).read(doc);
                
                    // We now have the remote metadata for this layer. Let's create that layer
                    var layer = this.serviceObject.createLayer({
                        parsedResponse : parsedResponse,
                        serviceObject : serviceObject,
                        useTNMLayers : this.useTNMLayers,
                        autoParseArcGISCache : this.autoParseArcGISCache
                    })
                    
                    // This should be refactored out if we're going to genericize this function
                    // to handle background layers and non-background laters
                    this.backgroundServiceLayers[this.backgroundServiceLayerName] = layer;
                
                    // Loop back into the function we're in in order to make the next layer
                    this.px3jsonObject.createServicesObject({
                        backgroundServiceLayers : this.backgroundServiceLayers,
                        px3jsonObject : this.px3jsonObject,
                        completedCallbacks : this.completedCallbacks,
                        backgroundServiceLayerNames : this.backgroundServiceLayerNames,
                        useTNMLayers : this.useTNMLayers,
                        autoParseArcGISCache : this.autoParseArcGISCache
                    })
                    
                },
                failure : function(response, options) {
                    // I've not yet decided how to handle failed responses
                    console.log("Layer could not be created");
                }
            });
        }
    
    },
    
    createServiceLayers : function(params) {
        var result = {};
        for (var serviceLayerId in this.services) {
            var serviceObject = this.services[serviceLayerId];
            var serviceLayer = serviceObject.createLayer(params);
            result[serviceLayerId] = serviceLayer;
        }
        return result;
    },
    
    getSpatialReference : function() {
        return this.extents[this.mapConfig.fullExtentId].getSpatialReference();
    },
    
    getMaxExtent : function() {
        return this.extents[this.mapConfig.fullExtentId].getMaxExtent();
    },
    
    CLASS_NAME : 'OpenLayers.Format.Px3JSON.v17'
})