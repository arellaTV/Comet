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
      data: { title: 'Jay' }
    };
    _this.getPages = _this.getPages.bind(_this);
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
          data: responseJSON[0]
        });
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
          this.state.data.title
        ),
        React.createElement(Pages, null),
        React.createElement(Canvas, null)
      );
    }
  }]);

  return App;
}(React.Component);

window.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2FwcC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLEc7OztBQUNKLGVBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHVGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsWUFBTSxFQUFFLE9BQU8sS0FBVDtBQURLLEtBQWI7QUFHQSxVQUFLLFFBQUwsR0FBZ0IsTUFBSyxRQUFMLENBQWMsSUFBZCxPQUFoQjtBQU5pQjtBQU9sQjs7Ozt3Q0FFbUI7QUFDbEIsV0FBSyxRQUFMO0FBQ0Q7OzsrQkFFVTtBQUFBOztBQUNULFlBQU0sUUFBTixFQUNHLElBREgsQ0FDUSxVQUFDLFFBQUQ7QUFBQSxlQUFjLFNBQVMsSUFBVCxFQUFkO0FBQUEsT0FEUixFQUVHLElBRkgsQ0FFUSxVQUFDLFlBQUQsRUFBa0I7QUFBRSxlQUFLLFFBQUwsQ0FBYztBQUNwQyxnQkFBTSxhQUFhLENBQWI7QUFEOEIsU0FBZDtBQUd6QixPQUxILEVBS0ssS0FMTCxDQUtXLFVBQUMsS0FBRCxFQUFXO0FBQUUsZ0JBQVEsS0FBUixDQUFjLEtBQWQ7QUFBdUIsT0FML0M7QUFNRDs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBSyxlQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCO0FBQXJCLFNBREY7QUFFRSw0QkFBQyxLQUFELE9BRkY7QUFHRSw0QkFBQyxNQUFEO0FBSEYsT0FERjtBQU9EOzs7O0VBL0JlLE1BQU0sUzs7QUFrQ3hCLE9BQU8sR0FBUCxHQUFhLEdBQWIiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZGF0YTogeyB0aXRsZTogJ0pheScgfVxuICAgIH1cbiAgICB0aGlzLmdldFBhZ2VzID0gdGhpcy5nZXRQYWdlcy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRQYWdlcygpO1xuICB9XG5cbiAgZ2V0UGFnZXMoKSB7XG4gICAgZmV0Y2goJy9wYWdlcycpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgIC50aGVuKChyZXNwb25zZUpTT04pID0+IHsgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgZGF0YTogcmVzcG9uc2VKU09OWzBdXG4gICAgICAgIH0pXG4gICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgY29uc29sZS5lcnJvcihlcnJvcik7IH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aDE+e3RoaXMuc3RhdGUuZGF0YS50aXRsZX08L2gxPlxuICAgICAgICA8UGFnZXMgLz5cbiAgICAgICAgPENhbnZhcyAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG53aW5kb3cuQXBwID0gQXBwO1xuIl19