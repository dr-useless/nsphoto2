import * as React from 'react'
import "./styles.css";
import { readFile, processImage } from './upload';

export default class NSPImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { modalVisible: false };
  }

  handleShowModal = () => {
    this.setState({ modalVisible: true });
  };

  handleHideModal = () => {
    this.setState({ modalVisible: false });
  };

  handleRemoveImage = () => {
    this.props.onChange(null);
  }

  handleDropzoneDragOver = event => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy"
  }

  handleDropzoneDrop = event => {
    event.stopPropagation();
    event.preventDefault();
    readFile(event.dataTransfer.files[0])
      .then(data => processImage(data))
      .then(responses => {
        this.props.onChange(responses);
        this.handleHideModal();
      });
  }

  handleFileInput = event => {
    readFile(event.target.files[0])
      .then(data => processImage(data))
      .then(responses => {
        this.props.onChange(responses);
        this.handleHideModal();
      });
  }

  render() {
    const { value } = this.props;
    return (
      <>
        <div className="nsp-image-widget">
          <img className="thumbnail" src={value ? value.toArray().filter(i => i.indexOf('webp') > -1)[0] : ""}/>
          <button onClick={this.handleShowModal}>Choose image</button>
          <button onClick={this.handleRemoveImage} className="danger">Remove image</button>
        </div>
        <div className="nsp-image-modal" hidden={!this.state.modalVisible} onClick={this.handleHideModal}>
          <div id="dropzone" onDragOver={this.handleDropzoneDragOver} onDrop={this.handleDropzoneDrop} onClick={e => e.stopPropagation()}>
            <label className="upload">
                <input type="file" onInput={this.handleFileInput}/>
                Select a file, or drop here
            </label>
          </div>
        </div>
      </>
    );
  }
}