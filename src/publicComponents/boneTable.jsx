/**
 * 暂时未考虑翻页时的预加载
 * 每次翻页均需要发起请求
 */
import React, { Component } from 'react';
import { Pagination } from 'antd';
import { Collection } from '../dataModule/testBone'

class BoneTable extends Component {
  constructor(props) {
    super(props)
    const collection = new Collection()
    this.url = this.props.url === undefined ? 'list-test/' : this.props.url
    this.pageSize = this.props.pageSize === undefined ? 10 : this.props.pageSize
    this.header = this.props.header === undefined ? [
      { title: '姓名', value: 'name' },
      { title: '年龄', value: 'age' }
    ] : this.props.header
    // this.url = this.props.url
    // 请求数据
    this.params = this.props.params
    this.state = {
      isLoading: true,
      collection: collection,
      query: {
        pageNum: 1,
        pageSize: this.pageSize
      },
      total: 10
    }
  }

  componentDidMount() {
    let { collection } = this.state
    const params = this.params === undefined ? {} : this.params
    collection.fetch(params, this.url, 'post', this.setMapToState)
  }

  setMapToState = (params, me) => {
    let { collection } = this.state
    let resultList = params.data.result
    let total = params.data.total
    collection.add(resultList)
    this.setState({
      isLoading: false,
      total: total
    })
  }

  renderSingleLine = (item, index) => {
    const line = []
    for (let i = 0; i < this.header.length; i++) {
      const td = <td key={i + item.get(this.header[i].value)}>{item.get(this.header[i].value)}</td>
      line.push(td)
    }
    line.unshift(<td key={index}>{ index + 1 }</td>)
    return line
  }

  onChangePage = (page) => {
    let { query, collection } = this.state
    this.setState({ 
      query: {
        pageNum: page,
        pageSize: 10
      }
    })
    // 翻页时向后台发起请求
    // 当前发送的是 query
    collection.fetch(query, this.url, 'post', collection.addAfterClear)
  }


  render() {
    let { isLoading, collection, query, total } = this.state
    if (isLoading === true) return null

    return (
      <div className="bone-table">
        <table>
          <thead>
            <tr>
              <th style={{ width: 40 }}>序号</th>
              {
                this.header.map((item, index) => {
                  return <th key={index}>{item.title}</th>
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              collection.modelArray.map((item, index) => {
                return <tr key={index}>{this.renderSingleLine(item, index)}</tr>
              })
            }
          </tbody>
        </table>
        
        <div className="public-pagination">
          <Pagination
            current={query.pageNum}
            total={total}
            onChange={this.onChangePage}
          />
        </div>
      </div>
    )
  }
}

export default BoneTable
