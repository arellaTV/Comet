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

    console.log(_this.props.currentPage);
    _this.state = {
      file: '', imagePreviewUrl: '',
      currentPage: _this.props.currentPage,
      currentSelection: _this.props.id
    };
    return _this;
  }

  _createClass(ImageUpload, [{
    key: '_handleSubmit',
    value: function _handleSubmit(e) {
      e.preventDefault();
      console.log('handle uploading-', this.state.file);
      console.log('this.state.currentPage._id', this.state.currentPage);
      this.uploadImage(this.state.file, this.state.currentPage._id, this.state.currentSelection).then(this.props.getPages);
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
    value: function uploadImage(imageFile, currentPage, currentSelection) {
      console.log(currentPage, currentSelection);
      return new Promise(function (resolve, reject) {
        var imageFormData = new FormData();
        console.log(currentPage);

        imageFormData.append('imageFile', imageFile);
        imageFormData.append('currentPage', currentPage);
        imageFormData.append('currentSelection', currentSelection);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ltYWdlLXVwbG9hZC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLFc7OztBQUNKLHVCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwrRkFDWCxLQURXOztBQUVqQixZQUFRLEdBQVIsQ0FBWSxNQUFLLEtBQUwsQ0FBVyxXQUF2QjtBQUNBLFVBQUssS0FBTCxHQUFhO0FBQ1gsWUFBTSxFQURLLEVBQ0YsaUJBQWlCLEVBRGY7QUFFWCxtQkFBYSxNQUFLLEtBQUwsQ0FBVyxXQUZiO0FBR1gsd0JBQWtCLE1BQUssS0FBTCxDQUFXO0FBSGxCLEtBQWI7QUFIaUI7QUFRbEI7Ozs7a0NBRWEsQyxFQUFHO0FBQ2YsUUFBRSxjQUFGO0FBQ0EsY0FBUSxHQUFSLENBQVksbUJBQVosRUFBaUMsS0FBSyxLQUFMLENBQVcsSUFBNUM7QUFDQSxjQUFRLEdBQVIsQ0FBWSw0QkFBWixFQUEwQyxLQUFLLEtBQUwsQ0FBVyxXQUFyRDtBQUNBLFdBQUssV0FBTCxDQUFpQixLQUFLLEtBQUwsQ0FBVyxJQUE1QixFQUFrQyxLQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLEdBQXpELEVBQThELEtBQUssS0FBTCxDQUFXLGdCQUF6RSxFQUNDLElBREQsQ0FDTSxLQUFLLEtBQUwsQ0FBVyxRQURqQjtBQUVEOzs7dUNBRWtCLEMsRUFBRztBQUFBOztBQUNwQixRQUFFLGNBQUY7O0FBRUEsVUFBSSxTQUFTLElBQUksVUFBSixFQUFiO0FBQ0EsVUFBSSxPQUFPLEVBQUUsTUFBRixDQUFTLEtBQVQsQ0FBZSxDQUFmLENBQVg7O0FBRUEsYUFBTyxTQUFQLEdBQW1CLFlBQU07QUFDdkIsZUFBSyxRQUFMLENBQWM7QUFDWixnQkFBTSxJQURNO0FBRVosMkJBQWlCLE9BQU87QUFGWixTQUFkO0FBSUQsT0FMRDs7QUFPQSxhQUFPLGFBQVAsQ0FBcUIsSUFBckI7QUFDRDs7O2dDQUVXLFMsRUFBVyxXLEVBQWEsZ0IsRUFBa0I7QUFDcEQsY0FBUSxHQUFSLENBQVksV0FBWixFQUF5QixnQkFBekI7QUFDRixhQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDdEMsWUFBSSxnQkFBZ0IsSUFBSSxRQUFKLEVBQXBCO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLFdBQVo7O0FBRUEsc0JBQWMsTUFBZCxDQUFxQixXQUFyQixFQUFrQyxTQUFsQztBQUNBLHNCQUFjLE1BQWQsQ0FBcUIsYUFBckIsRUFBb0MsV0FBcEM7QUFDQSxzQkFBYyxNQUFkLENBQXFCLGtCQUFyQixFQUF5QyxnQkFBekM7O0FBRUEsWUFBSSxNQUFNLElBQUksY0FBSixFQUFWOztBQUVBLFlBQUksSUFBSixDQUFTLE1BQVQsRUFBaUIsU0FBakIsRUFBNEIsSUFBNUI7O0FBRUEsWUFBSSxNQUFKLEdBQWEsWUFBWTtBQUN2QixjQUFJLEtBQUssTUFBTCxJQUFlLEdBQW5CLEVBQXdCO0FBQ3RCLG9CQUFRLEtBQUssUUFBYjtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFPLEtBQUssVUFBWjtBQUNEO0FBQ0YsU0FORDtBQU9BLGdCQUFRLEdBQVIsQ0FBWSxhQUFaO0FBQ0EsWUFBSSxJQUFKLENBQVMsYUFBVDtBQUVELE9BdEJNLENBQVA7QUF1QkQ7Ozs2QkFFVTtBQUFBOztBQUVQLGFBQ0k7QUFBQTtBQUFBLFVBQU0sVUFBVSxrQkFBQyxDQUFEO0FBQUEsbUJBQUssT0FBSyxhQUFMLENBQW1CLENBQW5CLENBQUw7QUFBQSxXQUFoQjtBQUNFLHVDQUFPLFdBQVUsV0FBakIsRUFBNkIsTUFBSyxNQUFsQyxFQUF5QyxVQUFVLGtCQUFDLENBQUQ7QUFBQSxtQkFBSyxPQUFLLGtCQUFMLENBQXdCLENBQXhCLENBQUw7QUFBQSxXQUFuRCxHQURGO0FBRUU7QUFBQTtBQUFBLFlBQVEsV0FBVSxjQUFsQixFQUFpQyxNQUFLLFFBQXRDLEVBQStDLFNBQVMsaUJBQUMsQ0FBRDtBQUFBLHFCQUFLLE9BQUssYUFBTCxDQUFtQixDQUFuQixDQUFMO0FBQUEsYUFBeEQ7QUFBQTtBQUFBO0FBRkYsT0FESjtBQU1EOzs7O0VBdEV1QixNQUFNLFM7O0FBeUVoQyxPQUFPLFdBQVAsR0FBcUIsV0FBckIiLCJmaWxlIjoiaW1hZ2UtdXBsb2FkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSW1hZ2VVcGxvYWQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzLmN1cnJlbnRQYWdlKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZmlsZTogJycsaW1hZ2VQcmV2aWV3VXJsOiAnJyxcbiAgICAgIGN1cnJlbnRQYWdlOiB0aGlzLnByb3BzLmN1cnJlbnRQYWdlLFxuICAgICAgY3VycmVudFNlbGVjdGlvbjogdGhpcy5wcm9wcy5pZFxuICAgIH07XG4gIH1cblxuICBfaGFuZGxlU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ2hhbmRsZSB1cGxvYWRpbmctJywgdGhpcy5zdGF0ZS5maWxlKTtcbiAgICBjb25zb2xlLmxvZygndGhpcy5zdGF0ZS5jdXJyZW50UGFnZS5faWQnLCB0aGlzLnN0YXRlLmN1cnJlbnRQYWdlKTtcbiAgICB0aGlzLnVwbG9hZEltYWdlKHRoaXMuc3RhdGUuZmlsZSwgdGhpcy5zdGF0ZS5jdXJyZW50UGFnZS5faWQsIHRoaXMuc3RhdGUuY3VycmVudFNlbGVjdGlvbilcbiAgICAudGhlbih0aGlzLnByb3BzLmdldFBhZ2VzKTtcbiAgfVxuXG4gIF9oYW5kbGVJbWFnZUNoYW5nZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgbGV0IGZpbGUgPSBlLnRhcmdldC5maWxlc1swXTtcblxuICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgaW1hZ2VQcmV2aWV3VXJsOiByZWFkZXIucmVzdWx0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKVxuICB9XG5cbiAgdXBsb2FkSW1hZ2UoaW1hZ2VGaWxlLCBjdXJyZW50UGFnZSwgY3VycmVudFNlbGVjdGlvbikge1xuICAgIGNvbnNvbGUubG9nKGN1cnJlbnRQYWdlLCBjdXJyZW50U2VsZWN0aW9uKTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgaW1hZ2VGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGNvbnNvbGUubG9nKGN1cnJlbnRQYWdlKTtcblxuICAgIGltYWdlRm9ybURhdGEuYXBwZW5kKCdpbWFnZUZpbGUnLCBpbWFnZUZpbGUpO1xuICAgIGltYWdlRm9ybURhdGEuYXBwZW5kKCdjdXJyZW50UGFnZScsIGN1cnJlbnRQYWdlKTtcbiAgICBpbWFnZUZvcm1EYXRhLmFwcGVuZCgnY3VycmVudFNlbGVjdGlvbicsIGN1cnJlbnRTZWxlY3Rpb24pO1xuXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgeGhyLm9wZW4oJ3Bvc3QnLCAnL2ltYWdlcycsIHRydWUpO1xuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdCh0aGlzLnN0YXR1c1RleHQpO1xuICAgICAgfVxuICAgIH07XG4gICAgY29uc29sZS5sb2coaW1hZ2VGb3JtRGF0YSk7XG4gICAgeGhyLnNlbmQoaW1hZ2VGb3JtRGF0YSk7XG5cbiAgfSk7XG59XG5cbiAgcmVuZGVyKCkge1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0gb25TdWJtaXQ9eyhlKT0+dGhpcy5faGFuZGxlU3VibWl0KGUpfT5cbiAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmlsZUlucHV0XCIgdHlwZT1cImZpbGVcIiBvbkNoYW5nZT17KGUpPT50aGlzLl9oYW5kbGVJbWFnZUNoYW5nZShlKX0gLz5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInN1Ym1pdEJ1dHRvblwiIHR5cGU9XCJzdWJtaXRcIiBvbkNsaWNrPXsoZSk9PnRoaXMuX2hhbmRsZVN1Ym1pdChlKX0+VXBsb2FkIEltYWdlPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICApXG4gIH1cbn1cblxud2luZG93LkltYWdlVXBsb2FkID0gSW1hZ2VVcGxvYWQ7XG4iXX0=