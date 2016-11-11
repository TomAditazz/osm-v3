var React = require('react');
var todoStore = require('../stores/todoStore');
var todoActions = require('../actions/todoActions');

var ShowOSM = React.createClass({
  
    componentWillMount() {
      const script = document.createElement("script");

        script.src = "/OSMBuildings.js";
        //script.async = true;

        document.body.appendChild(script);
        console.log(script);
    },
    componentDidMount() {

    },

    initalMap(){ 
      osmb = new OSMBuildings({
        //baseURL: './OSMBuildings',
        zoom: 16,
        minZoom: 16,
        maxZoom: 19,
        position: { latitude:52.52000, longitude:13.41000 },
        state: true, // stores map position/rotation in url
        effects: ['shadows'],
        attribution: '© 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>'
      });
      osmb.appendTo('map');

      osmb.addMapTiles(
        'https://{s}.tiles.mapbox.com/v3/osmbuildings.kbpalbpk/{z}/{x}/{y}.png',
        {
          attribution: '© Data <a href="https://openstreetmap.org/copyright/">OpenStreetMap</a> · © Map <a href="https://mapbox.com/">Mapbox</a>'
        }
      );
    },

    addBuilding(){
      osmb.addGeoJSONTiles('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');
      osmb.on('pointermove', function(e) {
        osmb.getTarget(e.detail.x, e.detail.y, function(id) {
          if (id) {
            osmb.highlight(id, '#f08000');
          } else {
            osmb.highlight(null);
          }
        });
      });

    },
    interAction(){

    },
  render: function(){
    return (
      <div className="col-sm-6">
        <div className="col-sm-12">
          <div id="map" onmouseover={this.interAction}>
            <button type="button" onClick={this.initalMap}>Inital Map</button>
            <button type="button" onClick={this.addBuilding}>Add Building</button>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = ShowOSM;