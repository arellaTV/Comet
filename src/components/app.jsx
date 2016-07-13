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
      currentPage: this.state.currentPage
    });
  }

  getPages() {
    fetch('/pages')
      .then((response) => response.json())
      .then((responseJSON) => {
        this.setState({
          pages: responseJSON,
          currentPage: this.state.currentPage
        });
        console.log(Array.isArray(responseJSON), responseJSON);
      }).catch((error) => { console.error(error); });
  }

  handleClick(event) {
    debugger;
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
        <Nav/>
        <div className="container">
          <div className="row-fluid">
            <div className="col2">
              <Pages pages={this.state.pages} handleClick={this.handleClick.bind(this)}/>
            </div>
            <div className="col10">
              <Canvas layout={this.state.currentPage} getPages={this.getPages.bind(this)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

window.App = App;
