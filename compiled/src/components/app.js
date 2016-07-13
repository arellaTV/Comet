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
      currentPage: pageList[0]
    };
    _this.getPages = _this.getPages.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getPages();
      this.setState({
        currentPage: this.state.currentPage
      });
    }
  }, {
    key: "getPages",
    value: function getPages() {
      var _this2 = this;

      fetch('/pages').then(function (response) {
        return response.json();
      }).then(function (responseJSON) {
        _this2.setState({
          pages: responseJSON,
          currentPage: _this2.state.currentPage
        });
        console.log(Array.isArray(responseJSON), responseJSON);
      }).catch(function (error) {
        console.error(error);
      });
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      debugger;
      for (var i = 0; i < this.state.pages.length; i++) {
        if (this.state.pages[i]._id === event.target.id) this.setState({
          currentPage: this.state.pages[i]
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(Nav, null),
        React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "div",
            { className: "row-fluid" },
            React.createElement(
              "div",
              { className: "col2" },
              React.createElement(Pages, { pages: this.state.pages, handleClick: this.handleClick.bind(this) })
            ),
            React.createElement(
              "div",
              { className: "col10" },
              React.createElement(Canvas, { layout: this.state.currentPage, getPages: this.getPages.bind(this) })
            )
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);

window.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2FwcC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLEc7OztBQUNKLGVBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHVGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsYUFBTyxRQURJO0FBRVgsbUJBQWEsU0FBUyxDQUFUO0FBRkYsS0FBYjtBQUlBLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLE1BQUssV0FBTCxDQUFpQixJQUFqQixPQUFuQjtBQVJpQjtBQVNsQjs7Ozt3Q0FFbUI7QUFDbEIsV0FBSyxRQUFMO0FBQ0EsV0FBSyxRQUFMLENBQWM7QUFDWixxQkFBYSxLQUFLLEtBQUwsQ0FBVztBQURaLE9BQWQ7QUFHRDs7OytCQUVVO0FBQUE7O0FBQ1QsWUFBTSxRQUFOLEVBQ0csSUFESCxDQUNRLFVBQUMsUUFBRDtBQUFBLGVBQWMsU0FBUyxJQUFULEVBQWQ7QUFBQSxPQURSLEVBRUcsSUFGSCxDQUVRLFVBQUMsWUFBRCxFQUFrQjtBQUN0QixlQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFPLFlBREs7QUFFWix1QkFBYSxPQUFLLEtBQUwsQ0FBVztBQUZaLFNBQWQ7QUFJQSxnQkFBUSxHQUFSLENBQVksTUFBTSxPQUFOLENBQWMsWUFBZCxDQUFaLEVBQXlDLFlBQXpDO0FBQ0QsT0FSSCxFQVFLLEtBUkwsQ0FRVyxVQUFDLEtBQUQsRUFBVztBQUFFLGdCQUFRLEtBQVIsQ0FBYyxLQUFkO0FBQXVCLE9BUi9DO0FBU0Q7OztnQ0FFVyxLLEVBQU87QUFDakI7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixNQUFyQyxFQUE2QyxHQUE3QyxFQUFrRDtBQUNoRCxZQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0IsR0FBcEIsS0FBNEIsTUFBTSxNQUFOLENBQWEsRUFBN0MsRUFDQSxLQUFLLFFBQUwsQ0FBYztBQUNaLHVCQUFhLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsQ0FBakI7QUFERCxTQUFkO0FBR0Q7QUFDRjs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO0FBQUE7QUFDRSw0QkFBQyxHQUFELE9BREY7QUFFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFdBQWY7QUFDRTtBQUFBO0FBQUEsY0FBSyxXQUFVLFdBQWY7QUFDRTtBQUFBO0FBQUEsZ0JBQUssV0FBVSxNQUFmO0FBQ0Usa0NBQUMsS0FBRCxJQUFPLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBekIsRUFBZ0MsYUFBYSxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBN0M7QUFERixhQURGO0FBSUU7QUFBQTtBQUFBLGdCQUFLLFdBQVUsT0FBZjtBQUNFLGtDQUFDLE1BQUQsSUFBUSxRQUFRLEtBQUssS0FBTCxDQUFXLFdBQTNCLEVBQXdDLFVBQVUsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFsRDtBQURGO0FBSkY7QUFERjtBQUZGLE9BREY7QUFlRDs7OztFQXpEZSxNQUFNLFM7O0FBNER4QixPQUFPLEdBQVAsR0FBYSxHQUFiIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHBhZ2VzOiBwYWdlTGlzdCxcbiAgICAgIGN1cnJlbnRQYWdlOiBwYWdlTGlzdFswXVxuICAgIH1cbiAgICB0aGlzLmdldFBhZ2VzID0gdGhpcy5nZXRQYWdlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmdldFBhZ2VzKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50UGFnZTogdGhpcy5zdGF0ZS5jdXJyZW50UGFnZVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0UGFnZXMoKSB7XG4gICAgZmV0Y2goJy9wYWdlcycpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgIC50aGVuKChyZXNwb25zZUpTT04pID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcGFnZXM6IHJlc3BvbnNlSlNPTixcbiAgICAgICAgICBjdXJyZW50UGFnZTogdGhpcy5zdGF0ZS5jdXJyZW50UGFnZVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coQXJyYXkuaXNBcnJheShyZXNwb25zZUpTT04pLCByZXNwb25zZUpTT04pO1xuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IGNvbnNvbGUuZXJyb3IoZXJyb3IpOyB9KTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgZGVidWdnZXI7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN0YXRlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5wYWdlc1tpXS5faWQgPT09IGV2ZW50LnRhcmdldC5pZClcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50UGFnZTogdGhpcy5zdGF0ZS5wYWdlc1tpXVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8TmF2Lz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdy1mbHVpZFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wyXCI+XG4gICAgICAgICAgICAgIDxQYWdlcyBwYWdlcz17dGhpcy5zdGF0ZS5wYWdlc30gaGFuZGxlQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKX0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbDEwXCI+XG4gICAgICAgICAgICAgIDxDYW52YXMgbGF5b3V0PXt0aGlzLnN0YXRlLmN1cnJlbnRQYWdlfSBnZXRQYWdlcz17dGhpcy5nZXRQYWdlcy5iaW5kKHRoaXMpfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG53aW5kb3cuQXBwID0gQXBwO1xuIl19