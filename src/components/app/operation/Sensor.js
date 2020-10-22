import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, BackTop } from 'antd';
import axios from 'axios';
import { originalUrl } from '../../../dataModule/UrlList';
import { Model } from '../../../dataModule/testBone.js';
import SensorModal from './sensors/SensorModal.js';
import history from '../../common/history.js';
import { timestampToTime, utcToTime } from '../../../publicFunction/index.js';
import '../antd.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();

class Sensor extends Component{
	constructor(props) {
	    super(props);
			this.state = {
				//设备编号 用户单位
				deviceNum: '',
				client_unit: '',
				//搜索框 dateArea sensor
				dateArea: [],
				sensor: '',
				//传感器标定记录 表格 时间 指标 测量值 提示内容 是否处理 处理（action)
				data: [],
				columns : [
					{ title: '时间', key:'time', dataIndex: 'time', width: 150, },
					{ title: '传感器', key:'sensor_name', dataIndex: 'sensor_name', width: 150, },
					{ title: '理论值', key:'sensor_value1', dataIndex: 'sensor_value1', width: 150, },
				  { title: '实测值', key:'sensor_value2', dataIndex: 'sensor_value2', width: 150, },
				],
			}
			this.flash = this.flash.bind(this);
	}
	render(){
		const { dateArea, sensor, data, columns, deviceNum, client_unit } = this.state;
		return(
			<div style={{height:'100%',position: 'relative'}}>
				<div className="header" style={{width: '100%', height: '500px'}}>
					<h2 style={{fontSize: '1.5rem',color:'#1890ff'}}>传感器标定</h2>
					<div className="title">
						<h2 style={{margin: 0,padding: 0,float: 'left'}}>设备编号:{deviceNum}</h2>
						<h2 style={{margin: 0,padding: 0,float: 'right',}}>用户单位:&nbsp;&nbsp;{client_unit}</h2>
					</div>
					<div style={{width:'100%',height: '400px',marginTop:'50px',}}>
						<SensorModal deviceNum={this.props.match.params.id} flash={this.flash}/>
					</div>
				</div>
				<div className="main" style={{marginTop:'50px',width: '100%',height: 700}}>
					<div className="search" style={{}}>
					<h2 style={{fontSize: '1.5rem',color:'#1890ff'}}>传感器标定记录</h2>
						<span>日期筛选:</span>
						<RangePicker className='antd-RangePicker' value={dateArea} onChange={(value)=>{this.dateArea(value)}} placeholder='' onOk={(value)=>{this.onOk(value)}}  showTime format="YYYY-MM-DD HH:mm:ss"/>
						<span>传感器:</span>
						<Select className="antd-Select" onChange={(value)=>{this.sensor(value)}}>
							<Option value='PH传感器'>PH传感器</Option>
							<Option value='电导率传感器'>电导率传感器</Option>
							<Option value='浊度传感器'>浊度传感器</Option>
							<Option value='COD'>COD</Option>
							<Option value='荧光度传感器'>荧光度传感器</Option>
							<Option value='PLC'>PLC</Option>
						</Select>
						<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
						<Button className="antd-Button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
					</div>
					<Table className="antd-Table" columns={columns} dataSource={data}
					pagination={{ pageSize: 10 }} scroll={{ y: 400,x:700, }}/>
					{/* 回到顶部 */}
					<BackTop />
					<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
				</div>
			</div>
		)
	}
	componentDidMount(){
		this.store();
		this.init();
	}
	//将设备编号和用户单位存储
	store = ()=>{
		console.log('store 执行')
		const me = this;
		let deviceNum = me.props.match.params.id; //设备编号
		console.log('deviceNum:',deviceNum)
		let params = {deviceNum: deviceNum};
		let url = originalUrl+'device/allocation';
		model.fetch(params,url,'get',function(res){
			console.log('该设备数据：',res.data[0].client);
			let client_unit = res.data[0].client;
			me.setState({
				deviceNum: deviceNum,
				client_unit: client_unit,
			})
		})
	}
	//init 设备标定记录数据
	init = ()=>{
		const me = this;
		let params = {deviceNum: this.props.match.params.id};
		let url = originalUrl+'operation/calibration/';
		model.fetch(params,url,'get',function(res){
			console.log('设备标定数据：',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				data[i]['key'] = data[i]['id'];
				data[i]['time'] = moment(data[i]['time']).format('YYYY-MM-DD HH:mm:ss')
			}
			me.setState({data: data});
		})
	}
	//筛选区域 筛选日期 传感器
	sensor = (value)=>{
		console.log('select value:',value);
		this.setState({sensor: value});
	}
	dateArea = (value)=>{
		console.log('dateArea value:',value);
		this.setState({dateArea: value});
	}
	onOk = (value)=>{
		if(value.length){
			console.log('moment 时间start：',moment(value[0]._d).format('YYYY-MM-DD HH:mm:ss'));
			console.log('moment 时间end：',moment(value[1]._d).format('YYYY-MM-DD HH:mm:ss'));
		}else{
			console.log('日期为空');
		}
	}
	search = ()=>{
		const me = this;
		let sensor = me.state.sensor;
		let dateArea = [...me.state.dateArea];
		let url = originalUrl+'operation/calibration/';
		if(dateArea.length){
			let start_time = moment(dateArea[0]._d).format('YYYY-MM-DD HH:mm:ss');
			let end_time = moment(dateArea[1]._d).format('YYYY-MM-DD HH:mm:ss');
			let params = {start_time:start_time,end_time:end_time,sensor_name:sensor};
			model.fetch(params,url,'get',function(res){
				console.log('标定日期筛选数据：',res.data);
				let data = res.data;
				for(let i=0;i<data.length;i++){
					data[i]['key'] = data[i]['id'];
				}
				me.setState({data: data});
			})
		}else{
			let params = {sensor_name:sensor};
			model.fetch(params,url,'get',function(res){
				console.log('标定日期筛选数据：',res.data);
				let data = res.data;
					for(let i=0;i<data.length;i++){
						data[i]['key'] = data[i]['id'];
					}
					me.setState({data: data});
				})
			}
		}
		reset = ()=>{
			this.setState({
				dateArea: [],
				sensor: '',
			})
			this.init();
		}
		//用来子组件给父组件传值，刷新父组件
		flash = (value)=>{
			console.log('value:',value)
			if(value){
				this.init();
			}
		}
}
export default Sensor;