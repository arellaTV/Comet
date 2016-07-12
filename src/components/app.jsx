class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: pageList,
      currentPage: pageList[0]
    }
    this.getPages = this.getPages.bind(this);
    this.handleClick = this.handleClick.bind(this);
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

  handleClick(event) {
    console.log('this.state.pages', this.state.pages);
    console.log(event.target.id);
    for (var i = 0; i < this.state.pages.length; i++) {
      if (this.state.pages[i]._id === event.target.id)
      this.setState({
        currentPage: this.state.pages[i]
      });
    }
    // var targetIndex = event.target.id;
  }

  render() {
    return (
      <div>
        <h1>Comet!</h1>
        <Pages pages={this.state.pages} handleClick={this.handleClick.bind(this)}/>
        <Canvas layout={this.state.currentPage} />
      </div>
    );
  }
}

window.App = App;
