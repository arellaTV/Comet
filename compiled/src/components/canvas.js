'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// var ReactGridLayout = require('react-grid-layout');

var Canvas = function (_React$Component) {
  _inherits(Canvas, _React$Component);

  function Canvas(props) {
    _classCallCheck(this, Canvas);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Canvas).call(this, props));

    console.log(props);
    return _this;
  }

  _createClass(Canvas, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
          'Canvas'
        ),
        React.createElement(
          'button',
          null,
          'Add Panel'
        ),
        React.createElement(
          ReactGridLayout,
          { className: 'layout', layout: this.props.layout.panels, cols: 12, rowHeight: 30, width: 1200 },
          this.props.layout.panels.map(function (box) {
            return React.createElement(
              'div',
              { style: { background: 'url(' + box.path + ') center / cover' }, key: box.i },
              React.createElement(ImageUpload, { currentPage: _this2.props.layout, id: box.i })
            );
          })
        )
      );
    }
  }]);

  return Canvas;
}(React.Component);

;

window.Canvas = Canvas;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NhbnZhcy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBRU0sTTs7O0FBQ0osa0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDBGQUNYLEtBRFc7O0FBRWpCLFlBQVEsR0FBUixDQUFZLEtBQVo7QUFGaUI7QUFHbEI7Ozs7NkJBRVM7QUFBQTs7QUFDUixhQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FERjtBQUVFO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FGRjtBQUdFO0FBQUMseUJBQUQ7QUFBQSxZQUFpQixXQUFVLFFBQTNCLEVBQW9DLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixNQUE5RCxFQUFzRSxNQUFNLEVBQTVFLEVBQWdGLFdBQVcsRUFBM0YsRUFBK0YsT0FBTyxJQUF0RztBQUNHLGVBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBbEIsQ0FBeUIsR0FBekIsQ0FBNkI7QUFBQSxtQkFDNUI7QUFBQTtBQUFBLGdCQUFLLE9BQU8sRUFBQyxZQUFZLFNBQVMsSUFBSSxJQUFiLEdBQW9CLGtCQUFqQyxFQUFaLEVBQWtFLEtBQUssSUFBSSxDQUEzRTtBQUE4RSxrQ0FBQyxXQUFELElBQWEsYUFBYSxPQUFLLEtBQUwsQ0FBVyxNQUFyQyxFQUE2QyxJQUFJLElBQUksQ0FBckQ7QUFBOUUsYUFENEI7QUFBQSxXQUE3QjtBQURIO0FBSEYsT0FERjtBQVdEOzs7O0VBbEJrQixNQUFNLFM7O0FBbUIxQjs7QUFFRCxPQUFPLE1BQVAsR0FBZ0IsTUFBaEIiLCJmaWxlIjoiY2FudmFzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdmFyIFJlYWN0R3JpZExheW91dCA9IHJlcXVpcmUoJ3JlYWN0LWdyaWQtbGF5b3V0Jyk7XG5cbmNsYXNzIENhbnZhcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGNvbnNvbGUubG9nKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoMT5DYW52YXM8L2gxPlxuICAgICAgICA8YnV0dG9uPkFkZCBQYW5lbDwvYnV0dG9uPlxuICAgICAgICA8UmVhY3RHcmlkTGF5b3V0IGNsYXNzTmFtZT1cImxheW91dFwiIGxheW91dD17dGhpcy5wcm9wcy5sYXlvdXQucGFuZWxzfSBjb2xzPXsxMn0gcm93SGVpZ2h0PXszMH0gd2lkdGg9ezEyMDB9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxheW91dC5wYW5lbHMubWFwKGJveCA9PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2JhY2tncm91bmQ6ICd1cmwoJyArIGJveC5wYXRoICsgJykgY2VudGVyIC8gY292ZXInfX0ga2V5PXtib3guaX0+PEltYWdlVXBsb2FkIGN1cnJlbnRQYWdlPXt0aGlzLnByb3BzLmxheW91dH0gaWQ9e2JveC5pfS8+PC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9SZWFjdEdyaWRMYXlvdXQ+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn07XG5cbndpbmRvdy5DYW52YXMgPSBDYW52YXM7XG4iXX0=