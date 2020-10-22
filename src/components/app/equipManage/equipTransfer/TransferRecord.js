import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, BackTop } from 'antd';
import axios from 'axios';
import { originalUrl } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import '../../antd.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const {Option} = Select;
const model = new Model();

class TransferRecord extends Component{
	constructor() {
	    super();
			this.state = {
				//头部筛选框 日期 客户单位 设别状态
				dateArea: [],
				client: "",
				//table data：数据 columns 表头
				data: [],
				columns:[
					{ title: '调拨时间', key: 'allocation_time', dataIndex: 'allocation_time', width: '12%', },
					{ title: '设备编号', key: 'deviceNum', dataIndex: 'deviceNum', width: '12%', },
					{ title: '设备运行状态', key: 'status1', dataIndex: 'status1', width: '12%', },
					{ title: '经办人', key: 'responsible_person', dataIndex: 'responsible_person', width: '12%', },
					{ title: '客户单位', key: 'client', dataIndex: 'client', width: '18%', },
					{ title: '客户单位接收人', key: 'associate', dataIndex: 'associate', width: '18%', },
					{ title: '备注', key: 'allocation_remark', dataIndex: 'allocation_remark'},
				],
			}
	}
	render(){
		const { dateArea, client,status1 ,columns, data, } = this.state;
		return(
			<div>
				<div className="header">
					<div className="title">
						<h2>设备调拨记录</h2>
					</div>
					<div className="box">
						<span>日期筛选:</span>
						<RangePicker className='antd-RangePicker' value={dateArea} onChange={(ev)=>{this.dateArea(ev)}} placeholder='Start' onOk={this.onOk}  showTime format="YYYY-MM-DD"/>
						<span>客户单位</span>
						<Input className="antd-Input" value={client} onChange={(ev)=>{this.client(ev)}}/>
						<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
						<Button className="antd-Button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
					</div>
				</div>
					<div className="main">
						<Table className="antd-Table" columns={columns} dataSource={data} 
						pagination={{ pageSize: 8 }} scroll={{ y: '100%',x:'100%', }}/>
						{/* 回到顶部 */}
						<BackTop />
						<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
					</div>
			</div>
		)
	}
	//挂载区
	componentDidMount(){
		this.init();
	}
	//init
	init = ()=>{
		const me = this;
		let params = {};
		let url = originalUrl + 'device/allocation/';
		model.fetch(params,url,'get',function(res){
			console.log('设备调拨记录数据:',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				data[i]['key'] = data[i]['id'];
				// data[i]['status1'] = '默认';
				//根据取得的data[i].devieNum 去device/deviceInformation中查status1插入data[i]中
				let deviceInforParams = {deviceNum: data[i]['deviceNum']};
				let deviceInforUrl = originalUrl + 'device/deviceInformation/';
				model.fetch(deviceInforParams,deviceInforUrl,'get',function(res){
					console.log(data[i]['deviceNum']+'的状态:',res.data[0]['status1']);
					//将状态码a-d转换 正常-报废
					if(res.data[0]['status1'] == 'a'){
						data[i]['status1'] = '正常';
					}else if(res.data[0]['status1'] == 'b'){
							data[i]['status1'] = '维护';
					}else if(res.data[0]['status1'] == 'c'){
							data[i]['status1'] = '停运(故障)';
					}else if(res.data[0]['status1'] == 'd'){
							data[i]['status1'] = '报废';
					}
					me.setState({data: data}); //异步请求，切记不能把setState放在异步请求之外，不然数据获取跟挂载就是分离的了，会导致挂载不上去
				})
			}
		})
	}
	// 头部筛选区域
		//日期选择
	dateArea = (value)=>{
		console.log('value:',value);
		console.log('momemt:',moment(value[0]._d).format('YYYY-MM-DD'));
		this.setState({
			dateArea: value,
		})
	}
	onOk = (value)=>{
		console.log('onOk:',value);
	}
	 //客户单位
	 client = (ev)=>{
		 this.setState({client: ev.target.value});
	 }
	search = ()=>{
		const me = this;
		let client = me.state.client;
		let dateArea = [...me.state.dateArea];
		let url = originalUrl+'device/allocation/';
		if(dateArea.length){
			let allocation_time1 = moment(dateArea[0]._d).format('YYYY-MM-DD');
			let allocation_time2 = moment(dateArea[1]._d).format('YYYY-MM-DD');
			let params = {
				allocation_time1: allocation_time1,
				allocation_time2: allocation_time2,
				client: client,
			}
			model.fetch(params,url,'get',function(res){
				console.log('筛选数据：',res.data);
				let data = res.data;
				for(let i=0;i<data.length;i++){
					data[i]['key'] = data[i]['id'];
				}
				me.setState({data: data})
			})
		}else{
			console.log('触发')
			let params = {client: client};
			model.fetch(params,url,'get',function(res){
				console.log('筛选数据：',res.data);
				let data = res.data;
				for(let i=0;i<data.length;i++){
					data[i]['key'] = data[i]['id'];
				}
				me.setState({data: data})
			})
		}
	}
	reset = ()=>{
		this.setState({
			dateArea: [],
			client: '',
		})
		this.init();
	}
}
export default TransferRecord;