import React, { Component } from 'react'
import './DragAndDrop.scss'
import { AiOutlineReload,  AiOutlineSend } from 'react-icons/ai';

var final_algorithm = false;
var one_done = false;
var two_done = false;
var one_file;
var two_file;
var sent = false;


class DragAndDrop extends Component {

  state = {
    file1: 'Drop Train File',
    file2: 'Drop Anomaly File',
  }


  constructor(props) {
    super(props);
  }


  setAlgorithm = (algorithm) => (e) => {
    if (!sent) {
      e.preventDefault()
      if (algorithm === 1) {
        final_algorithm = 'regression'
        document.getElementById(final_algorithm).classList.add('button-active');
        document.getElementById('hybrid').classList.remove('button-active');
      } else {
        final_algorithm = 'hybrid'
        document.getElementById(final_algorithm).classList.add('button-active');
        document.getElementById('regression').classList.remove('button-active');
      }
    }
  }

  handleFiles = (files, id) => {
    if (files[0].type === 'text/csv' || files[0].type === 'application/vnd.ms-excel' ) {
      if (id === "one") {
        this.setState({file1 : files[0].name})
        one_done = true;
        one_file = files[0];
      } else {
        this.setState({file2 : files[0].name})
        two_done = true;
        two_file = files[0];
      }
      document.getElementById(id).style.background = '#90ee90';
      document.getElementById(id+"_image").classList.remove('upload_image');
      document.getElementById(id+"_image").classList.add('upload_image-done');
    } else {
      document.getElementById(id).style.background = "#f0f0f2";
      window.alert("Please upload a correct CSV file");
    }
  }

  dragOver = (id) => (e) =>  {
    if (!eval(id+"_done"))  {
      document.getElementById(id).style.background = '#D3D3D3';
    }
    e.preventDefault();
  };

  dragEnter = (id) => (e) => {
      e.preventDefault();
  }

  dragLeave = (id) => (e) => {
    if (!eval(id+"_done"))  {
      document.getElementById(id).style.background = "#f0f0f2";
    }
    e.preventDefault();
  }

  fileDrop = (id) => (e) => {
    if (!sent) {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length) {
          this.handleFiles(files, id);
      }
    }
  }

  sendFiles() {
    if (!final_algorithm || !one_done || !two_done) {
      window.alert("Plese complete setup before sending")
    } else {
      sent = true;
      document.getElementById('send').classList.add('button-active');
      document.getElementById('send').classList.add('button-active');
      this.props.postData(one_file, two_file, final_algorithm);
    }
  }

  render() {
    return (
      <div className="container">
      <div className="title"> Select Algorithm </div>
      <div className="buttons_container">
        <div className="button" id="regression" onClick={this.setAlgorithm(1)}><span>Regression</span></div>
        <div className="button" id="hybrid" onClick={this.setAlgorithm(2)}> <span>Hybrid</span> </div>
      </div>
      <div className="draggers">
        <div className="drag" id="one">
          <div className="dragDropZone" onDragOver={this.dragOver("one")} onDragEnter={this.dragEnter("one")} onDragLeave={this.dragLeave("one")} onDrop={this.fileDrop("one")}>
            <div className="upload_image" id="one_image"></div>​
            <p>{this.state.file1}</p>
          </div>
        </div>
        <div className="drag" id="two">
          <div className="dragDropZone" onDragOver={this.dragOver("two")} onDragEnter={this.dragEnter("two")} onDragLeave={this.dragLeave("two")} onDrop={this.fileDrop("two")}>
            <div className="upload_image" id="two_image"></div>​
            <p>{this.state.file2}</p>
          </div>
        </div>
      </div>
      <div className="final_buttons">
      <div className="restart" onClick={() => window.location.reload(false)}> <AiOutlineReload className="icon"/> </div>
      <div className="restart" id="send" onClick={() => this.sendFiles()}> <AiOutlineSend className="icon"/> </div>
      </div>
      </div>
    )
  }
}

export default DragAndDrop
