var React = require('react');
var todoStore = require('../stores/todoStore');
var todoActions = require('../actions/todoActions');
var Dropzonedemo = require('./Dropzone.js');
var Dropjsondemo = require('./Dropjson.js');

var OsmEditer = React.createClass({
  
    componentWillMount() {
      const script = document.createElement("script");

        script.src = "https://openlayers.org/en/v3.19.1/build/ol.js";
        //script.async = true;
        document.body.appendChild(script);
        const scriptfile = document.createElement("script");

        scriptfile.src = "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js";
        //script.async = true;
        document.body.appendChild(scriptfile);
        console.log(script);
    },
    componentDidMount() {

    },
    initialMap(){

    },

    updateLayers(){

    },

    editMap(){
      //var editorSource = new ol.source.Vector({
        //url: "scenario.geojson",
      //  format: new ol.format.GeoJSON()
      //});
     
      //editlayer = new ol.layer.Vector({
      //  source: editorSource,
      //  projection: 'EPSG:3857'
      //})
      //map.addLayer(editlayer);
      var typeSelect = document.getElementById('type');

      var draw; // global so we can remove it later
      function addInteraction() {
        var value = typeSelect.value;
        if (value !== 'None') {
          draw = new ol.interaction.Draw({
            source: sSource,
            type: /** @type {ol.geom.GeometryType} */ (typeSelect.value)
          });
          map.addInteraction(draw);
        }
      }


      /**
       * Handle change event.
       */
      typeSelect.onchange = function() {
        map.removeInteraction(draw);
        addInteraction();
      };

      addInteraction();
    },

    exportMap(){
      var allFeatures = slayer.getSource().getFeatures();
      console.log(allFeatures);
      var format = new ol.format.GeoJSON();
      var routeFeatures = format.writeFeatures(allFeatures,{
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
      console.log(routeFeatures);
    },

  render: function(){
    return (
      <div className="col-sm-6">
        <div className="col-sm-12">
          <Dropzonedemo />
          <Dropjsondemo />
          <a id="export-png" class="btn btn-default">
            <i class="fa fa-download"></i> Download PNG</a>
          <div id="map" class="map">
            <button type="button" onClick={this.editMap}>Edit Map</button>  
            <form class="form-inline">
              <label>Geometry type &nbsp;</label>
              <select id="type">
                <option value="Point">Point</option>
                <option value="LineString">LineString</option>
                <option value="Polygon">Polygon</option>
                <option value="Circle">Circle</option>
                <option value="None">None</option>
              </select>
              <button type="button" onClick={this.exportMap}>Output Map</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = OsmEditer;