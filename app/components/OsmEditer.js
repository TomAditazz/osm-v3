var React = require('react');
var todoStore = require('../stores/todoStore');
var todoActions = require('../actions/todoActions');
var Dropzonedemo = require('./Dropzone.js');
var Dropjsondemo = require('./Dropjson.js');
var choose2del;
var choose2rename;
var select;
var interactions;

var OsmEditer = React.createClass({

    componentWillMount() {
      // const script = document.createElement("script");
      // script.src = "https://openlayers.org/en/v3.19.1/build/ol.js";
      // //script.async = true;
      // document.body.appendChild(script);
      // console.log(script);

      // const scriptgm = document.createElement("script");
      // scriptgm.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCtm3GMrDD5XYcHnvX3JCgL9n9u2UDcITw";
      // //script.async = true;
      // document.body.appendChild(scriptgm);
      // console.log(scriptgm);
      const scriptol3gm = document.createElement("script");
      scriptol3gm.src = "./ol3gm.js";
      //script.async = true;
      document.body.appendChild(scriptol3gm);
      console.log(scriptol3gm);

    },
    componentDidMount() {

    },
    // initialMap(){

    // },

    // updateLayers(){

    // },

    editMap(){
      map.removeInteraction(select);
      map.un('click', choose2del);
      map.un('click', choose2rename);

      this.getview();
      map.on("moveend", function() {
        var center = ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
        document.getElementById("lon").value = center[0];
        document.getElementById("lat").value = center[1];
        document.getElementById("zoom").value = map.getView().getZoom();
      });
      var typeSelect = document.getElementById('type');
      interactions = new ol.interaction.Draw({
        source: sSource,
      });

      //this.modifyFeature();
      function addInteraction() {
        var value = typeSelect.value;
        if (value !== 'Pan') {
          map.removeInteraction(interactions);
          map.removeInteraction(select);
          interactions = new ol.interaction.Draw({
            source: sSource,
            type: /** @type {ol.geom.GeometryType} */ (typeSelect.value)
          });
          interactions.on('drawend', function (e) {
            var id = Math.floor((1 + Math.random()) * 0x10000).toString(16);
            var type = (typeSelect.value == 'Polygon') ? 'Zone' : 'Road';
            e.feature.featureID = id;
            e.feature.setProperties({
                'id': id,
                'name': 'new ' + type,
                'type': type
            })
            console.log(e.feature.getProperties());
            document.getElementById("type").selectedIndex = 0;
            map.removeInteraction(interactions);
          });
          map.addInteraction(interactions);
        }else{
          map.removeInteraction(interactions);
          interactions = new ol.interaction.Select({
                layers: [slayer],
          });
          map.addInteraction(interactions);        
        }
      }

      /**
       * Handle change event.
       */
      typeSelect.onchange = function() {
        map.removeInteraction(interactions);
        addInteraction();
      };

      addInteraction();
    },

    exportMap(){
      var allFeatures = slayer.getSource().getFeatures();
      //console.log(allFeatures);
      var format = new ol.format.GeoJSON();
      var routeFeatures = format.writeFeatures(allFeatures,{
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
      console.log(routeFeatures);
    },

    modifyFeature(){
      map.un('click', choose2del);
      map.un('click', choose2rename);
      map.removeInteraction(interactions);
      map.removeInteraction(select);
      select = new ol.interaction.Select({
            layers: [slayer],
      });
      interactions = new ol.interaction.Modify({
        features: select.getFeatures(),
      });
      map.addInteraction(select);
      map.addInteraction(interactions);
    },

    moveFeature(){
      map.un('click', choose2del);
      map.un('click', choose2rename);
      map.removeInteraction(interactions);
      map.removeInteraction(select);
      select = new ol.interaction.Select({
            layers: [slayer],
      });
      interactions = new ol.interaction.Translate({
        features: select.getFeatures(),
      });
      console.log(interactions);
      map.addInteraction(select);
      map.addInteraction(interactions);
    },

    delFeature(){
      map.un('click', choose2rename);
      map.removeInteraction(select);
      map.removeInteraction(interactions);
      var popup = new ol.Overlay.Popup();
      map.addOverlay(popup);
      select = new ol.interaction.Select({
        layers: [slayer],
      });
      map.addInteraction(select);
      choose2del = function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature, slayer) {
            SelectedFeature = feature;
            var el = document.createElement("div");
            var title = document.createElement("h3");
            title.innerHTML = 'Delete ' + feature.getProperties().name + ' ?';
            el.appendChild(title);
            var content = document.createElement("p");
            content.innerHTML = '<a href="#" data-action="yes">Yes</a>, <a href="#" data-action="no">No</a>';
            el.appendChild(content);
            popup.show(evt.coordinate, el);
            console.log(feature.featureID);
        }, null, function(layer){
            return layer == slayer;
        });
      };
      map.on('click', choose2del);
      popup.getElement().addEventListener('click', function(e) {
          var action = e.target.getAttribute('data-action');
          if (action) {
              //alert('You choose: ' + action);
              popup.hide();
              //map.removeOverlay(popup);
              if (action === 'yes') {
                console.log(SelectedFeature);
                select.getFeatures().remove(SelectedFeature);
                slayer.getSource().removeFeature(SelectedFeature);
              }
              e.preventDefault();
          }
      }, false);
    },
    toggle(){
      gmLayer.setVisible(!gmLayer.getVisible());
      osmLayer.setVisible(!osmLayer.getVisible());
    },

    renameFeature(){
      map.un('click', choose2del);
      map.removeInteraction(select);
      map.removeInteraction(interactions);
      var popup = new ol.Overlay.Popup();
      map.addOverlay(popup);
      select = new ol.interaction.Select({
        layers: [slayer],
      });
      map.addInteraction(select);


      choose2rename = function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature, slayer) {
            SelectedFeature = feature;

            var el = document.createElement("div");

            var title = document.createElement("h3");
            title.innerHTML = 'Rename: ';
            el.appendChild(title);

            var input = document.createElement("input");
            var name = SelectedFeature.getProperties().name;
            input.setAttribute("placeholder", name);
            input.setAttribute("value", name);
            input.id = "nameinput";
            el.appendChild(input);

            doRename = function(){
              console.log(document.getElementById("nameinput").value);
              SelectedFeature.setProperties({
                'name' : document.getElementById("nameinput").value
              });
              console.log("hello");
              popup.hide();
              //map.removeOverlay(popup);
              select.getFeatures().remove(SelectedFeature);
            };

            var btn = document.createElement("button");
            btn.innerHTML = 'submit';
            btn.onclick = doRename;
            el.appendChild(btn);

            popup.show(evt.coordinate, el);

            console.log(feature.featureID);
        }, null, function(layer){
            return layer == slayer;
        });
      };
      map.on('click', choose2rename);

    },
    getview(){
      //console.log(map.getView().getCenter());
      //var t = map.getView().getCenter();
      //
      
      // console.log(center);

      //working code
      var center = ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
      document.getElementById("lon").value = center[0];
      document.getElementById("lat").value = center[1];
      document.getElementById("zoom").value = map.getView().getZoom();
      //end of working code
    },

    setview(){
      
      //working code
      var lonn = parseFloat(document.getElementById("lon").value);
      var latt = parseFloat(document.getElementById("lat").value);
      var center = ol.proj.transform([lonn, latt], 'EPSG:4326', 'EPSG:3857');
      var zoom = parseFloat(document.getElementById("zoom").value);
      map.getView().setCenter(center);
      map.getView().setZoom(zoom);
      //end of working code
    },

  render: function(){
    return (
      <div>
        <div className="col-sm-12">
          <div className="col-sm-6">
            <Dropzonedemo />
          </div>
          <div className="col-sm-6">
            <Dropjsondemo />
          </div>  
          <div id="map">
            <button type="button" onClick={this.editMap}>Edit Map</button>  
            <form class="form-inline">
              <label>Add &nbsp;</label>
              <select id="type">
                <option value="Pan">Pan</option>
                <option value="LineString">Road</option>
                <option value="Polygon">Zone</option>
              </select>
              <button type="button" onClick={this.modifyFeature}>Edit Feature</button>
              <button type="button" onClick={this.moveFeature}>Move Feature</button>
              <button type="button" onClick={this.delFeature}>Delete Feature</button> 
              <button type="button" onClick={this.renameFeature}>Rename Feature</button>        
              <button type="button" onClick={this.exportMap}>Output Map</button>
              <button type="button" onClick={this.toggle}>Toggle</button>
            </form>
            <div>
              <input type="text" placeholder="lon" id="lon"></input>
              <input type="text" placeholder="lat" id="lat"></input>
              <input type="text" placeholder="Zoom" id="zoom"></input>
              <button type="button" onClick={this.getview}>Get View</button>
              <button type="button" onClick={this.setview}>Set View</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = OsmEditer;