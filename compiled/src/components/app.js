"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));

    _this.state = {
      pages: pageList,
      currentPage: pageList[1]
    };
    // this.getPages = this.getPages.bind(this);
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
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

  _createClass(App, [{
    key: "handleClick",
    value: function handleClick(event) {
      var targetIndex = event.target.id;
      this.setState({
        currentPage: pageList[targetIndex]
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "h1",
          null,
          "Comet!"
        ),
        React.createElement(Pages, { pages: this.state.pages, handleClick: this.handleClick.bind(this) }),
        React.createElement(Canvas, { layout: this.state.currentPage })
      );
    }
  }]);

  return App;
}(React.Component);

window.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2FwcC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLEc7OztBQUNKLGVBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHVGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsYUFBTyxRQURJO0FBRVgsbUJBQWEsU0FBUyxDQUFUO0FBRkYsS0FBYjs7QUFLQSxVQUFLLFdBQUwsR0FBbUIsTUFBSyxXQUFMLENBQWlCLElBQWpCLE9BQW5CO0FBUmlCO0FBU2xCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dDQWlCVyxLLEVBQU87QUFDakIsVUFBSSxjQUFjLE1BQU0sTUFBTixDQUFhLEVBQS9CO0FBQ0EsV0FBSyxRQUFMLENBQWM7QUFDWixxQkFBYSxTQUFTLFdBQVQ7QUFERCxPQUFkO0FBR0Q7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQURGO0FBRUUsNEJBQUMsS0FBRCxJQUFPLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBekIsRUFBZ0MsYUFBYSxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBN0MsR0FGRjtBQUdFLDRCQUFDLE1BQUQsSUFBUSxRQUFRLEtBQUssS0FBTCxDQUFXLFdBQTNCO0FBSEYsT0FERjtBQU9EOzs7O0VBMUNlLE1BQU0sUzs7QUE2Q3hCLE9BQU8sR0FBUCxHQUFhLEdBQWIiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcGFnZXM6IHBhZ2VMaXN0LFxuICAgICAgY3VycmVudFBhZ2U6IHBhZ2VMaXN0WzFdXG4gICAgfVxuICAgIC8vIHRoaXMuZ2V0UGFnZXMgPSB0aGlzLmdldFBhZ2VzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8vIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAvLyAgIHRoaXMuZ2V0UGFnZXMoKTtcbiAgLy8gfVxuICAvL1xuICAvLyBnZXRQYWdlcygpIHtcbiAgLy8gICBmZXRjaCgnL3BhZ2VzJylcbiAgLy8gICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAvLyAgICAgLnRoZW4oKHJlc3BvbnNlSlNPTikgPT4ge1xuICAvLyAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgLy8gICAgICAgICBwYWdlczogcmVzcG9uc2VKU09OXG4gIC8vICAgICAgIH0pO1xuICAvLyAgICAgICBjb25zb2xlLmxvZyhBcnJheS5pc0FycmF5KHJlc3BvbnNlSlNPTiksIHJlc3BvbnNlSlNPTik7XG4gIC8vICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgY29uc29sZS5lcnJvcihlcnJvcik7IH0pO1xuICAvLyB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQpIHtcbiAgICB2YXIgdGFyZ2V0SW5kZXggPSBldmVudC50YXJnZXQuaWQ7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50UGFnZTogcGFnZUxpc3RbdGFyZ2V0SW5kZXhdXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoMT5Db21ldCE8L2gxPlxuICAgICAgICA8UGFnZXMgcGFnZXM9e3RoaXMuc3RhdGUucGFnZXN9IGhhbmRsZUNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyl9Lz5cbiAgICAgICAgPENhbnZhcyBsYXlvdXQ9e3RoaXMuc3RhdGUuY3VycmVudFBhZ2V9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbndpbmRvdy5BcHAgPSBBcHA7XG4iXX0=