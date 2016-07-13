'use strict';

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
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getPages();
      this.setState({
        currentPage: this.state.pages[0]
      });
    }
  }, {
    key: 'getPages',
    value: function getPages() {
      var _this2 = this;

      fetch('/pages').then(function (response) {
        return response.json();
      }).then(function (responseJSON) {
        _this2.setState({
          pages: responseJSON

        });
        console.log(Array.isArray(responseJSON), responseJSON);
      }).catch(function (error) {
        console.error(error);
      });
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      for (var i = 0; i < this.state.pages.length; i++) {
        if (this.state.pages[i]._id === event.target.id) this.setState({
          currentPage: this.state.pages[i]
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          { onClick: this.getPages.bind(this) },
          'Comet!'
        ),
        React.createElement(Pages, { pages: this.state.pages, handleClick: this.handleClick.bind(this) }),
        React.createElement(Canvas, { layout: this.state.currentPage, getPages: this.getPages.bind(this) })
      );
    }
  }]);

  return App;
}(React.Component);

window.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2FwcC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLEc7OztBQUNKLGVBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHVGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsYUFBTyxRQURJO0FBRVgsbUJBQWEsU0FBUyxDQUFUO0FBRkYsS0FBYjtBQUlBLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLE1BQUssV0FBTCxDQUFpQixJQUFqQixPQUFuQjtBQVJpQjtBQVNsQjs7Ozt3Q0FFbUI7QUFDbEIsV0FBSyxRQUFMO0FBQ0EsV0FBSyxRQUFMLENBQWM7QUFDWixxQkFBYSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLENBQWpCO0FBREQsT0FBZDtBQUdEOzs7K0JBRVU7QUFBQTs7QUFDVCxZQUFNLFFBQU4sRUFDRyxJQURILENBQ1EsVUFBQyxRQUFEO0FBQUEsZUFBYyxTQUFTLElBQVQsRUFBZDtBQUFBLE9BRFIsRUFFRyxJQUZILENBRVEsVUFBQyxZQUFELEVBQWtCO0FBQ3RCLGVBQUssUUFBTCxDQUFjO0FBQ1osaUJBQU87O0FBREssU0FBZDtBQUlBLGdCQUFRLEdBQVIsQ0FBWSxNQUFNLE9BQU4sQ0FBYyxZQUFkLENBQVosRUFBeUMsWUFBekM7QUFDRCxPQVJILEVBUUssS0FSTCxDQVFXLFVBQUMsS0FBRCxFQUFXO0FBQUUsZ0JBQVEsS0FBUixDQUFjLEtBQWQ7QUFBdUIsT0FSL0M7QUFTRDs7O2dDQUVXLEssRUFBTztBQUNqQixXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixNQUFyQyxFQUE2QyxHQUE3QyxFQUFrRDtBQUNoRCxZQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0IsR0FBcEIsS0FBNEIsTUFBTSxNQUFOLENBQWEsRUFBN0MsRUFDQSxLQUFLLFFBQUwsQ0FBYztBQUNaLHVCQUFhLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsQ0FBakI7QUFERCxTQUFkO0FBR0Q7QUFDRjs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBSSxTQUFTLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBYjtBQUFBO0FBQUEsU0FERjtBQUVFLDRCQUFDLEtBQUQsSUFBTyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXpCLEVBQWdDLGFBQWEsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQTdDLEdBRkY7QUFHRSw0QkFBQyxNQUFELElBQVEsUUFBUSxLQUFLLEtBQUwsQ0FBVyxXQUEzQixFQUF3QyxVQUFVLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBbEQ7QUFIRixPQURGO0FBT0Q7Ozs7RUFoRGUsTUFBTSxTOztBQW1EeEIsT0FBTyxHQUFQLEdBQWEsR0FBYiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBwYWdlczogcGFnZUxpc3QsXG4gICAgICBjdXJyZW50UGFnZTogcGFnZUxpc3RbMF1cbiAgICB9XG4gICAgdGhpcy5nZXRQYWdlcyA9IHRoaXMuZ2V0UGFnZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRQYWdlcygpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFBhZ2U6IHRoaXMuc3RhdGUucGFnZXNbMF1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFBhZ2VzKCkge1xuICAgIGZldGNoKCcvcGFnZXMnKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAudGhlbigocmVzcG9uc2VKU09OKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHBhZ2VzOiByZXNwb25zZUpTT04sXG4gICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhBcnJheS5pc0FycmF5KHJlc3BvbnNlSlNPTiksIHJlc3BvbnNlSlNPTik7XG4gICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgY29uc29sZS5lcnJvcihlcnJvcik7IH0pO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RhdGUucGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLnBhZ2VzW2ldLl9pZCA9PT0gZXZlbnQudGFyZ2V0LmlkKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRQYWdlOiB0aGlzLnN0YXRlLnBhZ2VzW2ldXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoMSBvbkNsaWNrPXt0aGlzLmdldFBhZ2VzLmJpbmQodGhpcyl9PkNvbWV0ITwvaDE+XG4gICAgICAgIDxQYWdlcyBwYWdlcz17dGhpcy5zdGF0ZS5wYWdlc30gaGFuZGxlQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKX0vPlxuICAgICAgICA8Q2FudmFzIGxheW91dD17dGhpcy5zdGF0ZS5jdXJyZW50UGFnZX0gZ2V0UGFnZXM9e3RoaXMuZ2V0UGFnZXMuYmluZCh0aGlzKX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxud2luZG93LkFwcCA9IEFwcDtcbiJdfQ==