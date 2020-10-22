import React, { Component } from 'react';
import { Model } from '../dataModule/testBone'


// 父组件传递的 dealWithInput 方法示例
function dealWithInput(value, name, onChange) {
  return <input
            type="number"
            autoComplete="off"
            name={name}
            onChange={onChange}
            value={value}
          />
}

// 父组件传递的 beforeSubmit 方法示例
function beforeSubmit(form) {
  return form
}

class BoneEditForm extends Component {
  constructor(props) {
    super(props)
    const model = new Model()
    this.url = this.props.url
    this.submitUrl = this.props.submitUrl
    this.params = this.props.params
    this.dealWithInput = this.props.dealWithInput
    this.beforeSubmit = this.props.beforeSubmit
    this.state = {
      formData: null,
      model: model
    }
    this.setMapToState = this.setMapToState.bind(this)
  }

  componentDidMount() {
    let { model } = this.state
    const params = this.params === undefined ? {} : this.params
    model.fetch(params, this.url, 'post', this.setMapToState)
  }

  setMapToState(params, me) {
    let { model } = this.state
    model.setJsonToMap(params, me)
    let formData = {}
    for (let i of model.modelMap) formData[i[0]] = i[1]
    this.setState({ formData: formData })
  }

  onChange = (e) => {
    let formData = this.state.formData
    formData[e.target.name] = e.target.value
    this.setState({ formData: formData })
  }

  renderItems() {
    let { formData } = this.state
    let formDataKeys = Object.keys(formData)
    let items = []

    for (let i = 0; i < formDataKeys.length; i++) {
      let singleInput = 
          <input
            value={formData[formDataKeys[i]]}
            name={formDataKeys[i]}
            onChange={this.onChange}
            autoComplete="off"
          />

      if (this.dealWithInput !== undefined) {
        singleInput = this.dealWithInput(formData[formDataKeys[i]], formDataKeys[i], this.onChange)
      }

      let singleItem =
        <div key={i} className="single-item-of-bone-edit-form">
          <span>{formDataKeys[i]}</span>
          {singleInput}
        </div>
      
      items.push(singleItem)
    }
    return items
  }

  submitForm = () => {
    let { formData, model } = this.state
    if (this.beforeSubmit !== undefined) {
      formData = this.beforeSubmit(formData)
    }
    model.save(formData, this.submitUrl)
  }

  render() {
    let { formData } = this.state
    if (formData === null) return null

    return (
      <div className="bone-edit-form">
        {this.renderItems()}
        <button onClick={() => this.submitForm()}>提交</button>
        <button>取消</button>
      </div>
    )
  }
}

export default BoneEditForm;
