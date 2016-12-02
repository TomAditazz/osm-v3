var React = require('react');
var Dropzone = require('react-dropzone');

var DropjsonDemo = React.createClass({
    onDrop: function (acceptedFiles, rejectedFiles) {

      //console.log('Accepted files: ', acceptedFiles);
      //console.log('Accepted files: ', acceptedFiles[0].preview);
      //console.log('Rejected files: ', rejectedFiles);
            //Initialise the vector layer using OpenLayers.Format.OSM
      var lat=50.88;
      var lon=-1.54;
      var zoom=13;
      var fill = new ol.style.Fill({
        color: 'rgba(0, 119, 238, 0.2)',
        //color: 'rgba(170, 170, 170, 0.2)'
      });
      var stroke = new ol.style.Stroke({
        color: '#0077EE',
        //color: '#aaaaaa',
        width: 2
      });
      sSource = new ol.source.Vector({
        url: acceptedFiles[0].preview,
        format: new ol.format.GeoJSON(),
      });
      slayer = new ol.layer.Vector({
        source: sSource,
        style: new ol.style.Style({
          fill: fill,
          stroke: stroke,
          image: new ol.style.Circle({
            fill: fill,
            stroke: stroke,
            radius: 3
          }),
        })
      });
      map.addLayer(slayer);
    },

    render: function () {

      return (
          <div>
            <Dropzone onDrop={this.onDrop}>
              <div>json files</div>
            </Dropzone>
          </div>
      );
    }
});

module.exports = DropjsonDemo;