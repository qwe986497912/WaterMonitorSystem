import React, { Component } from "react"
import {message, Pagination, Table} from 'antd';
import {Model} from "../dataModule/testBone";

const model = new Model()

export default class AntdTable extends Component{
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 15,
      columns: this.props.columns,
      data: [],
      currentPage: 1,
      total: 15,
      isLoading: true
    }
    this.onClick = this.props.rowClick  ? this.props.rowClick : function () {
      console.log('单击行事件')
    }
    this.interval = null
  }

  componentDidMount() {
    if (this.props.onRef !== undefined) this.props.onRef(this)
    this.setState({
      currentPage: this.props.currentPage
    })
    if (this.props.rejectQueryInDidMount !== true) {
      this.pageChange()
    }
  }

  setDataList = (params) => {
    console.log('params in AntdTable', params)
    const me = this
    for (let i in params) {
      if (params[i] === null) {
        params[i] = ''
      }
    }
    model.fetch(
      params,
      this.props.url,
      'get',
      function(response) {
        if (me.props.whetherTest === false) {
          me.setState({
            isLoading: false,
            data: response.data.results,
            total: response.data.count,
            currentPage: params['currentPage']
          })
        } else {
          me.setState({
            isLoading: false,
            data: response.data
          })
        }
      },
      function() {
        message.warning('加载失败，请重试')
      },
      this.props.whetherTest
    )
  }

  changeCurrentPageToOne = () => {
    this.setState({currentPage: 1})
  }

  pageChange = (pageNumber) => {
    let { currentPage, pageSize } = this.state
    const { queryParams } = this.props
    if (pageNumber !== undefined) currentPage = pageNumber
    this.setState({ currentPage: currentPage })
    const params = {
      pageSize: pageSize,
      ...queryParams,
      currentPage: currentPage,
    }
    this.setDataList(params)

    // 表格自动回顶部
    // const me = this
    // console.log('this', me)
    // console.log('document.body.scrollHeight', document.body.scrollHeight)
    // if (document.body.scrollHeight > 0) {
    //   this.interval = setInterval(function() {
    //     document.documentElement.scrollTop -= 8
    //     if (document.documentElement.scrollTop <= 8) {
    //       console.log('clearInterval')
    //       clearInterval(me.interval)
    //       me.interval = null
    //       document.documentElement.scrollTop = 0
    //     }
    //   }, 2)
    // }
  }

  queryCurrentPage = () => {
    return this.state.currentPage
  }

  setCurrentPage = (currentPage) => {
    this.setState({ currentPage: currentPage })
    this.pageChange(currentPage)
  }

  render() {
    const { columns, data, currentPage, total, isLoading, pageSize } = this.state
    const { queryParams } = this.props
    let lastData = data
    if (this.props.data !== undefined) lastData = this.props.data
    let lastCurrentPage = currentPage
    if (this.props.currentPage !== undefined) {
      lastCurrentPage = this.props.currentPage
    }
    let lastPageChange = this.pageChange
    if (this.props.pageChange !== undefined) lastData = this.props.pageChange
    return (
      <div style={{...this.props.style}}>
        <Table
          style={{
            overflow: 'auto',
            width: '100%',
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap'
          }}
          pagination={false}
          columns={columns}
          dataSource={lastData}
          onRow={record => {
            return {
              onClick: event => this.onClick(record), // 点击行
              onDoubleClick: event => {},
              onContextMenu: event => {},
              onMouseEnter: event => {}, // 鼠标移入行
              onMouseLeave: event => {},
            };
          }}
          loading={isLoading}
          rowKey={'_id'}
        />
        <Pagination
          showQuickJumper
          current={lastCurrentPage}
          total={total}
          pageSize={queryParams.pageSize !== undefined ? queryParams.pageSize : pageSize}
          onChange={lastPageChange}
          style={{marginTop: '1rem', marginBottom: '1rem'}}
        />
      </div>
    )
  }
}
