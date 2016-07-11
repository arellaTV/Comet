class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: { title: 'Jay' }
    }
    this.getPages = this.getPages.bind(this);
  }

  componentDidMount() {
    this.getPages();
  }

  getPages() {
    fetch('/pages')
      .then((response) => response.json())
      .then((responseJSON) => { this.setState({
          data: responseJSON[0]
        })
      }).catch((error) => { console.error(error); });
  }

  render() {
    return (
      <div>
        <h1>{this.state.data.title}</h1>
        <Pages />
        <Canvas />
      </div>
    );
  }
}

window.App = App;
