import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, Popconfirm, BackTop } from 'antd';
import axios from 'axios';
import { originalUrl } from '../../../dataModule/UrlList';
import { Model } from '../../../dataModule/testBone.js';
import history from '../../common/history.js';
import EditableFormTableMainten from './maintenance/EditableTable.js';
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

class DeviceStatus extends Component{
	constructor(props) {
	    super(props);
			this.state = {
				data: {
					id:'',           //设备id
					deviceNum: '',   //设备编号
					client_unit: '', //用户单位
				},
				select: '',
			}
	}
	render(){
		const { data, select, } = this.state;
		return(
			<div style={{height:'100%',position: 'relative'}}>
				<div className="header" style={{width: '100%', height: '48px'}}>
					<h2 style={{fontSize: '1.5rem',color:'#1890ff'}}>设备状态</h2>
					<div className="title">
						<h2 style={{margin: 0,padding: 0,float: 'left'}}>设备编号:{data.deviceNum}</h2>
						<h2 style={{margin: 0,padding: 0,float: 'right',}}>用户单位:&nbsp;&nbsp;{data.client_unit}</h2>
					</div>
				</div>
				<div className="main" style={{marginTop: 35,width: '100%',height: 700}}>
					<div style={{width: '457px',height:'600px'}}>
						<img src={Device} style={{width: '457px',height:'600px'}}/>
					</div>
					<div style={{position: 'absolute',left:'500px',top: '100px'}}>
						<select className="select" value={select} onChange={(ev)=>{this.select(ev)}}>
							<option value=""></option>
							<option value="a">正常</option>
							<option value="b">维护</option>
							<option value="c">停运(故障)</option>
							<option value="d">报废</option>
						</select>
						<Popconfirm title="确定修改?" onConfirm={() => this.handleClick()}>
						 <Button type="primary">确认修改</Button>
						</Popconfirm>
						{/* 回到顶部 */}
						<BackTop />
						<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
					</div>
				</div>
			</div>
		)
	}
	
	
	componentDidMount(){
		console.log('挂载')
		this.init();
	}
	init = ()=>{
		let data = {...this.state.data}
		//获取用户单位
		let deviceNum = this.props.match.params.id; //设备编号
		console.log('deviceNum:',deviceNum)
		const me = this;
		let Queryparams = {deviceNum: deviceNum};
		let clientUrl = originalUrl+'device/allocation';
		model.fetch(Queryparams,clientUrl,'get',function(res){
			console.log('该设备数据：',res.data[0].client);
			let client_unit = res.data[0].client;
			data['client_unit'] = client_unit;
			data['deviceNum'] = deviceNum;
			console.log('data:',data)
			me.setState({
				data: data,
			})
		})
		//获取用户id
		let deviceInformationUrl = originalUrl+'device/deviceInformation';
		model.fetch(Queryparams,deviceInformationUrl,'get',function(res){
			console.log('该条设备信息：',res.data);
			let id = res.data[0].id;
			data['id'] = id;
			let status1 = res.data[0].status1;
			console.log('status1:',status1)
			me.setState({
				data: data,
				select: status1,
			});
		})
	}
	select = (ev)=>{
		this.setState({
			select: ev.target.value,
		})
	}
	handleClick = ()=>{
		let id = this.state.data.id;
		let deviceNum = this.state.data.deviceNum;
		let status1 = this.state.select;
		const me = this;
		let params = {status1:status1,deviceNum:deviceNum};
		let url = originalUrl+'device/deviceInformation/'+id+'/';
		model.fetch(params,url,'put',function(res){
			console.log('修改成功');
		})
	}
	
}
export default DeviceStatus;