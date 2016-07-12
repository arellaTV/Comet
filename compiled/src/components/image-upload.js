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

    _this.state = { file: '', imagePreviewUrl: '' };
    return _this;
  }

  _createClass(ImageUpload, [{
    key: '_handleSubmit',
    value: function _handleSubmit(e) {
      e.preventDefault();
      // TODO: do something with -> this.state.file
      console.log('handle uploading-', this.state.file);
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

        xhr.send(imageFormData);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        'div',
        { className: 'previewComponent' },
        React.createElement(
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
        )
      );
    }
  }]);

  return ImageUpload;
}(React.Component);

window.ImageUpload = ImageUpload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ltYWdlLXVwbG9hZC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLFc7OztBQUNKLHVCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwrRkFDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYSxFQUFDLE1BQU0sRUFBUCxFQUFVLGlCQUFpQixFQUEzQixFQUFiO0FBRmlCO0FBR2xCOzs7O2tDQUVhLEMsRUFBRztBQUNmLFFBQUUsY0FBRjs7QUFFQSxjQUFRLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxLQUFLLEtBQUwsQ0FBVyxJQUE1QztBQUNEOzs7dUNBRWtCLEMsRUFBRztBQUFBOztBQUNwQixRQUFFLGNBQUY7O0FBRUEsVUFBSSxTQUFTLElBQUksVUFBSixFQUFiO0FBQ0EsVUFBSSxPQUFPLEVBQUUsTUFBRixDQUFTLEtBQVQsQ0FBZSxDQUFmLENBQVg7O0FBRUEsYUFBTyxTQUFQLEdBQW1CLFlBQU07QUFDdkIsZUFBSyxRQUFMLENBQWM7QUFDWixnQkFBTSxJQURNO0FBRVosMkJBQWlCLE9BQU87QUFGWixTQUFkO0FBSUQsT0FMRDs7QUFPQSxhQUFPLGFBQVAsQ0FBcUIsSUFBckI7QUFDRDs7O2dDQUVXLFMsRUFBVztBQUN2QixhQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDdEMsWUFBSSxnQkFBZ0IsSUFBSSxRQUFKLEVBQXBCOztBQUVBLHNCQUFjLE1BQWQsQ0FBcUIsV0FBckIsRUFBa0MsU0FBbEM7O0FBRUEsWUFBSSxNQUFNLElBQUksY0FBSixFQUFWOztBQUVBLFlBQUksSUFBSixDQUFTLE1BQVQsRUFBaUIsU0FBakIsRUFBNEIsSUFBNUI7O0FBRUEsWUFBSSxNQUFKLEdBQWEsWUFBWTtBQUN2QixjQUFJLEtBQUssTUFBTCxJQUFlLEdBQW5CLEVBQXdCO0FBQ3RCLG9CQUFRLEtBQUssUUFBYjtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFPLEtBQUssVUFBWjtBQUNEO0FBQ0YsU0FORDs7QUFRQSxZQUFJLElBQUosQ0FBUyxhQUFUO0FBRUQsT0FuQk0sQ0FBUDtBQW9CRDs7OzZCQUVVO0FBQUE7O0FBRVAsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLGtCQUFmO0FBQ0U7QUFBQTtBQUFBLFlBQU0sVUFBVSxrQkFBQyxDQUFEO0FBQUEscUJBQUssT0FBSyxhQUFMLENBQW1CLENBQW5CLENBQUw7QUFBQSxhQUFoQjtBQUNFLHlDQUFPLFdBQVUsV0FBakIsRUFBNkIsTUFBSyxNQUFsQyxFQUF5QyxVQUFVLGtCQUFDLENBQUQ7QUFBQSxxQkFBSyxPQUFLLGtCQUFMLENBQXdCLENBQXhCLENBQUw7QUFBQSxhQUFuRCxHQURGO0FBRUU7QUFBQTtBQUFBLGNBQVEsV0FBVSxjQUFsQixFQUFpQyxNQUFLLFFBQXRDLEVBQStDLFNBQVMsaUJBQUMsQ0FBRDtBQUFBLHVCQUFLLE9BQUssYUFBTCxDQUFtQixDQUFuQixDQUFMO0FBQUEsZUFBeEQ7QUFBQTtBQUFBO0FBRkY7QUFERixPQURGO0FBUUQ7Ozs7RUE3RHVCLE1BQU0sUzs7QUFnRWhDLE9BQU8sV0FBUCxHQUFxQixXQUFyQiIsImZpbGUiOiJpbWFnZS11cGxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBJbWFnZVVwbG9hZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7ZmlsZTogJycsaW1hZ2VQcmV2aWV3VXJsOiAnJ307XG4gIH1cblxuICBfaGFuZGxlU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgLy8gVE9ETzogZG8gc29tZXRoaW5nIHdpdGggLT4gdGhpcy5zdGF0ZS5maWxlXG4gICAgY29uc29sZS5sb2coJ2hhbmRsZSB1cGxvYWRpbmctJywgdGhpcy5zdGF0ZS5maWxlKTtcbiAgfVxuXG4gIF9oYW5kbGVJbWFnZUNoYW5nZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgbGV0IGZpbGUgPSBlLnRhcmdldC5maWxlc1swXTtcblxuICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgaW1hZ2VQcmV2aWV3VXJsOiByZWFkZXIucmVzdWx0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKVxuICB9XG5cbiAgdXBsb2FkSW1hZ2UoaW1hZ2VGaWxlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IGltYWdlRm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgIGltYWdlRm9ybURhdGEuYXBwZW5kKCdpbWFnZUZpbGUnLCBpbWFnZUZpbGUpO1xuXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgeGhyLm9wZW4oJ3Bvc3QnLCAnL2ltYWdlcycsIHRydWUpO1xuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdCh0aGlzLnN0YXR1c1RleHQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB4aHIuc2VuZChpbWFnZUZvcm1EYXRhKTtcblxuICB9KTtcbn1cblxuICByZW5kZXIoKSB7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcmV2aWV3Q29tcG9uZW50XCI+XG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXsoZSk9PnRoaXMuX2hhbmRsZVN1Ym1pdChlKX0+XG4gICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpbGVJbnB1dFwiIHR5cGU9XCJmaWxlXCIgb25DaGFuZ2U9eyhlKT0+dGhpcy5faGFuZGxlSW1hZ2VDaGFuZ2UoZSl9IC8+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzdWJtaXRCdXR0b25cIiB0eXBlPVwic3VibWl0XCIgb25DbGljaz17KGUpPT50aGlzLl9oYW5kbGVTdWJtaXQoZSl9PlVwbG9hZCBJbWFnZTwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93LkltYWdlVXBsb2FkID0gSW1hZ2VVcGxvYWQ7XG4iXX0=