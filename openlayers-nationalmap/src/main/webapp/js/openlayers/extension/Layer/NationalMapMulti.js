OpenLayers.Layer.NationalMapMulti = OpenLayers.Class(OpenLayers.Layer, {
    sphericalMercator: true,

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
        this.toggleLayers()
    },

    moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
        if (zoomChanged) this.toggleLayers();
    },
    
    getScales : function() {
        var result = [];
        for (var layersIndex = 0;layersIndex < this.layers.length;layersIndex++){
            var layer = this.layers[layersIndex];
            var scales = layer.scales || [];
            for (var scalesIndex = 0;scalesIndex < scales.length;scalesIndex++) {
                var scale = scales[scalesIndex];
                if (scale != null && result.indexOf(scale) == -1) {
                    result.push(scale);
                }
            }
        }
        return result.sort(function(a,b){return a > b}); 
    },
    
    getNumZoomLevels : function() {
        var result = 0;
        for (var layersIndex = 0;layersIndex < this.layers.length;layersIndex++){
            var layer = this.layers[layersIndex];
            if (layer.numZoomLevels > result) result = layer.numZoomLevels;
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
       	var z = this.map.getZoom();
        var l = this.options.layers;
        var removeLayer = null;
        for (var i = 0; i < l.length; i++) {
            if (l[i].minZoom <= z && l[i].maxZoom >= z) {

                if (!this.map.getLayer(l[i].id)) {
                    this.map.addLayer(l[i]);
                    l[i].setZIndex(this.getZIndex());
                } else {
                    l[i].setVisibility(true);
                }
            } else {
                if (this.map.getLayer(l[i].id)) {
                    l[i].setVisibility(false);
                }
            }
       	}
    },
    
    CLASS_NAME: "OpenLayers.Layer.NationalMapMulti"

});