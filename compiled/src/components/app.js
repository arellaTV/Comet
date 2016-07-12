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
      console.log('this.state.pages', this.state.pages);
      console.log(event.target.id);
      for (var i = 0; i < this.state.pages.length; i++) {
        if (this.state.pages[i]._id === event.target.id) this.setState({
          currentPage: this.state.pages[i]
        });
      }
      // var targetIndex = event.target.id;
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
        React.createElement(Pages, { pages: this.state.pages, handleClick: this.handleClick.bind(this) }),
        React.createElement(Canvas, { layout: this.state.currentPage })
      );
    }
  }]);

  return App;
}(React.Component);

window.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2FwcC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLEc7OztBQUNKLGVBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHVGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsYUFBTyxRQURJO0FBRVgsbUJBQWEsU0FBUyxDQUFUO0FBRkYsS0FBYjtBQUlBLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLE1BQUssV0FBTCxDQUFpQixJQUFqQixPQUFuQjtBQVJpQjtBQVNsQjs7Ozt3Q0FFbUI7QUFDbEIsV0FBSyxRQUFMO0FBQ0Q7OzsrQkFFVTtBQUFBOztBQUNULFlBQU0sUUFBTixFQUNHLElBREgsQ0FDUSxVQUFDLFFBQUQ7QUFBQSxlQUFjLFNBQVMsSUFBVCxFQUFkO0FBQUEsT0FEUixFQUVHLElBRkgsQ0FFUSxVQUFDLFlBQUQsRUFBa0I7QUFDdEIsZUFBSyxRQUFMLENBQWM7QUFDWixpQkFBTztBQURLLFNBQWQ7QUFHQSxnQkFBUSxHQUFSLENBQVksTUFBTSxPQUFOLENBQWMsWUFBZCxDQUFaLEVBQXlDLFlBQXpDO0FBQ0QsT0FQSCxFQU9LLEtBUEwsQ0FPVyxVQUFDLEtBQUQsRUFBVztBQUFFLGdCQUFRLEtBQVIsQ0FBYyxLQUFkO0FBQXVCLE9BUC9DO0FBUUQ7OztnQ0FFVyxLLEVBQU87QUFDakIsY0FBUSxHQUFSLENBQVksa0JBQVosRUFBZ0MsS0FBSyxLQUFMLENBQVcsS0FBM0M7QUFDQSxjQUFRLEdBQVIsQ0FBWSxNQUFNLE1BQU4sQ0FBYSxFQUF6QjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLE1BQXJDLEVBQTZDLEdBQTdDLEVBQWtEO0FBQ2hELFlBQUksS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixDQUFqQixFQUFvQixHQUFwQixLQUE0QixNQUFNLE1BQU4sQ0FBYSxFQUE3QyxFQUNBLEtBQUssUUFBTCxDQUFjO0FBQ1osdUJBQWEsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixDQUFqQjtBQURELFNBQWQ7QUFHRDs7QUFFRjs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBREY7QUFFRSw0QkFBQyxLQUFELElBQU8sT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUF6QixFQUFnQyxhQUFhLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUE3QyxHQUZGO0FBR0UsNEJBQUMsTUFBRCxJQUFRLFFBQVEsS0FBSyxLQUFMLENBQVcsV0FBM0I7QUFIRixPQURGO0FBT0Q7Ozs7RUEvQ2UsTUFBTSxTOztBQWtEeEIsT0FBTyxHQUFQLEdBQWEsR0FBYiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBwYWdlczogcGFnZUxpc3QsXG4gICAgICBjdXJyZW50UGFnZTogcGFnZUxpc3RbMF1cbiAgICB9XG4gICAgdGhpcy5nZXRQYWdlcyA9IHRoaXMuZ2V0UGFnZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRQYWdlcygpO1xuICB9XG5cbiAgZ2V0UGFnZXMoKSB7XG4gICAgZmV0Y2goJy9wYWdlcycpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgIC50aGVuKChyZXNwb25zZUpTT04pID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcGFnZXM6IHJlc3BvbnNlSlNPTlxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coQXJyYXkuaXNBcnJheShyZXNwb25zZUpTT04pLCByZXNwb25zZUpTT04pO1xuICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IGNvbnNvbGUuZXJyb3IoZXJyb3IpOyB9KTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgY29uc29sZS5sb2coJ3RoaXMuc3RhdGUucGFnZXMnLCB0aGlzLnN0YXRlLnBhZ2VzKTtcbiAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQuaWQpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5wYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuc3RhdGUucGFnZXNbaV0uX2lkID09PSBldmVudC50YXJnZXQuaWQpXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY3VycmVudFBhZ2U6IHRoaXMuc3RhdGUucGFnZXNbaV1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyB2YXIgdGFyZ2V0SW5kZXggPSBldmVudC50YXJnZXQuaWQ7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoMT5Db21ldCE8L2gxPlxuICAgICAgICA8UGFnZXMgcGFnZXM9e3RoaXMuc3RhdGUucGFnZXN9IGhhbmRsZUNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyl9Lz5cbiAgICAgICAgPENhbnZhcyBsYXlvdXQ9e3RoaXMuc3RhdGUuY3VycmVudFBhZ2V9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbndpbmRvdy5BcHAgPSBBcHA7XG4iXX0=