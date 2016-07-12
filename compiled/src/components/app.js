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
      currentPage: pageList[1].panels
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
        currentPage: pageList[targetIndex].panels
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2FwcC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLEc7OztBQUNKLGVBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHVGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsYUFBTyxRQURJO0FBRVgsbUJBQWEsU0FBUyxDQUFULEVBQVk7QUFGZCxLQUFiOztBQUtBLFVBQUssV0FBTCxHQUFtQixNQUFLLFdBQUwsQ0FBaUIsSUFBakIsT0FBbkI7QUFSaUI7QUFTbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBaUJXLEssRUFBTztBQUNqQixVQUFJLGNBQWMsTUFBTSxNQUFOLENBQWEsRUFBL0I7QUFDQSxXQUFLLFFBQUwsQ0FBYztBQUNaLHFCQUFhLFNBQVMsV0FBVCxFQUFzQjtBQUR2QixPQUFkO0FBR0Q7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQURGO0FBRUUsNEJBQUMsS0FBRCxJQUFPLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBekIsRUFBZ0MsYUFBYSxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBN0MsR0FGRjtBQUdFLDRCQUFDLE1BQUQsSUFBUSxRQUFRLEtBQUssS0FBTCxDQUFXLFdBQTNCO0FBSEYsT0FERjtBQU9EOzs7O0VBMUNlLE1BQU0sUzs7QUE2Q3hCLE9BQU8sR0FBUCxHQUFhLEdBQWIiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcGFnZXM6IHBhZ2VMaXN0LFxuICAgICAgY3VycmVudFBhZ2U6IHBhZ2VMaXN0WzFdLnBhbmVsc1xuICAgIH1cbiAgICAvLyB0aGlzLmdldFBhZ2VzID0gdGhpcy5nZXRQYWdlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gIH1cblxuICAvLyBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgLy8gICB0aGlzLmdldFBhZ2VzKCk7XG4gIC8vIH1cbiAgLy9cbiAgLy8gZ2V0UGFnZXMoKSB7XG4gIC8vICAgZmV0Y2goJy9wYWdlcycpXG4gIC8vICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgLy8gICAgIC50aGVuKChyZXNwb25zZUpTT04pID0+IHtcbiAgLy8gICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gIC8vICAgICAgICAgcGFnZXM6IHJlc3BvbnNlSlNPTlxuICAvLyAgICAgICB9KTtcbiAgLy8gICAgICAgY29uc29sZS5sb2coQXJyYXkuaXNBcnJheShyZXNwb25zZUpTT04pLCByZXNwb25zZUpTT04pO1xuICAvLyAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IGNvbnNvbGUuZXJyb3IoZXJyb3IpOyB9KTtcbiAgLy8gfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgdmFyIHRhcmdldEluZGV4ID0gZXZlbnQudGFyZ2V0LmlkO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFBhZ2U6IHBhZ2VMaXN0W3RhcmdldEluZGV4XS5wYW5lbHNcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGgxPkNvbWV0ITwvaDE+XG4gICAgICAgIDxQYWdlcyBwYWdlcz17dGhpcy5zdGF0ZS5wYWdlc30gaGFuZGxlQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKX0vPlxuICAgICAgICA8Q2FudmFzIGxheW91dD17dGhpcy5zdGF0ZS5jdXJyZW50UGFnZX0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG53aW5kb3cuQXBwID0gQXBwO1xuIl19