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
          { className: 'layout', layout: this.props.layout, cols: 12, rowHeight: 30, width: 1200 },
          this.props.layout.map(function (box) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NhbnZhcy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBRU0sTTs7O0FBQ0osa0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDBGQUNYLEtBRFc7O0FBRWpCLFlBQVEsR0FBUixDQUFZLEtBQVo7QUFGaUI7QUFHbEI7Ozs7NkJBRVM7QUFBQTs7QUFDUixhQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FERjtBQUVFO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FGRjtBQUdFO0FBQUMseUJBQUQ7QUFBQSxZQUFpQixXQUFVLFFBQTNCLEVBQW9DLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBdkQsRUFBK0QsTUFBTSxFQUFyRSxFQUF5RSxXQUFXLEVBQXBGLEVBQXdGLE9BQU8sSUFBL0Y7QUFDRyxlQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEdBQWxCLENBQXNCO0FBQUEsbUJBQ3JCO0FBQUE7QUFBQSxnQkFBSyxPQUFPLEVBQUMsWUFBWSxTQUFTLElBQUksSUFBYixHQUFvQixrQkFBakMsRUFBWixFQUFrRSxLQUFLLElBQUksQ0FBM0U7QUFBOEUsa0NBQUMsV0FBRCxJQUFhLGFBQWEsT0FBSyxLQUFMLENBQVcsTUFBckMsRUFBNkMsSUFBSSxJQUFJLENBQXJEO0FBQTlFLGFBRHFCO0FBQUEsV0FBdEI7QUFESDtBQUhGLE9BREY7QUFXRDs7OztFQWxCa0IsTUFBTSxTOztBQW1CMUI7O0FBRUQsT0FBTyxNQUFQLEdBQWdCLE1BQWhCIiwiZmlsZSI6ImNhbnZhcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHZhciBSZWFjdEdyaWRMYXlvdXQgPSByZXF1aXJlKCdyZWFjdC1ncmlkLWxheW91dCcpO1xuXG5jbGFzcyBDYW52YXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBjb25zb2xlLmxvZyhwcm9wcyk7XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aDE+Q2FudmFzPC9oMT5cbiAgICAgICAgPGJ1dHRvbj5BZGQgUGFuZWw8L2J1dHRvbj5cbiAgICAgICAgPFJlYWN0R3JpZExheW91dCBjbGFzc05hbWU9XCJsYXlvdXRcIiBsYXlvdXQ9e3RoaXMucHJvcHMubGF5b3V0fSBjb2xzPXsxMn0gcm93SGVpZ2h0PXszMH0gd2lkdGg9ezEyMDB9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmxheW91dC5tYXAoYm94ID0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7YmFja2dyb3VuZDogJ3VybCgnICsgYm94LnBhdGggKyAnKSBjZW50ZXIgLyBjb3Zlcid9fSBrZXk9e2JveC5pfT48SW1hZ2VVcGxvYWQgY3VycmVudFBhZ2U9e3RoaXMucHJvcHMubGF5b3V0fSBpZD17Ym94Lml9Lz48L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L1JlYWN0R3JpZExheW91dD5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufTtcblxud2luZG93LkNhbnZhcyA9IENhbnZhcztcbiJdfQ==