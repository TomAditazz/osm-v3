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

      sSource = new ol.source.Vector({
        url: acceptedFiles[0].preview,
        format: new ol.format.GeoJSON(),
      });
      slayer = new ol.layer.Vector({
        source: sSource,
      });
      map.addLayer(slayer);
      //console.log(slayer);
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