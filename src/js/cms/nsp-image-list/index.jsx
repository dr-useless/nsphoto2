import * as React from 'react'
import "../common/styles.css";
import "./styles.css";
import { readFile, processImage } from '../common/image-util';

export default class NSPImageList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { modalVisible: false, uploads: {} };
  }

  handleShowModal = () => {
    this.setState({ modalVisible: true });
  };

  handleHideModal = () => {
    this.setState({ modalVisible: false });
  };

  handleRemoveImage = image => {
    const { value, onChange } = this.props;

    const newValue = value.filter(i => i !== image);

    console.log(newValue);
    onChange(newValue);
  }

  handleDropzoneDragOver = event => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy"
  }

  handleDropzoneDrop = event => {
    event.stopPropagation();
    event.preventDefault();
    this.addFiles(event.dataTransfer.files);
  }

  handleFileInput = event => {
    this.addFiles(event.target.files);
  }

  addFiles = files => {
    const maxWidth = this.props.field.get("max_width");
    const promises = [];
    [].forEach.call(files, file => {
      this.setState(state => {
        state.uploads[file.name] = { progress: 0 };
      });
      const promise = readFile(file)
      .then(data => processImage(data, file, this.handleFileProgress, maxWidth))
      .then(responses => {
        this.setState(state => {
          state.uploads[file.name] = undefined;
        });
        return responses;
      });
      promises.push(promise);
    });
    return Promise.all(promises).then(responses => {
      this.setState({ modalVisible: false, uploads: []});
      this.props.onChange([...this.props.value||[], ...responses]);
    });
  }

  handleFileProgress = (file, newProgress) => {
    this.setState(state => state.uploads[file.name].progress = state.uploads[file.name].progress + newProgress);
  }

  renderUploadList = () => {
    const uploadList = [];
    for (const [fileName, value] of Object.entries(this.state.uploads)) {
      console.log(fileName, value);
      if (fileName && value && value.progress) {
        uploadList.push(<><div>{`${fileName}: ${value.progress}`}</div></>);
      }
    }
    return uploadList;
  }

  renderImageItems = () => {
    const { value } = this.props;
    const imageItems = [];
    if (value && Array.isArray(value)) {
      value.forEach(imageItem => {
        imageItems.push(
          <>
            <div className="image-item">
              <div>X</div>
              <img src={imageItem.filter(i => i.indexOf('webp') > -1)[0]}/>
            </div>
          </>
        );
      });
    }
    return imageItems;
  }

  render() {
    const { classNameWidget } = this.props;
    return (
      <>
        <div className={`nsp-widget ${classNameWidget}`}>
          <button onClick={this.handleShowModal}>Add images</button>
          <div className="image-list">
            { this.renderImageItems() }
          </div>
        </div>
        <div className="nsp-modal" hidden={!this.state.modalVisible} onClick={this.handleHideModal}>
          <div class="dropzone" onDragOver={this.handleDropzoneDragOver} onDrop={this.handleDropzoneDrop} onClick={e => e.stopPropagation()}>
            <label className="upload" hidden={this.state.uploads && Object.entries(this.state.uploads).length > 0}>
                <input type="file" onInput={this.handleFileInput}/>
                Select a file, or drop here
            </label>
            <div className="upload-list">
              { this.renderUploadList() }
            </div>
          </div>
        </div>
      </>
    );
  }
}