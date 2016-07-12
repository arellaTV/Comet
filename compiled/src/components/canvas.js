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
              React.createElement(ImageUpload, null)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NhbnZhcy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBRU0sTTs7O0FBQ0osa0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDBGQUNYLEtBRFc7O0FBRWpCLFlBQVEsR0FBUixDQUFZLEtBQVo7QUFGaUI7QUFHbEI7Ozs7NkJBRVM7QUFDUixhQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FERjtBQUVFO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FGRjtBQUdFO0FBQUMseUJBQUQ7QUFBQSxZQUFpQixXQUFVLFFBQTNCLEVBQW9DLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBdkQsRUFBK0QsTUFBTSxFQUFyRSxFQUF5RSxXQUFXLEVBQXBGLEVBQXdGLE9BQU8sSUFBL0Y7QUFDRyxlQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEdBQWxCLENBQXNCO0FBQUEsbUJBQ3JCO0FBQUE7QUFBQSxnQkFBSyxPQUFPLEVBQUMsWUFBWSxTQUFTLElBQUksSUFBYixHQUFvQixrQkFBakMsRUFBWixFQUFrRSxLQUFLLElBQUksQ0FBM0U7QUFBOEUsa0NBQUMsV0FBRDtBQUE5RSxhQURxQjtBQUFBLFdBQXRCO0FBREg7QUFIRixPQURGO0FBV0Q7Ozs7RUFsQmtCLE1BQU0sUzs7QUFtQjFCOztBQUVELE9BQU8sTUFBUCxHQUFnQixNQUFoQiIsImZpbGUiOiJjYW52YXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB2YXIgUmVhY3RHcmlkTGF5b3V0ID0gcmVxdWlyZSgncmVhY3QtZ3JpZC1sYXlvdXQnKTtcblxuY2xhc3MgQ2FudmFzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgY29uc29sZS5sb2cocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGgxPkNhbnZhczwvaDE+XG4gICAgICAgIDxidXR0b24+QWRkIFBhbmVsPC9idXR0b24+XG4gICAgICAgIDxSZWFjdEdyaWRMYXlvdXQgY2xhc3NOYW1lPVwibGF5b3V0XCIgbGF5b3V0PXt0aGlzLnByb3BzLmxheW91dH0gY29scz17MTJ9IHJvd0hlaWdodD17MzB9IHdpZHRoPXsxMjAwfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sYXlvdXQubWFwKGJveCA9PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2JhY2tncm91bmQ6ICd1cmwoJyArIGJveC5wYXRoICsgJykgY2VudGVyIC8gY292ZXInfX0ga2V5PXtib3guaX0+PEltYWdlVXBsb2FkLz48L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L1JlYWN0R3JpZExheW91dD5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufTtcblxud2luZG93LkNhbnZhcyA9IENhbnZhcztcbiJdfQ==