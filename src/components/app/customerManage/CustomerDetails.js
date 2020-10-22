import React, { Component } from "react";
import { Tabs, BackTop } from 'antd';

import EditableFormTable from './Customer_left.js';
import EditableFormTableRight from './Customer_right.js';
// import { basicWeldingQC } from '../../../dataModule/UrlList';

const { TabPane } = Tabs;

export default class CustomerDetails extends Component {
  callback = (key) => {
    console.log(key);
  }
	constructor(props){
		super(props);
		this.state = {
			id: this.props.match.params.id,
		}
	}
	componentDidMount(){
		console.log('id:',this.props.match.params.id)
	}
  render() {
    return (
      <div style={{marginTop: 0}}>
        <h2 className="titleOfViews">客户详情</h2>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="联系人" key="1">
            <EditableFormTable id={this.state.id}/>
          </TabPane>
          <TabPane tab="客户基础信息" key="2">
            <EditableFormTableRight id={this.state.id} />
          </TabPane>
        </Tabs>
				{/* 回到顶部 */}
				<BackTop />
				<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
      </div>
    )
  }
}
/*如何获取路由中参数id，如'url/:id',在路由导向的组件father中，this.props.match.params.id,
* 如果此时，你要再把father组件中获得的参数id传给father组件中引入的子组件son的话
* 在father组件中，将id存储，this.state = {id: this.props.match.params.id,}
* <Son id={this.state.id}
* son组件中接收，this.props.id
*/
