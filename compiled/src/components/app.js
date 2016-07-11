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
      pages: []
    };
    // this.getPages = this.getPages.bind(this);
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getPages();
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
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
          'Comet!'
        ),
        React.createElement(Pages, { pages: this.state.pages }),
        React.createElement(Canvas, null)
      );
    }
  }]);

  return App;
}(React.Component);

window.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2FwcC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLEc7OztBQUNKLGVBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHVGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsYUFBTztBQURJLEtBQWI7O0FBSGlCO0FBT2xCOzs7O3dDQUVtQjtBQUNsQixXQUFLLFFBQUw7QUFDRDs7OytCQUVVO0FBQUE7O0FBQ1QsWUFBTSxRQUFOLEVBQ0csSUFESCxDQUNRLFVBQUMsUUFBRDtBQUFBLGVBQWMsU0FBUyxJQUFULEVBQWQ7QUFBQSxPQURSLEVBRUcsSUFGSCxDQUVRLFVBQUMsWUFBRCxFQUFrQjtBQUN0QixlQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFPO0FBREssU0FBZDtBQUdBLGdCQUFRLEdBQVIsQ0FBWSxNQUFNLE9BQU4sQ0FBYyxZQUFkLENBQVosRUFBeUMsWUFBekM7QUFDRCxPQVBILEVBT0ssS0FQTCxDQU9XLFVBQUMsS0FBRCxFQUFXO0FBQUUsZ0JBQVEsS0FBUixDQUFjLEtBQWQ7QUFBdUIsT0FQL0M7QUFRRDs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBREY7QUFFRSw0QkFBQyxLQUFELElBQU8sT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUF6QixHQUZGO0FBR0UsNEJBQUMsTUFBRDtBQUhGLE9BREY7QUFPRDs7OztFQWpDZSxNQUFNLFM7O0FBb0N4QixPQUFPLEdBQVAsR0FBYSxHQUFiIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHBhZ2VzOiBbXVxuICAgIH1cbiAgICAvLyB0aGlzLmdldFBhZ2VzID0gdGhpcy5nZXRQYWdlcy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRQYWdlcygpO1xuICB9XG5cbiAgZ2V0UGFnZXMoKSB7XG4gICAgZmV0Y2goJy9wYWdlcycpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgIC50aGVuKChyZXNwb25zZUpTT04pID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcGFnZXM6IHJlc3BvbnNlSlNPTlxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coQXJyYXkuaXNBcnJheShyZXNwb25zZUpTT04pLCByZXNwb25zZUpTT04pO1xuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IGNvbnNvbGUuZXJyb3IoZXJyb3IpOyB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGgxPkNvbWV0ITwvaDE+XG4gICAgICAgIDxQYWdlcyBwYWdlcz17dGhpcy5zdGF0ZS5wYWdlc30vPlxuICAgICAgICA8Q2FudmFzIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbndpbmRvdy5BcHAgPSBBcHA7XG4iXX0=