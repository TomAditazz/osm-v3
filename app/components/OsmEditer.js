var React = require('react');
var todoStore = require('../stores/todoStore');
var todoActions = require('../actions/todoActions');
var Dropzonedemo = require('./Dropzone.js');
var Dropjsondemo = require('./Dropjson.js');
var choose2del;
var choose2rename;

var OsmEditer = React.createClass({

    componentWillMount() {

      const script = document.createElement("script");
      script.src = "https://openlayers.org/en/v3.19.1/build/ol.js";
      //script.async = true;
      document.body.appendChild(script);
      console.log(script);

    },
    componentDidMount() {

    },
    initialMap(){

    },

    updateLayers(){

    },

    editMap(){
      var typeSelect = document.getElementById('type');
      interactions = new ol.interaction.Draw({
        source: sSource,
      });
      //var draw; // global so we can remove it later

      this.modifyFeature();
      function addInteraction() {
        var value = typeSelect.value;
        if (value !== 'None') {
          map.removeInteraction(interactions);
          map.removeInteraction(select);
          interactions = new ol.interaction.Draw({
            source: sSource,
            type: /** @type {ol.geom.GeometryType} */ (typeSelect.value)
          });
          interactions.on('drawend', function (e) {
            var id = Math.floor((1 + Math.random()) * 0x10000).toString(16);
            e.feature.featureID = id;
            e.feature.setProperties({
                'id': id,
                'name': 'new zone',
            })
            console.log(e.feature);
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
      map.removeInteraction(interactions);
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
              if (action === 'yes') {
                console.log(SelectedFeature);
                select.getFeatures().remove(SelectedFeature);
                slayer.getSource().removeFeature(SelectedFeature);
              }
              e.preventDefault();
          }
      }, false);
    },

    renameFeature(){
      map.un('click', choose2del);
      var popup = new ol.Overlay.Popup();
      map.addOverlay(popup);
      select = new ol.interaction.Select({
        layers: [slayer],
      });
      map.addInteraction(select);
      doRename = function(){
        console.log("hello");
        popup.hide();
      };
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
            el.appendChild(input);

            var btn = document.createElement("button");
            btn.setAttribute("onClick", doRename);
            el.appendChild(btn);

            popup.show(evt.coordinate, el);

            console.log(feature.featureID);
        }, null, function(layer){
            return layer == slayer;
        });
      };

      map.on('click', choose2rename);

    },

  render: function(){
    return (
      <div className="col-sm-6">
        <div className="col-sm-12">
          <Dropzonedemo />
          <Dropjsondemo />
          <div id="map" class="map">
            <button type="button" onClick={this.editMap}>Edit Map</button>  
            <form class="form-inline">
              <label>Add &nbsp;</label>
              <select id="type">
                <option value="None">None</option>
                <option value="Point">Point</option>
                <option value="LineString">LineString</option>
                <option value="Polygon">Polygon</option>
              </select>
              <button type="button" onClick={this.modifyFeature}>Edit Feature</button>
              <button type="button" onClick={this.moveFeature}>Move Feature</button>
              <button type="button" onClick={this.delFeature}>Delete Feature</button> 
              <button type="button" onClick={this.renameFeature}>Rename Feature</button>        
              <button type="button" onClick={this.exportMap}>Output Map</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = OsmEditer;