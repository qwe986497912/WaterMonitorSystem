import React, { Component } from "react";
import {Icon} from "antd";

import "./style.less";

export default class UploadRectifiedImage extends Component{
  clickInput = (id) => {
    const documentInput = document.querySelector(id);
    documentInput.click()
  };

  selectFile = (id) => {
    const me = this.props.me;
    const documentInput = document.querySelector(id);
    if (documentInput.files[0] === undefined) return;
    const uploadedDocument = documentInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadedDocument);
    reader.onload = function() {
      const base64Str = this.result;
      me.setState({
        rectification_photograph: base64Str,
      });
    }
  };

  clearFile = () => {
    const me = this.props.me;
    me.setState({ rectification_photograph: null })
  };

  render() {
    if (this.props.rectification_photograph !== null) {
      return (
        <div
          className={'rectificationDiv'}
          style={this.props.style !== undefined ? {...this.props.style, overflow: 'auto'} : {overflow: 'auto'}}
        >
          <img src={this.props.rectification_photograph} alt={''}/>
          <Icon type="delete" onClick={() => this.clearFile('avatarOfImage')}/>
        </div>
      )
    }

    return (
      <div className={"uploadImage"}>
        <Icon
          id="avatvalOfImage"
          onClick={() => this.clickInput('#avatarOfImage')}
          type="plus"
        />
        <input
          type="file"
          className="avatar"
          name="avatar"
          id="avatarOfImage"
          accept="image/*"
          onChange={() => this.selectFile('#avatarOfImage')}
        />
      </div>
    )
  }
}
