import React, { Component } from "react";
import { Tabs } from 'antd';
import { originalUrl } from '../../../dataModule/UrlList';
import { Model } from '../../../dataModule/testBone.js';
import history from '../../common/history.js';
import '../antd.css';
//图片
import Img1 from '../../../statistics/水质提醒.png';
import Img2 from '../../../statistics/设备维护.png';
import Img3 from '../../../statistics/传感器标定.png';
import Img4 from '../../../statistics/设备状态.png';
import Img5 from '../../../statistics/设备详情.png';

import PH from './waterMonitor/Ph.js';
import Conduct from './waterMonitor/Conduct.js';
import Turbidity from './waterMonitor/Turbidity.js';
import Temper from './waterMonitor/Temper.js'
import COD from './waterMonitor/COD.js'
import Orp from './waterMonitor/Orp.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { TabPane } = Tabs;
const model = new Model();

class WaterMonitor extends Component {
  callback = (key) => {
    // console.log(key);
  }
	constructor(props){
		super(props);
		console.log(this.props.match.params.id); // 设备编号
		this.state = {
			client_unit: '',
			deviceNum: this.props.match.params.id,
		}
	}
  render() {
		const id = this.props.match.params.id;
		const { client_unit, deviceNum, } = this.state;
    return (
      <div style={{marginTop: 0}}>
				<div className="header" style={{width: '100%',height: 135}}>
					<div className="title" style={{width: '100%',height: 30,}}>
						<h2 style={{margin: 0,padding: 0,float: 'left',}}>设备编号:{id}</h2>
						<h2 style={{margin: 0,padding: 0,float: 'right',}}>用户单位:&nbsp;&nbsp;{client_unit}</h2>
					</div>
					<div className="sensor-nav" >
						<ul className="sensor-ul">
							<li>
								<span className="sensor-span">
								<img src={Img1} />
								</span>
								<a href={"/app/operation/RemindRecord/"+this.props.match.params.id}>水质提醒记录</a>
							</li>
							<li>
								<span className="sensor-span">
									<img src={Img2} />
								</span>
								<a href={"/app/operation/Maintenance/"+this.props.match.params.id}>设备维护</a>
							</li>
							<li>
								<span className="sensor-span">
									<img src={Img3} />
								</span>
								<a href={"/app/operation/Sensor/"+this.props.match.params.id}>传感器标定</a>
							</li>
							<li>
								<span className="sensor-span">
									<img src={Img4} />
								</span>
								<a href={"/app/operation/DeviceStatus/"+this.props.match.params.id}>设备状态</a>
							</li>
							<li>
								<span className="sensor-span">
									<img src={Img5} />
								</span>
								<a href={"/app/operation/DeviceDetails/"+this.props.match.params.id}>设备详情</a>
							</li>
						</ul>
					</div>
				</div>
        {/* <span className="titleOfViews">测量数据展示</span> */}
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="PH" key="1">
            <PH deviceNum={deviceNum}/>
          </TabPane>
          <TabPane tab="电导率传感器" key="2">
            <Conduct deviceNum={deviceNum} />
          </TabPane>
					<TabPane tab="浊度传感器" key="3">
					  <Turbidity deviceNum={deviceNum}/>
					</TabPane>
					<TabPane tab="荧光度传感器" key="4">
						<Orp deviceNum={deviceNum}/>
					</TabPane>
					<TabPane tab="温度传感器" key="5">
						<Temper deviceNum={deviceNum}/>
					</TabPane>
					<TabPane tab="COD传感器" key="6">
						<COD deviceNum={deviceNum}/>
					</TabPane>
        </Tabs>
      </div>
    )
  }
	componentDidMount(){
		this.init();
		console.log('waterMonitor挂载')
	}
	
componentDidUpdate(){
		console.log('waterMonitor 更新')
	}
	componentWillUnmount(){
		console.log('waterMonitor卸载')
	}
	init = ()=>{
		let id = this.props.match.params.id;
		const me = this;
		let params = {deviceNum: id};
		let url = originalUrl+'device/allocation';
		model.fetch(params,url,'get',function(res){
			console.log('该设备数据：',res.data[0].client);
			let client_unit = res.data[0].client;
			me.setState({client_unit: client_unit,})
		})
	}
}

export default WaterMonitor;