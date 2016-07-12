// var ReactGridLayout = require('react-grid-layout');

var Canvas = React.createClass({
  render: function() {
    var layout = [
      {i: 'a', x: 0, y: 0, w: 1, h: 2},
      {i: 'b', x: 1, y: 0, w: 3, h: 2},
      {i: 'c', x: 4, y: 0, w: 1, h: 2}
    ];
    return (
      <ReactGridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
        <div style={{'backgroundColor': 'blue'}} key={'a'}>a</div>
        <div style={{'backgroundColor': 'green'}} key={'b'}>b</div>
        <div style={{'backgroundColor': 'red'}} key={'c'}>c</div>
      </ReactGridLayout>
    )
  }
});

window.Canvas = Canvas;
// <div></div>
