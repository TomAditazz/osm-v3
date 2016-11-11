var React = require('react');
var ReactDom = require('react-dom');
var ListContainer = require('./components/ListContainer');
var OsmEditer = require('./components/OsmEditer');
var ShowOSM = require('./components/ShowOSM');

var App = React.createClass({
  render: function(){
    return (
      <div className="container">
        <div className="row">
          <OsmEditer />
        </div>
      </div>
    )
  }
});

ReactDom.render(
  <App />,
  document.getElementById('app')
)