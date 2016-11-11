var React = require('react');
var todoStore = require('../stores/todoStore');
var todoActions = require('../actions/todoActions');
var Dropzonedemo = require('./Dropzone.js');

var OsmEditer = React.createClass({
  
    componentWillMount() {
      const script = document.createElement("script");

        script.src = "http://openlayers.org/api/OpenLayers.js";
        //script.async = true;

        document.body.appendChild(script);
        console.log(script);
    },
    componentDidMount() {

    },
    initialMap(){
      var lat=50.88;
      var lon=-1.54;
      var zoom=13;

      map = new OpenLayers.Map ("map", {
        controls:[
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.Attribution()],
        maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
        maxResolution: 156543.0399,
        numZoomLevels: 19,
        units: 'm',
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326")
      });
      map.addLayer(new OpenLayers.Layer.OSM());
 
      var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
      
      map.setCenter (lonLat, zoom);
    },

    updateLayers(){
      //Initialise the vector layer using OpenLayers.Format.OSM
      var layer = new OpenLayers.Layer.Vector("Polygon", {
          strategies: [new OpenLayers.Strategy.Fixed()],
          protocol: new OpenLayers.Protocol.HTTP({
              url: "test.osm",   //<-- relative or absolute URL to your .osm file
              format: new OpenLayers.Format.OSM()
          }),
          projection: new OpenLayers.Projection("EPSG:4326")
      });
      map.addLayers([layer]);
    },

    editMap(){
      layer.destroy();
      vlayer = new OpenLayers.Layer.Vector( "Editable", {
          strategies: [new OpenLayers.Strategy.Fixed()],
          protocol: new OpenLayers.Protocol.HTTP({
              url: "test.osm",   //<-- relative or absolute URL to your .osm file
              format: new OpenLayers.Format.OSM()
          }),
          projection: new OpenLayers.Projection("EPSG:4326")
      });
      map.addLayer(vlayer);
      zb = new OpenLayers.Control.ZoomBox({
          title: "Zoom box: zoom clicking and dragging",
          text: "Zoom"
      });

      var panel = new OpenLayers.Control.Panel({
          defaultControl: zb,
          createControlMarkup: function(control) {
              var button = document.createElement('button'),
                  iconSpan = document.createElement('span'),
                  textSpan = document.createElement('span');
              iconSpan.innerHTML = '&nbsp;';
              button.appendChild(iconSpan);
              if (control.text) {
                  textSpan.innerHTML = control.text;
              }
              button.appendChild(textSpan);
              return button;
          }
      });

      panel.addControls([
          zb,
          new OpenLayers.Control.DrawFeature(vlayer, OpenLayers.Handler.Path,
              {title:'Draw line', text: 'Line'}),
          new OpenLayers.Control.DrawFeature(vlayer, OpenLayers.Handler.Polygon,
              {title:'Draw Polygon', text: 'Polygon'}),
          //new OpenLayers.Control.ZoomToMaxExtent({
          //    title:"Zoom to the max extent",
          //    text: "World"
          //}),
          //new OpenLayers.Control.DrawFeature.cancle(),
      ]);
      
      nav = new OpenLayers.Control.NavigationHistory({
          previousOptions: {
              title: "Go to previous map position",
              text: "Prev"
          },
          nextOptions: {
              title: "Go to next map position",
              text: "Next"
          },
          displayClass: "navHistory"
      });
      // parent control must be added to the map
      map.addControl(nav);
      panel.addControls([nav.next, nav.previous]);
      
      map.addControl(panel);
    },

  render: function(){
    var options={
        baseUrl:'http://127.0.0.1:3000/',
        param:{
            fid:0
        }
    }
    return (
      <div className="col-sm-6">
        <div className="col-sm-12">
          <Dropzonedemo />
          <div id="map">
            <button type="button" onClick={this.initialMap}>Initial Map</button>
            <button type="button" onClick={this.editMap}>Edit Map</button>
            <button type="button">Output Map</button>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = OsmEditer;