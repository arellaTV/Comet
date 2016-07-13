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
    this.setState({
      currentPage: this.state.pages[0]
    });
  }

  getPages() {
    fetch('/pages')
      .then((response) => response.json())
      .then((responseJSON) => {
        this.setState({
          pages: responseJSON,
          
        });
        console.log(Array.isArray(responseJSON), responseJSON);
      }).catch((error) => { console.error(error); });
  }

  handleClick(event) {
    for (var i = 0; i < this.state.pages.length; i++) {
      if (this.state.pages[i]._id === event.target.id)
      this.setState({
        currentPage: this.state.pages[i]
      });
    }
  }

  render() {
    return (
      <div>
        <h1 onClick={this.getPages.bind(this)}>Comet!</h1>
        <Pages pages={this.state.pages} handleClick={this.handleClick.bind(this)}/>
        <Canvas layout={this.state.currentPage} getPages={this.getPages.bind(this)} />
      </div>
    );
  }
}

window.App = App;
