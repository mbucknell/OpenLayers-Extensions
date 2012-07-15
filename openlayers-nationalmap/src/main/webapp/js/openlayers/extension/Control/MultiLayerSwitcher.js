
OpenLayers.Control.MultiLayerSwitcher =  OpenLayers.Class(OpenLayers.Control.LayerSwitcher, {
    
    initialize: function(options) {
        OpenLayers.Util.applyDefaults(this, options);
        OpenLayers.Control.LayerSwitcher.prototype.initialize.apply(this, arguments);
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
        // We save this before redrawing, because in the process of redrawing
        // we will trigger more visibility changes, and we want to not redraw
        // and enter an infinite loop.
        this.layerStates = new Array(layersLength);
        for (var layersIndex=0; layersIndex <layersLength; layersIndex++) {
            var layer = this.map.layers[layersIndex];
            this.layerStates[layersIndex] = {
                'name': layer.name, 
                'visibility': layer.visibility,
                'inRange': layer.inRange,
                'id': layer.id
            };
        }    
        
        for(var layersIndex=0; layersIndex<layers.length; layersIndex++) {
            layer = layers[layersIndex];
            var isMultiLayer = layer.multiLayer;
            var br = document.createElement("br");
            var labelSpan = document.createElement("span");
            var inputElem = document.createElement("input");
            
            if (layer.displayInLayerSwitcher) {
                if (isMultiLayer) {
                    labelSpan.style.textDecoration = "underline";
                } else {
                    labelSpan.style.paddingLeft = '20px';
                    if (!layer.inRange) {
                        labelSpan.style.color = "gray";
                        inputElem.disabled = true;
                    }
                }
                
                // We can check this if the layer type is multilayer or if the 
                // layer has visibility
                var checked = (isMultiLayer && layer.getVisibility()) || layer.getVisibility();
    
                inputElem.id = this.id + "_input_" + layer.id;
                inputElem.name = layer.id;
                inputElem.value = layer.name;
                inputElem.type = "checkbox";
                inputElem.checked = checked;
                inputElem.defaultChecked = checked;
                labelSpan.innerHTML = layer.name;
                labelSpan.style.verticalAlign = "baseline";
                
                var context = {
                    'inputElem': inputElem,
                    'layer': layer,
                    'layerSwitcher': this
                };
                
                OpenLayers.Event.observe(inputElem, "mouseup", 
                    OpenLayers.Function.bindAsEventListener(this.onInputClick,
                        context)
                    );
                        
                OpenLayers.Event.observe(labelSpan, "click", 
                    OpenLayers.Function.bindAsEventListener(this.onInputClick,
                        context)
                    );
                
                OpenLayers.Element.addClass(labelSpan, "labelSpan");
                
                var groupArray = this.dataLayers;
                groupArray.push({
                    'layer': layer,
                    'inputElem': inputElem,
                    'labelSpan': labelSpan
                });
                                      
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

        var imgLocation = OpenLayers.Util.getImagesLocation();
        var sz = new OpenLayers.Size(18,18);        

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
        var img = imgLocation + 'layer-switcher-minimize.png';
        var sz = new OpenLayers.Size(18,18);        
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
            this.inputElem.checked = !this.inputElem.checked;
            this.layerSwitcher.updateMap(
                // Not used for now
                //            {
                //                event : event,
                //                layer : this.layer,
                //                checked : this.inputElem.checked
                //            }
                );
        }
        OpenLayers.Event.stop(event);
    },
    
    updateMap: function(params) {
        // Not used for now
        //        var event = params.event || null;
        //        var layer = params.layer || null;
        //        var checked = params.checked || null;
        var parentMultiLayerChecked = true;
        
        for(var i=0, len=this.dataLayers.length; i<len; i++) {
            var layerEntry = this.dataLayers[i]; 
            if (layerEntry.layer.multiLayer) {
                parentMultiLayerChecked = layerEntry.inputElem.checked;
                layerEntry.layer.setVisibility(layerEntry.inputElem.checked);
                layerEntry.inputElem.checked = layerEntry.inputElem.checked;
            } else {
                layerEntry.layer.setVisibility(parentMultiLayerChecked && layerEntry.inputElem.checked);
            }
        }
    }
    
// If including our own class name, we have to copy the CSS rules for 
// ".olControlLayerSwitcher" to ".olControlMultiLayerSwitcher".  This responsibility
// falls to the implementing client
//    CLASS_NAME: "OpenLayers.Control.MultiLayerSwitcher"
});
