import React, { Component } from "react";
import {Icon} from "antd";

import './style.less';

export default class UploadFile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDocument: null,
      documentName: ''
    }
  }

  clickInput = (id) => {
    const documentInput = document.querySelector(id);
    documentInput.click()
  };

  selectFile = (id, whetherRecordTable, index) => {
    const documentInput = document.querySelector(id);
    if (documentInput.files[0] === undefined) return;
    const uploadedDocument = documentInput.files[0];
    this.setState({
      selectedDocument: uploadedDocument,
      documentName: documentInput.files[0].name
    })
    this.props.setSelectedFile(uploadedDocument)
  };

  clearFile = () => {
    this.setState({
      documentName: '',
      selectedDocument: null
    })
    this.props.setSelectedFile(null)
  };

  render() {
    const { documentName } = this.state;

    return (
      <div className={`uploadReport ${this.props.className}`}>
        <input
          type="text"
          className="avatval"
          id="avatval"
          value={documentName}
          placeholder={"请选择文件···"}
          readOnly="readonly"
          onClick={() => this.clickInput('#avatar')}
          onChange={null}
        />
        <input
          type="file"
          className="avatar"
          name="avatar"
          id="avatar"
          onChange={() => this.selectFile('#avatar')}
        />
        <Icon
          type="close-circle"
          theme="filled"
          className={"closeIcon"}
          onClick={() => this.clearFile()}
        />
      </div>
    )
  }
}
