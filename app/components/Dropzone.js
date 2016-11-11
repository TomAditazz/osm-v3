var React = require('react');
var Dropzone = require('react-dropzone');

var DropzoneDemo = React.createClass({
    onDrop: function (acceptedFiles, rejectedFiles) {
      console.log('Accepted files: ', acceptedFiles);
      console.log('Accepted files: ', acceptedFiles[0].preview);
      console.log('Rejected files: ', rejectedFiles);
            //Initialise the vector layer using OpenLayers.Format.OSM
      layer = new OpenLayers.Layer.Vector("Polygon", {
          strategies: [new OpenLayers.Strategy.Fixed()],
          protocol: new OpenLayers.Protocol.HTTP({
              url: acceptedFiles[0].preview,   //<-- relative or absolute URL to your .osm file
              format: new OpenLayers.Format.OSM()
          }),
          projection: new OpenLayers.Projection("EPSG:4326")
      });
      console.log(layer);
      map.addLayers([layer]);
    },

    render: function () {
      return (
          <div>
            <Dropzone onDrop={this.onDrop}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          </div>
      );
    }
});

module.exports = DropzoneDemo;