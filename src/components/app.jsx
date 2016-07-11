class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: []
    }
    // this.getPages = this.getPages.bind(this);
  }

  componentDidMount() {
    this.getPages();
  }

  getPages() {
    fetch('/pages')
      .then((response) => response.json())
      .then((responseJSON) => {
        this.setState({
          pages: responseJSON
        });
        console.log(Array.isArray(responseJSON), responseJSON);
      }).catch((error) => { console.error(error); });
  }

  render() {
    return (
      <div>
        <h1>Comet!</h1>
        <Pages pages={this.state.pages}/>
        <Canvas />
      </div>
    );
  }
}

window.App = App;
