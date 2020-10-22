import React, { Component } from 'react';
import { Table, Modal, Input, Button, Select, BackTop } from 'antd';
import axios from 'axios';
import { originalUrl } from '../../../dataModule/UrlList';
import { Model } from '../../../dataModule/testBone.js';
import history from '../../common/history.js';
import '../antd.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const model = new Model();

class Operation extends Component{
	constructor() {
	    super();
			this.state = {
				client_address: '',
				client_unit: '',
				//table data:数据 columns:表头 
				data:[],
				columns : [
				  { title: '设备编号', dataIndex: 'deviceNum', width: "20%", },
					{ title: '用户单位', dataIndex: 'client', width: "20%", },
					{ title: '地区', dataIndex: 'address', width: "20%", },
					{ title: '备注', dataIndex: 'allocation_remark', width: "20%", },
					{ title: '设备详情', key: 'deviceDetails', render: (record) => {
							return <Button type="primary" onClick={()=>{this.pushMonitor(record.deviceNum)}}>设备详情</Button>
						} 
					},
				],
			}
	}
	render(){
		const { client_address, client_unit, columns, data, } = this.state;
		return(
			<div>
				<div className="header">
					<h2>运维首页</h2>
					<span>地区筛选:</span>
					<Input className="antd-Input" value={client_address} onChange={(ev)=>{this.client_address(ev)}}/>
					<span>用户单位:</span>
					<Input className="antd-Input" value={client_unit} onChange={(ev)=>{this.client_unit(ev)}}/>
					<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
					<Button className="antd-Button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
					<Button className="antd-Button" type="primary" onClick={()=>{this.flash()}}>刷新</Button>
				</div>
				<div className="main">
					<Table className="antd-Table" columns={columns} dataSource={data} 
					pagination={{ pageSize: 8 }} scroll={{ y: '100%', x: "100%" }} />,
					{/* 回到顶部 */}
					<BackTop />
					<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
				</div>
			</div>
		)
	}
	componentDidMount(){
		console.log('gauzai')
		this.init();
	}
	componentWillUnmount(){
		console.log('xiezai')
	}
	//init 获取调拨设备的数据；
	init = ()=>{
		const me = this;
		let params = {};
		let url = originalUrl+'device/allocation/';
		model.fetch(params,url,'get',function(res){
			console.log('调拨设备的数据：',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				let num = data[i].host_Num;
				data[i]['key'] = data[i].id;
				if(res.data[i].status1 == 'a'){
					res.data[i].status1 = '正常';
				}else if(res.data[i].status1 == 'b'){
					res.data[i].status1 = '维护';
				}else if(res.data[i].status1 == 'c'){
					res.data[i].status1 = '停运';
				}else if(res.data[i].status1 == 'd'){
					res.data[i].status1 = '报废';
				}
				//根据客户单位查客户地区
				let client = data[i].client;
				let clientParams = {client_unit:client};
				let clientUrl = originalUrl+'client/clientInformation/';
				model.fetch(clientParams,clientUrl,'get',function(res){
					console.log('res.data:',res.data);
					data[i]['address'] = res.data[0].client_address
					console.log('data:',data)
					me.setState({data: data,});
				})
			}
			
		
		})
	}
	// 搜索部分client_address,client_unit  search reset
	client_address = (ev)=>{
		this.setState({client_address:ev.target.value});
	}
	client_unit = (ev)=>{
		this.setState({client_unit: ev.target.value});
	}
	search = ()=>{
		//请求数据
		const me = this;
		let params = {
			address: this.state.client_address,
			client: this.state.client_unit,
		};
		let url = originalUrl+'device/allocation/';
		model.fetch(params,url,'get',function(res){
			console.log('调拨设备的数据：',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				data[i]['key'] = data[i].id;
			}
			me.setState({data: res.data,});
		})
	}
	reset = ()=>{
		this.setState({
			client_address: '',
			client_unit: '',
		})
		this.init();
	}
	//跳转到对应设备详情页 id 为设备编号
	pushMonitor = (id)=>{
		history.push('/app/operation/WaterMonitor/'+id+'/');
	}
	flash = ()=>{
		console.log('data:',this.state.data,)
		this.setState({});
		console.log('data:',this.state.data,)
	}
}
export default Operation;