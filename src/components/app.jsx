class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: pageList,
      currentPage: pageList[1]
    }
    // this.getPages = this.getPages.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // componentDidMount() {
  //   this.getPages();
  // }
  //
  // getPages() {
  //   fetch('/pages')
  //     .then((response) => response.json())
  //     .then((responseJSON) => {
  //       this.setState({
  //         pages: responseJSON
  //       });
  //       console.log(Array.isArray(responseJSON), responseJSON);
  //     }).catch((error) => { console.error(error); });
  // }

  handleClick(event) {
    var targetIndex = event.target.id;
    this.setState({
      currentPage: pageList[targetIndex]
    });
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
