
OpenLayers.Control.MultiLayerSwitcher =  OpenLayers.Class(OpenLayers.Control.LayerSwitcher, {
    
    initialize: function(options) {
        OpenLayers.Util.applyDefaults(this, options);
        OpenLayers.Control.LayerSwitcher.prototype.initialize.apply(this, arguments);
    },
    
    redraw: function() {
        var len = this.map.layers.length;
        var layers = this.map.layers.slice();
        
        //if the state hasn't changed since last redraw, no need 
        // to do anything. Just return the existing div.
        if (!this.checkRedraw()) { 
            return this.div; 
        } 

        //clear out previous layers 
        this.clearLayersArray("base");
        this.clearLayersArray("data");
        
        // Save state -- for checking layer if the map state changed.
        // We save this before redrawing, because in the process of redrawing
        // we will trigger more visibility changes, and we want to not redraw
        // and enter an infinite loop.
        this.layerStates = new Array(len);
        for (var i=0; i <len; i++) {
            var layer = this.map.layers[i];
            this.layerStates[i] = {
                'name': layer.name + isMultiLayer, 
                'visibility': layer.visibility,
                'inRange': layer.inRange,
                'id': layer.id
            };
        }    

        if (!this.ascending) {
            layers.reverse();
        }
        
        for(var i=0, len=layers.length; i<len; i++) {
            layer = layers[i];
            var isMultiLayer = layer.CLASS_NAME === 'OpenLayers.Layer.NationalMapMulti';

            if (layer.displayInLayerSwitcher) {
                // We can check this if the layer type is multilayer or if the 
                // layer has visibility
                var checked = isMultiLayer || layer.getVisibility();
    
                // create input element
                var inputElem = document.createElement("input");
                inputElem.id = this.id + "_input_" + layer.name;
                inputElem.name = (isMultiLayer) ? this.id + "_baseLayers" : layer.name;
                inputElem.type = "checkbox";
                inputElem.value = layer.name;
                inputElem.checked = checked;
                inputElem.defaultChecked = checked;

                if (!isMultiLayer && !layer.inRange) {
                    inputElem.disabled = true;
                }
                var context = {
                    'inputElem': inputElem,
                    'layer': layer,
                    'layerSwitcher': this
                };
                OpenLayers.Event.observe(inputElem, "mouseup", 
                    OpenLayers.Function.bindAsEventListener(this.onInputClick,
                        context)
                    );
                
                // create span
                var labelSpan = document.createElement("span");
                OpenLayers.Element.addClass(labelSpan, "labelSpan");
                if (!isMultiLayer && !layer.inRange) {
                    labelSpan.style.color = "gray";
                }
                labelSpan.innerHTML = layer.name + (isMultiLayer ? " (ServiceGroup)" : "");
                labelSpan.style.verticalAlign = (isMultiLayer) ? "bottom"  : "baseline";
                if (isMultiLayer) {
                    labelSpan.style.textDecoration = "underline";
                }
                OpenLayers.Event.observe(labelSpan, "click", 
                    OpenLayers.Function.bindAsEventListener(this.onInputClick,
                        context)
                    );
                // create line break
                var br = document.createElement("br");
                
                var groupArray = this.dataLayers;
                groupArray.push({
                    'layer': layer,
                    'inputElem': inputElem,
                    'labelSpan': labelSpan
                });
                                                     
    
                var groupDiv = this.dataLayersDiv;
                groupDiv.appendChild(inputElem);
                groupDiv.appendChild(labelSpan);
                groupDiv.appendChild(br);
            }
        }

        // if no overlays, dont display the overlay label
        this.dataLbl.style.display = "";        
        
        // if no baselayers, dont display the baselayer label
        this.baseLbl.style.display = "none";        

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

        this.baseLbl = document.createElement("div");
        this.baseLbl.innerHTML = OpenLayers.i18n("Base Layer");
        OpenLayers.Element.addClass(this.baseLbl, "baseLbl");
        
        this.baseLayersDiv = document.createElement("div");
        OpenLayers.Element.addClass(this.baseLayersDiv, "baseLayersDiv");

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
    
    onInputClick: function(e) {
        if (!this.inputElem.disabled) {
            this.inputElem.checked = !this.inputElem.checked;
            this.layerSwitcher.updateMap();
        }
        OpenLayers.Event.stop(e);
    },
    
    updateMap: function() {
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
