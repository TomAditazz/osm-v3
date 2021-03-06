var React = require('react');
var Dropzone = require('react-dropzone');


var DropzoneDemo = React.createClass({
    onDrop: function (acceptedFiles, rejectedFiles) {
      //console.log('Accepted files: ', acceptedFiles);
      //console.log('Accepted files: ', acceptedFiles[0].preview);
      //console.log('Rejected files: ', rejectedFiles);
      //Initialise the vector layer using OpenLayers.Format.OSM
      // var lat=50.88048782209884;
      // var lon=-1.54420135;
      var zoom=13;
      var vectorSource = new ol.source.Vector({
        url: acceptedFiles[0].preview,
        format: new ol.format.OSMXML()
      });

      osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: false
      });
      gmLayer = new olgm.layer.Google({
        mapTypeId: google.maps.MapTypeId.SATELLITE,
      });
      var fill = new ol.style.Fill({
        //color: 'rgba(255, 204, 51, 0.2)'
        color: 'rgba(170, 170, 170, 0.2)'
      });
      var stroke = new ol.style.Stroke({
        //color: '#ffcc33',
        color: '#aaaaaa',
        width: 1
      });
      map = new ol.Map({
        interactions: ol.interaction.defaults().extend([
          new ol.interaction.DragRotateAndZoom()
        ]),
        //interactions: olgm.interaction.defaults(),
        layers: [
          gmLayer,
          osmLayer,
          new ol.layer.Vector({
            source: vectorSource,
            projection: 'EPSG:3857',
            style: new ol.style.Style({
              fill: fill,
              stroke: stroke,
              image: new ol.style.Circle({
                fill: fill,
                stroke: stroke,
                radius: 3
              }),
            })
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
          //var numFeatures = source.getFeatures().length; 
          map.getView().fit(
                vectorSource.getExtent(),(map.getSize())
          );   
          var olGM = new olgm.OLGoogleMaps({map: map}); // map is the ol.Map instance
          olGM.activate();
        }
      });

      // const scriptpop = document.createElement("script");
      // scriptpop.src = "./ol3-popup.js";
      // document.body.appendChild(scriptpop);
      // console.log(scriptpop);

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