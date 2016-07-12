// var ReactGridLayout = require('react-grid-layout');

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render () {
    return (
      <div>
        <h1>Canvas</h1>
        <button>Add Panel</button>
        <ReactGridLayout className="layout" layout={this.props.layout} cols={12} rowHeight={30} width={1200}>
          {this.props.layout.map(box =>
            <div style={{background: 'url(' + box.path + ') center / cover'}} key={box.i}><ImageUpload/></div>
          )}
        </ReactGridLayout>
      </div>
    )
  }
};

window.Canvas = Canvas;
