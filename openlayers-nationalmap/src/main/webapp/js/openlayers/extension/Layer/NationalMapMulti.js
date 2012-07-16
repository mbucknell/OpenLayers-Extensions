OpenLayers.Layer.NationalMapMulti = OpenLayers.Class(OpenLayers.Layer, {
    
    alwaysInRange : true,
    
    sphericalMercator: true,
    
    numZoomLevels : undefined,
    
    multiLayer : true,
    
    initialOn : false,
    
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
            if (!layerNumZoomLevels) layerNumZoomLevels = layer.resolutions.length;
            if (layerNumZoomLevels > result) result = layer.numZoomLevels;
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
    
    toggleLayers: function() {
        var mapZoom = this.map.getZoom();
        var layers = this.layers;
        
        this.setMapTemp = this.setMap;
        this.setMap = OpenLayers.Layer.setMap//function(map) {OpenLayers.Layer.prototype.setMap.apply(this, arguments)};
                    
        for (var layersIndex = 0; layersIndex < layers.length; layersIndex++) {
            var layer = layers[layersIndex];
            var mapLayer = this.map.getLayer(layer.id);
            
            if (!mapLayer) {
                this.map.addLayer(layer);
                layer.setZIndex(this.getZIndex());
                mapLayer = this.map.getLayer(layer.id);
            }
            
            if (layer.minZoom <= mapZoom && layer.maxZoom >= mapZoom) {
                mapLayer.setVisibility(true);
            } else {
                if (this.map.getLayer(layer.id)) {
                mapLayer.setVisibility(false);
                }
            }
            
        }
        
        this.setMap = this.setMapTemp;
        delete this.setMapTemp;
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