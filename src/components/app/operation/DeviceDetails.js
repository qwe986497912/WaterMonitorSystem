import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, BackTop } from 'antd';
import axios from 'axios';
import { originalUrl } from '../../../dataModule/UrlList';
import { Model } from '../../../dataModule/testBone.js';
import history from '../../common/history.js';
import DeviceDetailsTable from './deviceDetails/DeviceDetailsTable.js';
import { timestampToTime, utcToTime } from '../../../publicFunction/index.js';
import Device from '../../../statistics/设备.png';
import '../antd.css';
// import { change } from '../commonFunction.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();

class DeviceDetails extends Component{
	constructor(props) {
	    super(props);
			this.state = {
				//设备编号 用户单位
				deviceNum: '',
				client_unit: '',
			}
	}
	render(){
		const { deviceNum, client_unit, } = this.state;
		return(
			<div>
				<div className="header" style={{width:'100%',height:'100px'}}>
					<h2 style={{fontSize: '1.5rem',color:'#1890ff'}}>设备详情</h2>
					<div className="title">
						<h2 style={{margin: 0,padding: 0,float: 'left'}}>设备编号:{deviceNum}</h2>
						<h2 style={{margin: 0,padding: 0,float: 'right',}}>用户单位:&nbsp;&nbsp;{client_unit}</h2>
					</div>
				</div>
				<div className="main" style={{width:'100%',height:'500px'}}>
					<DeviceDetailsTable deviceNum={ this.props.match.params.id}/>
					{/* 回到顶部 */}
					<BackTop />
					<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
				</div>
			</div>
		)
	}
	componentDidMount(){
		this.store();
	}
	//获取用户单位 和设备编号
	store = ()=>{
		console.log('store 执行')
		const me = this;
		let deviceNum = me.props.match.params.id; //设备编号
		console.log('deviceNum:',deviceNum)
		let params = {deviceNum: deviceNum};
		let url = originalUrl+'device/allocation/';
		model.fetch(params,url,'get',function(res){
			console.log('该设备数据：',res.data[0].client);
			let client_unit = res.data[0].client;
			me.setState({
				deviceNum: deviceNum,
				client_unit: client_unit,
			})
		})
	}
}
export default DeviceDetails;