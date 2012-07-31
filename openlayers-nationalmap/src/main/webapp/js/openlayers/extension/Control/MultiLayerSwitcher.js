
OpenLayers.Control.MultiLayerSwitcher =  OpenLayers.Class(OpenLayers.Control.LayerSwitcher, {
    
    checkState : {},
    
    initialize: function(options) {
        OpenLayers.Util.applyDefaults(this, options);
        OpenLayers.Control.LayerSwitcher.prototype.initialize.apply(this, arguments);
    },
    
    maximizeControl: function(e) {

        // set the div's width and height to empty values, so
        // the div dimensions can be controlled by CSS
        this.div.style.overflow = "auto";
        this.div.style.width = "500px";
        this.div.style.height = this.map.size.h - 40 + 'px';
        
        this.showControls(false);
        
        if (e != null) {
            OpenLayers.Event.stop(e);                                            
        }
    },
    
    showControls: function(minimize) {

        this.maximizeDiv.style.display = minimize ? "" : "none";
        this.minimizeDiv.style.display = minimize ? "none" : "";

        this.layersDiv.style.display = minimize ? "none" : "";
        
        if (this.layersDiv.style.display !== "none") {
            
            // Because of the size of the list of layers, layersDiv needs 
            // to be resized
            var layersDiv = document.getElementsByClassName('layersDiv')[0];  
            if (layersDiv) {
                var height = 0;
                for (var layersDivIndex = 0;layersDivIndex < layersDiv.children.length;layersDivIndex++) {
                    var layersChild = layersDiv.children[layersDivIndex];
                    var clientHeight = layersChild.clientHeight || 0;
                    height += clientHeight;
                }
        
                layersDiv.style.height = height  + 'px';
            }
            
        }
    },
    
    minimizeControl: function(e) {

        // to minimize the control we set its div's width
        // and height to 0px, we cannot just set "display"
        // to "none" because it would hide the maximize
        // div
        this.div.style.overflow = "visible";
        this.div.style.width = "0px";
        this.div.style.height = "0px";
        
        this.showControls(true);

        if (e != null) {
            OpenLayers.Event.stop(e);                                            
        }
    },
    
    redraw: function() {
        var layersLength = this.map.layers.length;
        var layers = this.map.layers;
        
        //if the state hasn't changed since last redraw, no need 
        // to do anything. Just return the existing div.
        if (!this.checkRedraw()) { 
            return this.div; 
        } 

        //clear out previous layers 
        this.clearLayersArray("data");
        
        // Save state -- for checking layer if the map state changed.
        // Save this before redrawing, because the process of redrawing
        // will trigger more visibility changes, and we want to not redraw
        // and enter an infinite loop.
        this.layerStates = new Array(layersLength);
        for (var layersIndex=0; layersIndex < layersLength; layersIndex++) {
            var layer = this.map.layers[layersIndex];
            this.layerStates[layersIndex] = {
                'name': layer.name, 
                'visibility': layer.visibility,
                'inRange': layer.inRange,
                'id': layer.id
            };
        }    
        
        for(layersIndex=0; layersIndex< layersLength; layersIndex++) {
            layer = layers[layersIndex];
            var isMultiLayer = layer.multiLayer;
            var br = document.createElement("br");
            var labelSpan = document.createElement("span");
            var inputElem = document.createElement("input");
            
            if (layer.displayInLayerSwitcher) {
                // We differentiate multilayer sets by underlining 
                // the text. Otherwise, we pad out the text
                if (isMultiLayer) {
                    labelSpan.style.textDecoration = "underline";
                } else {
                    labelSpan.style.paddingLeft = '20px';
                    if (!layer.calculateInRange()) {
                        // While the layer is not in range, 
                        // we disable it visually
                        labelSpan.style.color = "gray";
                        inputElem.disabled = true;
                    }
                }
                
                var checked;
                if (this.checkState[layer.id] != undefined) {
                    checked = this.checkState[layer.id];
                } else {
                    checked = layer.getVisibility();
                    this.checkState[layer.id] = true;
                }
                var labelText = layer.name;

                if (layer.CLASS_NAME === "OpenLayers.Layer") {
                    labelText += '<br /><span class="sublayer-name" style="padding-left:50px;color:gray">Layer Not Yet Loaded</span>'
                    layer.setVisibility(false);
                    checked = false;
                    this.checkState[layer.id] = false;
                } else if (layer.layerInfo && layer.layerInfo.layers) {
                    var layerInfoLayers = layer.layerInfo.layers;
                    for (var layerInfoLayersIndex = 0;layerInfoLayersIndex < layerInfoLayers.length;layerInfoLayersIndex++) {
                        var subLayer = layerInfoLayers[layerInfoLayersIndex];
                        var minScale = subLayer.minScale || 0;
                        var maxScale = subLayer.maxScale || 0;
                        var currentScale = this.map.getScale();
                        var parentLayerId = subLayer.parentLayerId;
                        var padding = 50;
                        if (parentLayerId != -1) {
                            padding += 10;
                        } 
                        
                        var colorStyle = 'color:gray';
                        if (minScale + maxScale > 0) {
                            // Check that the sublayer is displayed on the map. The server
                            // controls whether that's the case or not
                            if (minScale >= currentScale && maxScale <= currentScale) {
                                colorStyle = 'color:white';
                            }
                        } else {
                            // Some sub layers will have a maxScale and minScale of 0. 
                            // This means we base their active/inactive display based on 
                            // the visibility of their parent layer
                            var parentLayer;
                            if (parentLayerId != -1) {
                                // This sublayer has a parent layer that is also a sublayer, 
                                // get its visibility
                                parentLayer = layerInfoLayers[parentLayerId];
                                if (parentLayer.minScale >= currentScale && parentLayer.maxScale <= currentScale) {
                                    colorStyle = 'color:white';
                                }
                            } else {
                                // The parent layer in this case is an actual layr
                                if (layer.calculateInRange()) {
                                    colorStyle = 'color:white';
                                }
                            }
                        }
                        labelText += '<br /><span class="sublayer-name" style="padding-left:'+padding+'px;'+colorStyle+'">'+subLayer.name+'</span>'
                    }
                }
                
                inputElem.id = this.id + "_input_" + layer.id;
                inputElem.name = layer.id;
                inputElem.value = layer.name;
                inputElem.type = "checkbox";
                inputElem.checked = (this.checkState[layer.id] != undefined && this.checkState[layer.id]) || checked;
                labelSpan.innerHTML = labelText;
                labelSpan.style.verticalAlign = "baseline";
                
                var context = {
                    'inputElem': inputElem,
                    'layer': layer,
                    'layerSwitcher': this,
                    'checkState' : this.checkState
                };
                
                OpenLayers.Event.observe(inputElem, 
                    "mouseup", 
                    OpenLayers.Function.bindAsEventListener(this.onInputClick, context)
                    );
                        
                OpenLayers.Event.observe(labelSpan, 
                    "click", 
                    OpenLayers.Function.bindAsEventListener(this.onInputClick, context)
                    );
                
                OpenLayers.Element.addClass(labelSpan, "labelSpan");
                             
                this.dataLayers.push({
                    'layer': layer,
                    'inputElem': inputElem,
                    'labelSpan': labelSpan
                })
                             
                var subGroupSpan = document.createElement("span");
                subGroupSpan.appendChild(inputElem)
                subGroupSpan.appendChild(labelSpan)
                subGroupSpan.appendChild(br)
                
                var groupDiv = this.dataLayersDiv;
                groupDiv.appendChild(subGroupSpan);
            }
        }
        
        return this.div;
    },
    
    loadContents: function() {
        var sz = new OpenLayers.Size(18,18); 
        var imgLocation = OpenLayers.Util.getImagesLocation();
        
        //configure main div
        OpenLayers.Event.observe(this.div, "mouseup", OpenLayers.Function.bindAsEventListener(this.mouseUp, this));
        OpenLayers.Event.observe(this.div, "click", this.ignoreEvent);
        OpenLayers.Event.observe(this.div, "mousedown", OpenLayers.Function.bindAsEventListener(this.mouseDown, this));
        OpenLayers.Event.observe(this.div, "dblclick", this.ignoreEvent);

        // layers list div        
        this.layersDiv = document.createElement("div");
        this.layersDiv.id = this.id + "_layersDiv";
        OpenLayers.Element.addClass(this.layersDiv, "layersDiv");

        this.dataLbl = document.createElement("div");
        this.dataLbl.innerHTML = OpenLayers.i18n("Service Groups");
        OpenLayers.Element.addClass(this.dataLbl, "dataLbl");
        
        this.dataLayersDiv = document.createElement("div");
        OpenLayers.Element.addClass(this.dataLayersDiv, "dataLayersDiv");

        this.layersDiv.appendChild(this.dataLbl);
        this.layersDiv.appendChild(this.dataLayersDiv);
 
        this.div.appendChild(this.layersDiv);
        
        if(this.roundedCorner) {
            OpenLayers.Rico.Corner.round(this.div, {
                corners: "tl bl",
                bgColor: "transparent",
                color: this.roundedCornerColor,
                blend: false
            });
            OpenLayers.Rico.Corner.changeOpacity(this.layersDiv, 0.75);
        }

        // maximize button div
        var img = imgLocation + 'layer-switcher-maximize.png';
        this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
            "OpenLayers_Control_MaximizeDiv", 
            null, 
            sz, 
            img, 
            "absolute");
        OpenLayers.Element.addClass(this.maximizeDiv, "maximizeDiv");
        this.maximizeDiv.style.display = "none";
        OpenLayers.Event.observe(this.maximizeDiv, "click", 
            OpenLayers.Function.bindAsEventListener(this.maximizeControl, this)
            );
        
        this.div.appendChild(this.maximizeDiv);

        // minimize button div
        img = imgLocation + 'layer-switcher-minimize.png';
        this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
            "OpenLayers_Control_MinimizeDiv", 
            null, 
            sz, 
            img, 
            "absolute");
        OpenLayers.Element.addClass(this.minimizeDiv, "minimizeDiv");
        this.minimizeDiv.style.display = "none";
        OpenLayers.Event.observe(this.minimizeDiv, "click", 
            OpenLayers.Function.bindAsEventListener(this.minimizeControl, this)
            );

        this.div.appendChild(this.minimizeDiv);
    },
    
    onInputClick: function(event) {
        if (!this.inputElem.disabled) {
            // Toggle the check
            this.inputElem.checked = !this.inputElem.checked;
            
            // Figure out the layer id from the input element div id 
            var layerId = this.inputElem.id.substring(this.inputElem.id.lastIndexOf('_input_') + 7);
            
            this.checkState[layerId] = this.inputElem.checked;
            
            if (this.layer.CLASS_NAME === 'OpenLayers.Layer') {
                // This layer is not yet initialized so grab the remote info 
                // and initialize it
                this.layer.serviceObject.getRemoteLayerInfo({
                    serviceObject : this.layer.serviceObject,
                    scope : {
                        useTNMLayers : false,
                        autoParseArcGISCache : true,
                        serviceObject : this.layer.serviceObject,
                        layerSwitcher : this.layerSwitcher,
                        layerId : layerId,
                        callbacks : [
                        function(params) {
                            params.scope.layerSwitcher.replaceLayer({
                                layer : params.layer,
                                event : event,
                                layerId : params.scope.layerId
                            })
                        }
                        ]
                    }
                })
            } else {
                // Didn't need a new layer so just update the map 
                this.layerSwitcher.updateMap();
            }
        }
        OpenLayers.Event.stop(event);
    },
    
    multiLayerToggled: function(event) {
        if (event.layer.CLASS_NAME !== 'OpenLayers.Layer') {
            var layer = event.layer;
            if (layer.getVisibility() && !this.checkState[layer.id]) {
                layer.setVisibility(false);
            }
        }
    },
    
    updateMap: function() {
        var parentMultiLayerChecked = true;
        
        // Check the visibility of every layer and set it accordingly
        for(var dataLayersIndex = 0, len=this.dataLayers.length; dataLayersIndex<len; dataLayersIndex++) {
            var layerEntry = this.dataLayers[dataLayersIndex]; 
            var layer = layerEntry.layer;
            
            if (layer.multiLayer) {
                // A multilayer should always be the first layer with all its own
                // layers following
                parentMultiLayerChecked = layerEntry.inputElem.checked;
                layer.setVisibility(parentMultiLayerChecked);
                // Listen to the multilayer's toggle event
                layer.events.unregister("layers_toggled", this, this.multiLayerToggled);
                layer.events.register("layers_toggled", this, this.multiLayerToggled);
            } else {
                // If the parent layer is checked and the layer element is also checked,
                // this layer should be visible
                layer.setVisibility(parentMultiLayerChecked && (layerEntry.inputElem.checked || this.checkState[layer.id]));
            }
            
            // Update the layer states for this layer 
            this.layerStates[dataLayersIndex] = {
                id : layer.id,
                inRange : layer.alwaysInRange || layer.calculateInRange(),
                name : layer.name,
                visibility : layer.getVisibility()
            }
            
        }
    },
    
    replaceLayer : function(params) {
        var incomingLayer = params.layer;
        var map = this.map;
        var outgoingLayerId = params.layerId;
        
        // The map object has multilayers and it has the regular layers that were 
        // inside the multilayers. We want to replace the layer in both places
        for (var mapLayerIndex = 0;mapLayerIndex < map.layers.length;mapLayerIndex++) {
            var mapLayer = map.layers[mapLayerIndex];
            if (mapLayer.CLASS_NAME === 'OpenLayers.Layer.NationalMapMulti') {
                
                // If the layer exists in this multilayer object, it will be 
                // replaced. Otherwise, nothing happens
                var layerIndex = mapLayer.containsLayer('name', incomingLayer.name);
                
                if (layerIndex != -1) {
                    // Go ahead and remove these layers. 
                    // Remove the multilayer and the layer we're going to replace. 
                    this.map.removeLayer(this.map.getLayer(mapLayer.id));
                    this.map.removeLayer(this.map.getLayer(outgoingLayerId));
                    
                    // Only have to drop the incoming layer into the multilayer
                    // object. Once that object is re-added to the map, the incoming
                    // layer comes with it.
                    mapLayer.replaceLayer(incomingLayer);
                    
                    // Update the layerStates object by removing the multiLayer 
                    // object. This will cause a redraw of the layer switcher with
                    // our new layer in there
                    this.layerStates.splice(mapLayerIndex, 1); 
                    
                    // Re-add the  multilayer back to the map. This will cause a 
                    // redraw call on the layer so we don't have to do a map redraw()
                    this.map.addLayer(mapLayer);
                    
                    // The layers get added at the bottom of the layer switcher when it gets
                    // redrawn. Move them to their previous position.
                    this.map.setLayerIndex(mapLayer, mapLayerIndex);
                    this.map.setLayerIndex(incomingLayer, mapLayerIndex + 1 + layerIndex);
                }
            }
        }
        this.showControls(false);
    }
    
// If including our own class name, we have to copy the CSS rules for 
// ".olControlLayerSwitcher" to ".olControlMultiLayerSwitcher".  This responsibility
// falls to the implementing client
//    CLASS_NAME: "OpenLayers.Control.MultiLayerSwitcher"
});
