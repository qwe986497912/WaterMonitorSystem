import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, BackTop  } from 'antd';
import { originalUrl } from '../../../dataModule/UrlList';
import { Model } from '../../../dataModule/testBone.js';
import history from '../../common/history.js';
import { PH, Temper, ORP } from './remindRecord/Sensors.js';
import RemindModal from './remindRecord/RemindRecord.js';
import '../antd.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();

class RemindRecord extends Component{
	constructor(props) {
	    super(props);
			console.log(this.props.match.params.id)  //设备编号
			this.state = {
				//设备编号 用户单位
				deviceNum: '',
				client_unit: '',
				//搜索框 dateArea indicator
				dateArea: [],
				indicator: '',
				handle: '',
				//表格 时间 指标 测量值 提示内容 是否处理 处理（action)
				data: [],
				columns : [
					{ title: '时间', key:'time', dataIndex: 'time', width: 150, },
					{ title: '指标', key:'indicator', dataIndex: 'indicator', width: 150, },
					{ title: '测量值', key:'value', dataIndex: 'value', width: 150, },
				  { title: '提示内容', key:'reminder', dataIndex: 'reminder', width: 150, },
				  { title: '是否处理', key:'handle',dataIndex: 'handle', width: 150, },
					{ title: '处理', key: 'handleAction', render: (record) => {
							return <Button type="primary" onClick={()=>{this.handleAction(record.id)}}>处理</Button>
						} 
					},
				],
				//传感器阈值初始化
				threshold: {
					ph:'',
					temper:'',
					conductivity:'',
					turbidity:'',
					orp:'',
					corrosion:'',
				}
			}
			this.flash = this.flash.bind(this);
	}
	render(){
		const { dateArea, indicator, handle, data, columns, deviceNum, client_unit } = this.state;
		return(
			<div style={{height:'100%',position: 'relative'}}>
				<div className="header" style={{width: '100%', height: '48px'}}>
					<h2 style={{fontSize: '1.5rem',color:'#1890ff'}}>水质提醒记录</h2>
					<div className="title">
						<h2 style={{margin: 0,padding: 0,float: 'left'}}>设备编号:{deviceNum}</h2>
						<h2 style={{margin: 0,padding: 0,float: 'right',}}>用户单位:&nbsp;&nbsp;{client_unit}</h2>
					</div>
					<div className="threshold" style={{marginTop:'50px',height: '150px'}}>
						<h3 style={{color:' rgb(24, 144, 255)'}}>传感器阈值设定</h3>
						<RemindModal deviceNum={this.props.match.params.id} flash={this.flash}/>
					</div> 
					<div className="search" style={{marginTop:'70px'}}>
						<span>日期筛选:</span>
						<RangePicker className='antd-RangePicker' value={dateArea} onChange={this.dateArea} placeholder='' onOk={this.onOk}  showTime format="YYYY-MM-DD HH:mm:ss"/>
						<span>指标:</span>
						<select className="selectShort" value={indicator} onChange={(ev)=>{this.indicator(ev)}}>
							<option value=''></option>
							<option value='PH值'>PH</option>
							<option value='温度'>温度</option>
							<option value='浊度'>浊度</option>
							<option value='ORP'>ORP</option>
							<option value='腐蚀速率'>腐蚀速率</option>
							<option value='电导率'>电导率</option>
						</select>
						<span>是否处理:</span>
						<select className="selectShort" value={handle} onChange={(ev)=>{this.handle(ev)}}>
							<option value=''></option>
							<option value='已处理'>已处理</option>
							<option value='未处理'>未处理</option>
						</select>
						<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
						<Button className="antd-Button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
					</div>
				</div>
				<div className="main" style={{marginTop: 320,width: '100%',height: 700}}>
					<Table className="antd-Table" columns={columns} dataSource={data}
					pagination={{ pageSize: 10 }} scroll={{ y: 400,x:900, }}/>
					{/* 回到顶部 */}
					<BackTop />
					<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
				</div>
			</div>
		)
	}
	componentDidMount(){
		console.log('refs:',this.refs.PH)
		//定时刷新
		this.threshold();
		this.judge();
		this.getData();
		this.timer = setInterval(()=>{
			this.judge();
			this.getData();
		},100000)
	}
	
	//threshold() 比如取name='PH传感器',取出几条数据，选择最新的一条吧值覆盖到data
	threshold = ()=>{
		const me = this;
		let deviceNum = me.props.match.params.id;
		console.log('deviceNum:',deviceNum)
		let params = {deviceNum:deviceNum};
		let url = originalUrl + 'operation/limit/';
		model.fetch(params,url,'get',function(res){
			console.log('传感器阈值：',res.data);
			let data = res.data;
			if(data.length){
				console.log('传感器已经设定阈值')
				me.setState({
					threshold:data[0],
				});
			}else{
				console.log('kong')
				let data = {
					key: 1,
					ph: '5-10',
					conductivity: '5-10',
					turbidity: '5-10',
					corrosion: '5-10',
					orp: '5-10',
					temper: '5-10',
				}
				me.setState({
					threshold:data,
				});
			}
		})
	}
	//定时判断测量数据是否超阀值 
	judge = ()=>{
		console.log('judge 执行')
		const me = this;
		let deviceNum = me.props.match.params.id;   //设备编号
		let params = {deviceNum: deviceNum};
		let url = originalUrl+'/sensor/value';
		model.fetch(params,url,'get',function(res){
			console.log('请求到的测量数据：',res.data);
			let data = res.data;
			// 判断6个传感器
			let threshold = {...me.state.threshold};
			console.log('threshold:',threshold)
			for(let item in threshold){
				console.log('item:',item)
				if(item == 'ph'){
					console.log('ph匹配')
					let arr = threshold[item].split('-');
					PH(data,deviceNum,arr[0],arr[1]);
				}else if(item == 'temper'){
					console.log('temper')
					let arr = threshold[item].split('-');
					console.log('arr:',arr);
					Temper(data,deviceNum,arr[0],arr[1]);
				}else if(item == 'orp'){
					console.log('orp')
					let arr = threshold[item].split('-');
					console.log('arr:',arr);
					ORP(data,deviceNum,arr[0],arr[1]);
				}
			}
		})
	}
	//定时从水质提醒记录表拿数据
	getData = ()=>{
		console.log('getdata 执行')
		console.log('this.props:',this.props.match.params.id)
		const me = this;
		let deviceNum = me.props.match.params.id;
		let params = {deviceNum:deviceNum};
		let url = originalUrl+'operation/reminder/';
		model.fetch(params,url,'get',function(res){
			console.log('水质提醒记录：',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				data[i].key = data[i].id;
				data[i].time = moment(data[i].time).format('YYYY-MM-DD HH:mm:ss');
			}
			me.setState({data: data});
		})
		//获取client_unit
		let clientParams = {deviceNum: deviceNum};
		let clientUrl = originalUrl+'device/allocation/';
		model.fetch(clientParams,clientUrl,'get',function(res){
			console.log('该设备数据：',res.data[0].client);
			let client_unit = res.data[0].client;
			me.setState({
				deviceNum: deviceNum,
				client_unit: client_unit,
			})
		})
	}
	//搜索区域
	dateArea = (value)=>{
		console.log('value:',value);
		this.setState({dateArea: value});
	}
	onOk = (value)=>{
		if(value.length){
			console.log(moment(value[1]._d).format('YYYY-MM-DD HH:mm:ss'));
		}else{
			alert('日期不能为空');
		}
	}
	indicator = (ev)=>{
		this.setState({indicator: ev.target.value});
	}
	handle = (ev)=>{
		this.setState({handle: ev.target.value});
	}
	search = ()=>{
		const me = this;
		let dateArea = [...me.state.dateArea]
		let start_time = '';
		let end_time = '';
		if(dateArea.length){
			start_time = moment(dateArea[0]._d).format('YYYY-MM-DD HH:mm:ss');
			end_time = moment(dateArea[1]._d).format('YYYY-MM-DD HH:mm:ss');
		}else{
			start_time = '1999-10-10 16:16:16';
			end_time = '1999-10-10 16:16:16';
		}
		let indicator = me.state.indicator;
		let handle = me.state.handle;
		let url = originalUrl+'operation/reminder/';
		if(dateArea.length){
			let params = {start_time:start_time,end_time:end_time,indicator:indicator,handle:handle}
			model.fetch(params,url,'get',function(res){
				console.log('res.data:',res.data);
				let data = res.data;
				for(let i=0;i<data.length;i++){
					data[i].key = data[i].id;
					data[i].time = moment(data[i].time).format('YYYY-MM-DD HH:mm:ss');
				}
				me.setState({data: data});
			})
		}else{
			let params = {indicator:indicator,handle:handle};
			model.fetch(params,url,'get',function(res){
				console.log('res.data:',res.data);
				let data = res.data;
				for(let i=0;i<data.length;i++){
					data[i].key = data[i].id;
					data[i].time = moment(data[i].time).format('YYYY-MM-DD HH:mm:ss');
				}
				me.setState({data: data});
			})
		}
	}
	reset = ()=>{
		this.setState({
			indicator: '',
			dateArea: [],
			handle: '',
		})
		this.getData();
	}
	//处理
	handleAction = (id)=>{
		console.log('id:',id);
		let handle = '已处理';
		const me = this;
		let params = {handle:handle};
		let url = originalUrl+'operation/reminder/'+id+'/';
		model.fetch(params,url,'put',function(res){
			console.log('修改成功');
			me.getData();
		})
	}
	//用来子组件给父组件传值，刷新父组件
	flash = (value)=>{
		console.log('value:',value)
		if(value){
			this.getData();
			this.judge();
		}
	}
}
export default RemindRecord;