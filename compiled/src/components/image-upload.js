'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageUpload = function (_React$Component) {
  _inherits(ImageUpload, _React$Component);

  function ImageUpload(props) {
    _classCallCheck(this, ImageUpload);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ImageUpload).call(this, props));

    console.log(_this.props.id);
    _this.state = { file: '', imagePreviewUrl: '', currentPage: _this.props.currentPage, currentSelection: _this.props.id };
    return _this;
  }

  _createClass(ImageUpload, [{
    key: '_handleSubmit',
    value: function _handleSubmit(e) {
      debugger;
      e.preventDefault();
      // TODO: do something with -> this.state.file
      console.log('handle uploading-', this.state.file);
      this.uploadImage(this.state.file, this.state.currentPage, this.state.currentSelection);
    }
  }, {
    key: '_handleImageChange',
    value: function _handleImageChange(e) {
      var _this2 = this;

      e.preventDefault();

      var reader = new FileReader();
      var file = e.target.files[0];

      reader.onloadend = function () {
        _this2.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      };

      reader.readAsDataURL(file);
    }
  }, {
    key: 'uploadImage',
    value: function uploadImage(imageFile) {
      return new Promise(function (resolve, reject) {
        var imageFormData = new FormData();

        imageFormData.append('imageFile', imageFile);

        var xhr = new XMLHttpRequest();

        xhr.open('post', '/images', true);

        xhr.onload = function () {
          if (this.status == 200) {
            resolve(this.response);
          } else {
            reject(this.statusText);
          }
        };
        console.log(imageFormData);
        xhr.send(imageFormData);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        'form',
        { onSubmit: function onSubmit(e) {
            return _this3._handleSubmit(e);
          } },
        React.createElement('input', { className: 'fileInput', type: 'file', onChange: function onChange(e) {
            return _this3._handleImageChange(e);
          } }),
        React.createElement(
          'button',
          { className: 'submitButton', type: 'submit', onClick: function onClick(e) {
              return _this3._handleSubmit(e);
            } },
          'Upload Image'
        )
      );
    }
  }]);

  return ImageUpload;
}(React.Component);

window.ImageUpload = ImageUpload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ltYWdlLXVwbG9hZC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLFc7OztBQUNKLHVCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwrRkFDWCxLQURXOztBQUVqQixZQUFRLEdBQVIsQ0FBWSxNQUFLLEtBQUwsQ0FBVyxFQUF2QjtBQUNBLFVBQUssS0FBTCxHQUFhLEVBQUMsTUFBTSxFQUFQLEVBQVUsaUJBQWlCLEVBQTNCLEVBQStCLGFBQWEsTUFBSyxLQUFMLENBQVcsV0FBdkQsRUFBb0Usa0JBQWtCLE1BQUssS0FBTCxDQUFXLEVBQWpHLEVBQWI7QUFIaUI7QUFJbEI7Ozs7a0NBRWEsQyxFQUFHO0FBQ2Y7QUFDQSxRQUFFLGNBQUY7O0FBRUEsY0FBUSxHQUFSLENBQVksbUJBQVosRUFBaUMsS0FBSyxLQUFMLENBQVcsSUFBNUM7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsS0FBSyxLQUFMLENBQVcsSUFBNUIsRUFBa0MsS0FBSyxLQUFMLENBQVcsV0FBN0MsRUFBMEQsS0FBSyxLQUFMLENBQVcsZ0JBQXJFO0FBQ0Q7Ozt1Q0FFa0IsQyxFQUFHO0FBQUE7O0FBQ3BCLFFBQUUsY0FBRjs7QUFFQSxVQUFJLFNBQVMsSUFBSSxVQUFKLEVBQWI7QUFDQSxVQUFJLE9BQU8sRUFBRSxNQUFGLENBQVMsS0FBVCxDQUFlLENBQWYsQ0FBWDs7QUFFQSxhQUFPLFNBQVAsR0FBbUIsWUFBTTtBQUN2QixlQUFLLFFBQUwsQ0FBYztBQUNaLGdCQUFNLElBRE07QUFFWiwyQkFBaUIsT0FBTztBQUZaLFNBQWQ7QUFJRCxPQUxEOztBQU9BLGFBQU8sYUFBUCxDQUFxQixJQUFyQjtBQUNEOzs7Z0NBRVcsUyxFQUFXO0FBQ3ZCLGFBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUN0QyxZQUFJLGdCQUFnQixJQUFJLFFBQUosRUFBcEI7O0FBRUEsc0JBQWMsTUFBZCxDQUFxQixXQUFyQixFQUFrQyxTQUFsQzs7QUFFQSxZQUFJLE1BQU0sSUFBSSxjQUFKLEVBQVY7O0FBRUEsWUFBSSxJQUFKLENBQVMsTUFBVCxFQUFpQixTQUFqQixFQUE0QixJQUE1Qjs7QUFFQSxZQUFJLE1BQUosR0FBYSxZQUFZO0FBQ3ZCLGNBQUksS0FBSyxNQUFMLElBQWUsR0FBbkIsRUFBd0I7QUFDdEIsb0JBQVEsS0FBSyxRQUFiO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsbUJBQU8sS0FBSyxVQUFaO0FBQ0Q7QUFDRixTQU5EO0FBT0EsZ0JBQVEsR0FBUixDQUFZLGFBQVo7QUFDQSxZQUFJLElBQUosQ0FBUyxhQUFUO0FBRUQsT0FuQk0sQ0FBUDtBQW9CRDs7OzZCQUVVO0FBQUE7O0FBRVAsYUFDSTtBQUFBO0FBQUEsVUFBTSxVQUFVLGtCQUFDLENBQUQ7QUFBQSxtQkFBSyxPQUFLLGFBQUwsQ0FBbUIsQ0FBbkIsQ0FBTDtBQUFBLFdBQWhCO0FBQ0UsdUNBQU8sV0FBVSxXQUFqQixFQUE2QixNQUFLLE1BQWxDLEVBQXlDLFVBQVUsa0JBQUMsQ0FBRDtBQUFBLG1CQUFLLE9BQUssa0JBQUwsQ0FBd0IsQ0FBeEIsQ0FBTDtBQUFBLFdBQW5ELEdBREY7QUFFRTtBQUFBO0FBQUEsWUFBUSxXQUFVLGNBQWxCLEVBQWlDLE1BQUssUUFBdEMsRUFBK0MsU0FBUyxpQkFBQyxDQUFEO0FBQUEscUJBQUssT0FBSyxhQUFMLENBQW1CLENBQW5CLENBQUw7QUFBQSxhQUF4RDtBQUFBO0FBQUE7QUFGRixPQURKO0FBTUQ7Ozs7RUE5RHVCLE1BQU0sUzs7QUFpRWhDLE9BQU8sV0FBUCxHQUFxQixXQUFyQiIsImZpbGUiOiJpbWFnZS11cGxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBJbWFnZVVwbG9hZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMuaWQpO1xuICAgIHRoaXMuc3RhdGUgPSB7ZmlsZTogJycsaW1hZ2VQcmV2aWV3VXJsOiAnJywgY3VycmVudFBhZ2U6IHRoaXMucHJvcHMuY3VycmVudFBhZ2UsIGN1cnJlbnRTZWxlY3Rpb246IHRoaXMucHJvcHMuaWR9O1xuICB9XG5cbiAgX2hhbmRsZVN1Ym1pdChlKSB7XG4gICAgZGVidWdnZXI7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vIFRPRE86IGRvIHNvbWV0aGluZyB3aXRoIC0+IHRoaXMuc3RhdGUuZmlsZVxuICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgdXBsb2FkaW5nLScsIHRoaXMuc3RhdGUuZmlsZSk7XG4gICAgdGhpcy51cGxvYWRJbWFnZSh0aGlzLnN0YXRlLmZpbGUsIHRoaXMuc3RhdGUuY3VycmVudFBhZ2UsIHRoaXMuc3RhdGUuY3VycmVudFNlbGVjdGlvbik7XG4gIH1cblxuICBfaGFuZGxlSW1hZ2VDaGFuZ2UoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIGxldCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF07XG5cbiAgICByZWFkZXIub25sb2FkZW5kID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgIGltYWdlUHJldmlld1VybDogcmVhZGVyLnJlc3VsdFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSlcbiAgfVxuXG4gIHVwbG9hZEltYWdlKGltYWdlRmlsZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBpbWFnZUZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICBpbWFnZUZvcm1EYXRhLmFwcGVuZCgnaW1hZ2VGaWxlJywgaW1hZ2VGaWxlKTtcblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHhoci5vcGVuKCdwb3N0JywgJy9pbWFnZXMnLCB0cnVlKTtcblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QodGhpcy5zdGF0dXNUZXh0KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnNvbGUubG9nKGltYWdlRm9ybURhdGEpO1xuICAgIHhoci5zZW5kKGltYWdlRm9ybURhdGEpO1xuXG4gIH0pO1xufVxuXG4gIHJlbmRlcigpIHtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXsoZSk9PnRoaXMuX2hhbmRsZVN1Ym1pdChlKX0+XG4gICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpbGVJbnB1dFwiIHR5cGU9XCJmaWxlXCIgb25DaGFuZ2U9eyhlKT0+dGhpcy5faGFuZGxlSW1hZ2VDaGFuZ2UoZSl9IC8+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzdWJtaXRCdXR0b25cIiB0eXBlPVwic3VibWl0XCIgb25DbGljaz17KGUpPT50aGlzLl9oYW5kbGVTdWJtaXQoZSl9PlVwbG9hZCBJbWFnZTwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5JbWFnZVVwbG9hZCA9IEltYWdlVXBsb2FkO1xuIl19