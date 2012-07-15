OpenLayers.Format.Px3JSON.Services = OpenLayers.Class(OpenLayers.Format.Px3JSON, {
    
    /**
     * Class: OpenLayers.Px3JSON.Service (Base Context)
     * 
     * Service Configuration Object
     * 
     * The services object can be thought of as a hash map with the key being 
     * the service id and value being a service configuration object.
     * 
     *  @requires OpenLayers/Format/Px3JSON.js
     *  @requires OpenLayers/Format/Px3JSON/LayerConfigs.js
     *  @requires OpenLayers/Format/Px3JSON/InfoTemplates.js
     *  
     *  @see https://my.usgs.gov/confluence/download/attachments/67862566/Configuring+Config_USGS_TNM.json.pdf
     */
    
    /**
     * Property: id
     * {String} Id of the service, this should match the key in the services 
     * object (this allows for fast access to a service configuration object)
     */
    id: null,
    
    /**
     * Property: url
     * {String} URL to the ArcGIS Server REST resource that represents a map 
     * service. 
     */
    url : null,
    
    /**
     * Property: soapEndpoint 
     * {String} Optional. URL to the ArcGIS Server Soap resource that is represented by the url. 
     * This is used to fetch swatches (legend icons) for the overlay pane for each service.
     */
    soapEndoint : null,
    
    /**
     * Property: authId 
     * {String} Optional. This is used in conjunction with the soapEndpoint to provide authentication 
     * information to the soap service. The actual authentication information is stored in a database 
     * table whose key matches this id.
     */
    authId : null,
    
    /** 
     * Property: displayName
     * {String} Name that will be displayed in the Overlays Pane for the service.
     */
    displayName : null,
    
    /** 
     * Property: classification
     * Default: UNCLASSIFIED
     * {String} Optional. Valid values are "UNCLASSIFIED", "CONFIDENTIAL", "SECRET", 
     * and "TOP SECRET". This will be used if displaySecurityBanners or 
     * displayTocSecurityMarkings in the layoutConfig object are true 
     * (see Layout Configuration Object).
     * 
     */
    classificiation : 'UNCLASSIFIED',
    
    /**
     * Property: caveats
     * Default: []
     * {String[]} Optional. An array of strings representing caveats to the classification. 
     * See classification property for details when it will be used.
     */
    caveats : [],
    
    /**
     * Property : metadataUrl
     * {String} Optional. URL to a webpage with metadata about the service. This page 
     * will display in a tooltip dialog opened from the context menu (right-clicking) 
     * on a service in the Overlay Pane.
     */
    metadataUrl : null,
    
    /**
     * Property : layersDefaultIdentifiable
     * Default: false
     * {boolean} Optional. True sets every layer in the service to identifiable, false 
     * allows no layer in the service to be identified on (preferred for raster data). 
     * A layer’s identifiablility can be overridden in a Layer Configuration object in 
     * the layers section (see Layer Configuration Object).
     */
    layersDefaultIdentifiable : false,
    
    /** 
     * Property : type
     * {String} Specifies the layer's type
     * Possible values: tiled, dynamic, wms, wmts, image, nrl. 
     * Note: Dynamic Services will be rendered as PNG 24 images 
     * except in IE6 where they will be rendered as PNG 8.
     */
    type : null,
    
    /**
     * Property : drawOrder
     * {Number} Specifies the default draw order for stacking services on top of each 
     * other to create the map the user sees in the browser. The higher values appear 
     * on top.
     * Default: 0
     */
    drawOrder : 0,
    
    /**
     * Property : downloadUrl
     * {String} Optional. URL pointing to a file to be used for the Download Layer link on 
     * this service's context menu.
     */
    downloadUrl : null,
    
    /** 
     * Property : opacity
     * {Number} Number between 0 and 1.0 that determines the default opacity of a layer.
     * Default: 1.0
     */
    opacity : 1.0,
    
    /**
     * Property : refreshIntervalSeconds
     * {Number} Optional. Number of seconds between automatic layer refresh operations.
     */
    refreshIntervalSeconds : null,
    
    /**
     * Property : layers
     * {OpenLayers.Format.Px3JSON.LayerConfig} Hash map of Layer Configuration Objects, keys are the layer’s id.
     */
    layers : {},
    
    /**
     * Property: defaultInfotemplate
     * {OpenLayers.Format.Px3JSON.InfoTemplate} Optional. The default info template 
     * to apply to layers where none is specified via the Layers configuration object. 
     * Refer to the Info Template Object section for configuration format of this object.
     */
    defaultInfotemplate : {},
    
    /**
     * Property: imageFormat
     * See /doc/jsapix-config-schema.jsd
     * {String} Optional. 
     */
    imageFormat : null,
    
    /**
     * Property: disableViewin
     * See /doc/jsapix-config-schema.jsd
     * {Boolean} Optional. 
     */
    disableViewin : false,
    
    /**
     * Constructor: OpenLayers.Format.Px3JSON.Services
     * Construct an OpenLayers.Format.Px3JSON.Services object
     * 
     * Parameters:
     * options - {Object} Optional object whose properties will be set on
     *     the object.
     */
    initialize: function(options) {
        OpenLayers.Util.applyDefaults(this, options);
        
        if (this.opacity < 0) {
            this.opacity = 0;
        } else if (this.opacity > 1) {
            this.opacity = 1.0;
        }
        for (var layer in options.layers) {
            this.layers[layer] = new OpenLayers.Format.Px3JSON.LayerConfig(this.layers[layer]);
        }
        if (!Object.keys(this.layers).length) {
            this.layers = this.defaultInfotemplate;
        }
    },
    
    /**
     * APIMethod: read
     * Read a JSON string into a OpenLayers.Format.Px3JSON.Service object
     *
     * Parameters:
     * obj - {Object} A JSON string
     *
     * Returns: 
     * {OpenLayers.Format.Px3JSON.Services} 
     */
    read : function(json) {
        return new OpenLayers.Format.Px3JSON.Services(OpenLayers.Format.JSON.prototype.read.apply(this, [json]));
    },
    
    createLayer : function(params) {
        params = params || {};
        if (params.parsedResponse) {
            return this.createLayerUsingRemoteMetadata(params);
        } else {
            return new OpenLayers.Layer(this.displayName, {
                id : this.id, 
                serviceObject : this, 
                numZoomLevels : 0,
                resolutions : [],
                scales : []
            })
        }
    },
    
    createLayerUsingRemoteMetadata : function(params) {
        var layerInfo = params.parsedResponse;
        var useTNMLayers = params.useTNMLayers;
        var autoParseArcGISCache = params.autoParseArcGISCache;
        var layerMaxExtent, tileSize, tileOrigin, projection, title;
        var subLayerIds = '';
        var scales = [], resolutions = [];
        var minResolution, maxResolution;
        var numZoomLevels;
        var result;
        var zIndex;
        var units = 'm';

        if (layerInfo) {
            units = layerInfo.units.toLowerCase() === 'esridecimaldegrees' ? 'degrees' : 'm'

            layerMaxExtent = new OpenLayers.Bounds(
                layerInfo.fullExtent.xmin, 
                layerInfo.fullExtent.ymin, 
                layerInfo.fullExtent.xmax, 
                layerInfo.fullExtent.ymax  
                );
                    
            if (layerInfo.tileInfo) {
                tileSize = new OpenLayers.Size(layerInfo.tileInfo.cols, layerInfo.tileInfo.rows);
                
                tileOrigin = new OpenLayers.LonLat(layerInfo.tileInfo.origin.x , layerInfo.tileInfo.origin.y);
                for (var lodsIndex=0; lodsIndex<layerInfo.tileInfo.lods.length; lodsIndex++) {
                    var lod = layerInfo.tileInfo.lods[lodsIndex];
                    if (scales.indexOf(lod.scale) == -1) {
                        scales.push(lod.scale);
                    }
                    resolutions.push(lod.resolution);
                }
            }
            
            projection = 'EPSG:' + layerInfo.spatialReference.wkid;
            
            title = layerInfo.documentInfo.Title;
                    
            for (var layersIdx = 0;layersIdx < layerInfo.layers.length;layersIdx++) {
                var layer = layerInfo.layers[layersIdx];
                var parentLayerId = layer.parentLayerId;
                var parentLayer;
                var layerMaxScale = layer.maxScale;
                var layerMinScale = layer.minScale;
                
                while (parentLayerId != -1) {
                    parentLayer = layerInfo.layers[parentLayerId];
                    parentLayerId = parentLayer.parentLayerId;
                }
                
                subLayerIds += layer.id + ',';
                          
                if (parentLayer) {
                    layerMaxScale = parentLayer.maxScale;
                    layerMinScale = parentLayer.minScale;
                }
                
                if (layerMaxScale != undefined && layerMaxScale != 0 && scales.indexOf(layerMaxScale) == -1) {
                    scales.push(layerMaxScale);
                }
                if (layerMinScale != undefined  && scales.indexOf(layerMinScale) == -1) {
                    scales.push(layerMinScale);
                }
            }
            
            subLayerIds = subLayerIds.substring(0, subLayerIds.length - 1); 
            
            scales = scales.sort(function(a,b) {
                return a > b
            });
        
            if (resolutions.length == 0) {
                resolutions = this.resolutionsFromScales(scales[0] == 0 ? scales.slice(1) : scales, 'm');
            }
            
            resolutions = resolutions.sort(function(a,b) {
                return a > b
            });
            
            minResolution = resolutions[0];
            maxResolution =  resolutions[resolutions.length - 1];
            numZoomLevels = Math.floor(Math.log(maxResolution / minResolution) / Math.log(2)) + 1
            zIndex = this.drawOrder ? this.drawOrder : null;
        }
        
        var options = {
            resolutions : resolutions,
            numZoomLevels : numZoomLevels,
            units : units,
            isBaseLayer : false,
            opacity : this.opacity,
            scales : scales,
            minResolution : minResolution,
            maxResolution : maxResolution,
            maxExtent: layerMaxExtent,
            transparent: true,
            visibility : true,
            projection: projection
        }
        
        switch (this.type) {
            case 'dynamic':
                if (useTNMLayers) {
                    result = new OpenLayers.Layer.NationalMapWMS(
                        this.displayName,
                        this.url + '/export',
                        {
                            layers : 'show:' + subLayerIds
                        },
                        OpenLayers.Util.applyDefaults({
                            singleTile: false
                        }, options))
                } else {
                    result = new OpenLayers.Layer.ArcGIS93Rest(
                        this.displayName,
                        this.url + '/export',
                        {
                            layers : 'show:' + subLayerIds,
                            transparent: true,
                            srs : layerInfo.spatialReference.wkid
                        },
                        OpenLayers.Util.applyDefaults({
                            singleTile: false,
                            displayOutsideMaxExtent: true,
                            metadata: {
                                layerId : this.id
                            }
                        }, options))
                }
                break;
            case 'tiled':
                if (useTNMLayers) {
                    result = new OpenLayers.Layer.NationalMapTile(
                        title, 
                        this.url + '/tile',
                        OpenLayers.Util.applyDefaults({
                            layers : subLayerIds,
                            minZoom : 0
                        }, options))
                } else {
                    if (autoParseArcGISCache) {
                        result = new OpenLayers.Layer.ArcGISCache(
                            title,
                            this.url, 
                            OpenLayers.Util.applyDefaults({
                                layers : subLayerIds,
                                layerInfo : layerInfo,
                                tileOrigin: tileOrigin,
                                useScales: false,
                                overrideDPI : true,
                                tileSize: tileSize
                            }, options))
                    } else {
                        result = new OpenLayers.Layer.ArcGISCache(
                            title,
                            this.url, 
                            OpenLayers.Util.applyDefaults({
                                layers : subLayerIds,
                                layerInfo : layerInfo,
                                tileOrigin: tileOrigin,
                                useScales: false,
                                overrideDPI : true,
                                tileSize: tileSize
                            }, options))
                    }
                }
        }
        
        if (zIndex != null) {
            result.setZIndex(zIndex);
        }
        
        return result;
    },
    
    CLASS_NAME: "OpenLayers.Format.Px3JSON.Services"
});