var React = require('react');
var Dropzone = require('react-dropzone');

var DropzoneDemo = React.createClass({
    onDrop: function (acceptedFiles, rejectedFiles) {
      //console.log('Accepted files: ', acceptedFiles);
      //console.log('Accepted files: ', acceptedFiles[0].preview);
      //console.log('Rejected files: ', rejectedFiles);
      //Initialise the vector layer using OpenLayers.Format.OSM
      // var lat=50.88;
      // var lon=-1.54;
      var zoom=13;
      var vectorSource = new ol.source.Vector({
        url: acceptedFiles[0].preview,
        format: new ol.format.OSMXML()
      });


      map = new ol.Map({
        interactions: ol.interaction.defaults().extend([
          new ol.interaction.DragRotateAndZoom()
        ]),
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM(),
          }),
          new ol.layer.Vector({
            source: vectorSource,
            projection: 'EPSG:3857'
          })
        ],
        target: 'map',
        view: new ol.View({
          //projection: 'EPSG:3857',
          //center: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
          center: [0, 0],
          maxZoom: 19,
          zoom: 13
        })
      });

      vectorSource.on('change', function(evt){
        var source = evt.target;
        if (source.getState() === 'ready') {
          var numFeatures = source.getFeatures().length; 
          map.getView().fit(
                vectorSource.getExtent(),(map.getSize())
          );    
        }
      });

      const scriptpop = document.createElement("script");
      scriptpop.src = "./ol3-popup.js";
      document.body.appendChild(scriptpop);
      console.log(scriptpop);
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