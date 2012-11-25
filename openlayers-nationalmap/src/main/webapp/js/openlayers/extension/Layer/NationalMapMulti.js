OpenLayers.Layer.NationalMapMulti = OpenLayers.Class(OpenLayers.Layer, {
    
    alwaysInRange : true,
    
    sphericalMercator: true,
    
    numZoomLevels : undefined,
    
    multiLayer : true,
    
    initialOn : false,
    
    initialize: function(options) {
        OpenLayers.Util.applyDefaults(this, options);
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
        this.events.addEventType('layers_toggled');
    },
    
    destroy: function() {
        if (this.map != null) {
            var l = this.options.layers;
            for (var i = 0; i < l.length; i++) {
                if (this.map.getLayer(l[i].id)) this.map.removeLayer(l[i]);
            }
        }
        OpenLayers.Layer.prototype.destroy.apply(this);
    },
    
    setMap: function(map) {
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);
        this.toggleLayers();
    },

    moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
        if (zoomChanged) this.toggleLayers();
    },
    
    getScales : function() {
        var result = [];
        for (var layersIndex = 0;layersIndex < this.layers.length;layersIndex++){
            var layer = this.layers[layersIndex];
            var scales = [];
            if (layer) {
                scales = layer.scales || scales;
                for (var scalesIndex = 0;scalesIndex < scales.length;scalesIndex++) {
                    var scale = scales[scalesIndex];
                    if (scale !== null && result.indexOf(scale) == -1) {
                        result.push(scale);
                    }
                }
            }
        }
        return result.sort(function(a,b){
            return a > b
        }); 
    },
    
    getNumZoomLevels : function() {
        var result = 0;
        for (var layersIndex = 0;layersIndex < this.layers.length;layersIndex++){
            var layer = this.layers[layersIndex];
            var layerNumZoomLevels = layer.numZoomLevels;
            if (!layerNumZoomLevels || layer.resolutions.length > layerNumZoomLevels) layerNumZoomLevels = layer.resolutions.length;
            if (layerNumZoomLevels > result) result = layerNumZoomLevels;
        }
        return result;  
    },
    
    getResolutions : function() {
        var result = [];
        for (var layersIndex = 0;layersIndex < this.layers.length;layersIndex++){
            var layer = this.layers[layersIndex];
            var resolutions = layer.resolutions || [];
            for (var resolutionIndex = 0;resolutionIndex < resolutions.length;resolutionIndex++) {
                var resolution = resolutions[resolutionIndex];
                if (result.indexOf(resolution) == -1) {
                    result.push(resolution);
                }
            }
        }
        return result;  
    },
    
    containsLayer : function(property, value) {
        for (var layersIndex = 0;layersIndex < this.layers.length;layersIndex++) {
            var layer = this.layers[layersIndex];
            if (layer[property] === value) {
                return layersIndex;
            }
        }
        return -1;
    },
    
    getlayer : function(layer) {
        var layerIndex = this.containsLayer('id', layer.id);
        if (layerIndex != -1) {
            return this.layers[layerIndex];
        }
        return null;
    },
    
    replaceLayer : function(layer) {
        var layerReplaced = false;
        for (var layersIndex = 0;layersIndex < this.layers.length;layersIndex++) {
            var existingLayer = this.layers[layersIndex];
            if (existingLayer.name === layer.name) {
                this.layers[layersIndex] = layer;
                layerReplaced = true;
            }
        }
        
        this.reinitializeScales();
        
        return layerReplaced;
    },
    
    afterAdd : function() {
        this.reinitializeScales();
    },
    
    reinitializeScales : function() {
        var scales = this.getScales();
        
        for (var serviceLayersIdx = 0;serviceLayersIdx < this.layers.length;serviceLayersIdx++) {
            var serviceLayer = this.layers[serviceLayersIdx];
            if (serviceLayer.scales) {
                var minScale = serviceLayer.scales[0]
                var maxScale = serviceLayer.scales[serviceLayer.scales.length - 1];
                var minZoom, maxZoom;
                
                minZoom = scales.indexOf(minScale) < 0 ? 0 : scales.indexOf(minScale);
                maxZoom = scales.indexOf(maxScale);

                if (this.map) {
                    var zoomOffset = 0;
                    var mapMinZoom = this.map.getZoomForResolution(serviceLayer.resolutions[0]);
                    if (mapMinZoom < serviceLayer.minZoom) {
                        zoomOffset = serviceLayer.minZoom - mapMinZoom;
                    }
                    serviceLayer.zoomOffset = zoomOffset;
                    
                    minZoom = this.map.getZoomForResolution(serviceLayer.resolutions[0]);
                    maxZoom = this.map.getZoomForResolution(serviceLayer.resolutions[serviceLayer.resolutions.length - 1]);
                    
                }
                
                serviceLayer.minZoom = minZoom;
                serviceLayer.maxZoom = maxZoom;
                serviceLayer.minScale = minScale;
                serviceLayer.maxScale = maxScale;
                
                if (this.minScale == undefined || this.minScale < minScale) {
                    this.minScale = minScale;
                }
                
                if (this.maxScale == undefined || this.maxScale > maxScale) {
                    this.maxScale = maxScale;
                }
                
                if (this.minZoom == undefined || this.minZoom > minZoom) {
                    this.minZoom = minZoom;
                }
                
                if (this.maxZoom == undefined || this.maxZoom > maxZoom) {
                    this.maxZoom = maxZoom;
                }
                
                
            }
        }
        this.numZoomLevels = this.getNumZoomLevels();
    },
    
    toggleLayers: function() {
        var mapZoom = this.map.getZoom();
        var layers = this.layers;
                    
        for (var layersIndex = 0; layersIndex < layers.length; layersIndex++) {
            var layer = layers[layersIndex];
            var mapLayer = this.map.getLayer(layer.id);
            
            if (!mapLayer) {
                this.map.addLayer(layer);
                layer.setZIndex(this.getZIndex());
                mapLayer = this.map.getLayer(layer.id);
            }
            
            if (layer.CLASS_NAME !== 'OpenLayers.Layer') {
                if (mapLayer.minZoom <= mapZoom && mapLayer.maxZoom >= mapZoom) {
                    mapLayer.setVisibility(true);
                } else {
                    if (this.map.getLayer(layer.id)) {
                        mapLayer.setVisibility(false);
                    }
                }
            } else {
                mapLayer.setVisibility(false);
            }
            
            this.events.triggerEvent("layers_toggled", {
                layer: mapLayer
            });
        }
        
    },
    
    getBounds: function() {
        var l = this.options.layers;
        var bounds;
        for (var i = 0; i < l.length; i++) {
            var layerBounds = l[i].maxExtent;
            if (!bounds) {
                bounds = layerBounds;
            } else {
                bounds.add(layerBounds);
            }
        }
        return bounds;
    },
    
    CLASS_NAME: "OpenLayers.Layer.NationalMapMulti"

});