import React, { Component } from 'react';
import { Model } from '../dataModule/testBone'

class BoneViewForm extends Component {
  constructor(props) {
    super(props)
    const model = new Model()
    // this.url = this.props.url === undefined ? 'test/' : this.props.url
    this.url = this.props.url
    // 第一个传入参数是该字段的内容
    this.dealWithContent = this.props.dealWithContent
    // 请求数据
    this.params = this.props.params
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
    // 此时 state 中的 model 实际上已经发生了赋值的改变
    // 可是 react 的监听器并没有监听到数值的改变，造成无法自动重渲染页面
    model.setJsonToMap(params, me)
    let formData = {}
    for (let i of model.modelMap) {
      formData[i[0]] = i[1]
    }

    // 通过将请求到的数据提出至 formData 触发重渲染
    this.setState({
      formData: formData
    })
  }

  renderFormItems() {
    let { formData } = this.state
    let formDataKeys = Object.keys(formData)
    let items = []

    for (let i = 0; i < formDataKeys.length; i++) {
      let singleContent = formData[formDataKeys[i]]

      // 根据用户传入的内容处理方法对内容进行处理
      if (this.dealWithContent !== undefined) {
        singleContent = this.dealWithContent(singleContent)
      }

      let singleItem = <div key={i} className="single-item-of-bone-view-form">
                          <span>{formDataKeys[i]}</span>
                          <span>{singleContent}</span>
                       </div>
      
      items.push(singleItem)
    }
    return items
  }

  render() {
    let { formData } = this.state
    if (formData === null) return null

    return (
      <div className="bone-view-form">{this.renderFormItems()}</div>
    )
  }
}

export default BoneViewForm
