class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.id);
    this.state = {file: '',imagePreviewUrl: '', currentPage: this.props.currentPage, currentSelection: this.props.id};
  }

  _handleSubmit(e) {
    debugger;
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
    this.uploadImage(this.state.file, this.state.currentPage, this.state.currentSelection);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  uploadImage(imageFile) {
  return new Promise((resolve, reject) => {
    let imageFormData = new FormData();

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

  render() {

    return (
        <form onSubmit={(e)=>this._handleSubmit(e)}>
          <input className="fileInput" type="file" onChange={(e)=>this._handleImageChange(e)} />
          <button className="submitButton" type="submit" onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
        </form>
    )
  }
}

window.ImageUpload = ImageUpload;
