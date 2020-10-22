import React, { Component } from 'react';
import { Table, Modal, Input, Button, Select, BackTop } from 'antd';
import axios from 'axios';
import { Model } from '../../../dataModule/testBone.js';
import { originalUrl } from '../../../dataModule/UrlList';
import history from '../../common/history.js';
import '../antd.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Option } = Select;
const model = new Model();

class customerList extends Component{
	constructor() {
	    super();
			this.state = {
				// //搜索
				client_address:'',
				client_unit:'',
				
				//table data:数据 columns:表头 
				data: [],
				columns : [
				  { title: '客户单位', dataIndex: 'client_unit', width: '25%', },
				  { title: '地区', dataIndex: 'client_address', width: '25%', },
				  { title: '客户行业', dataIndex: 'client_industry', width: '25%', },
					{ title: '详情', key: 'operation', render: (record) => {
							return <Button type="primary" onClick={()=>{this.handlePush(record.id)}}>查看</Button>
						} 
					},
				],
				// 编辑 弹框 
				id: null,
				title: null,
				ModalVisible: false,
				ModalForm: {
					client_unit: '',
					client_address: '',
					client_industry: null,
					client_EM: null,
					client_tell: null,
					client_fax: null,
					remark: null,
				},
			}
	}
	render(){
		const { client_address, client_unit, columns, data, ModalForm, Modal1Visible, ModalVisible }  = this.state;
		return(
			<div>
				<div className="header">
					<h2>客户列表</h2>
					<span>地区筛选:</span>
					<Input className="antd-Input" value={client_address} onChange={(ev)=>{this.client_address(ev)}}/>
					<span>客户单位:</span>
					<Input className="antd-Input" value={client_unit} onChange={(ev)=>{this.client_unit(ev)}}/>
					<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
					<Button className="antd-Button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
					<Button style={{margin:'0.625rem 1.25rem'}} type="primary" onClick={()=>{this.ModalVisible()}}>新增客户</Button>
				</div>
				<div className="main">
					<Table className="antd-Table" columns={columns} dataSource={data} 
					pagination={{ pageSize: 8 }} scroll={{ y: '100%', x:'100%' }} />
				</div>
				<div className="customer-add">
					<Modal
						title="新增客户"
						visible={ModalVisible}
						onOk={this.handleModalOk}
						onCancel={this.handleModalCancel}
					>
					<span>客户单位:</span><Input value={ModalForm.client_unit} onChange={(ev)=>{this.ModalChange(ev,'client_unit')}}/><br/>
					<span>客户地址:</span><Input value={ModalForm.client_address} onChange={(ev)=>{this.ModalChange(ev,'client_address')}}/><br/>
					<span>客户邮编:</span><Input value={ModalForm.client_EM} onChange={(ev)=>{this.ModalChange(ev,'client_EM')}}/><br/>
					<span>客户行业:</span><Input value={ModalForm.client_industry} onChange={(ev)=>{this.ModalChange(ev,'client_industry')}}/><br/>	
					<span>单位电话:</span><Input value={ModalForm.client_tell} onChange={(ev)=>{this.ModalChange(ev,'client_tell')}}/><br/>
					<span>单位传真:</span><Input value={ModalForm.client_fax} onChange={(ev)=>{this.ModalChange(ev,'client_fax')}}/>
					<span>备注:</span><Input value={ModalForm.remark} onChange={(ev)=>{this.ModalChange(ev,'remark')}}/>
					</Modal>
				</div>
				{/* 回到顶部 */}
				<BackTop />
				<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
			</div>
		)
	}
	componentDidMount(){
		this.init();
	}
	//model.fetch(pararms,url,'get',whetherTest= false,function(res){})
	//init 初始化 获取客户列表中的数据 customer_basicInformation
	init = ()=>{
		const me = this;
		let url = originalUrl+'client/clientInformation/';
		let pararms = {};
	 	model.fetch(pararms,url,'get', function(res){
		console.log('客户信息res.data:',res.data)
		let data = res.data;
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i].id;
		}
			me.setState({data: data,});
		})
	}
	//筛选 输入框
	client_address = (ev)=>{
		this.setState({client_address: ev.target.value,})
	}
	client_unit = (ev)=>{
		this.setState({client_unit: ev.target.value,})
	}
	search = ()=>{
		const me = this;
		let url = originalUrl+'client/clientInformation/';
		let pararms = {client_unit:me.state.client_unit,client_address:me.state.client_address,}
		model.fetch(pararms,url,'get',function(res){
			console.log('请求到的筛选数据：',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				data[i]['key'] = data[i].id;
			}
				me.setState({data: data,});
			})
	}
	reset = ()=>{
		this.setState({
			client_unit:'',
			client_address:'',
		})
		this.init();
	}
	//查看用户详情 每行数据id
	handlePush = (id)=>{
		console.log('id:',id);
		history.push('CustomerDetails/'+id);
		
	}
	//Modal1Visible 弹出框 增加设备信息
	ModalVisible = ()=>{
		console.log('ModalForm:',this.state.ModalForm);
		this.setState({
			ModalVisible:true,
		})
	}
	ModalChange = (ev,key)=>{
		let form = {...this.state.ModalForm};    //key为onChange传的第二个参数
		for(let item in form){
			if(item === key){
				form[item] = ev.target.value
				this.setState({ModalForm: form})
			}
		}
	}
	handleModalOk = ()=>{
		let form = {...this.state.ModalForm};
		//发送form表  axios请求是异步的，所以会先执行下面的数据清除，所以复制两个form表数据
		const me = this;
		let url = originalUrl+'client/clientInformation/';
		let pararms = form;
		model.fetch(pararms,url,'post',function(res){
			console.log('发送新增用户表form:',res.data);
			//数据清空
			let Form = {...me.state.ModalForm};
			for(let item in Form){
				Form[item] = null;
			}
			me.setState({
				ModalVisible:false,
				ModalForm: Form,
			});
			//再次渲染 
			me.init();
		})
		
	}
	handleModalCancel = ()=>{
		this.setState({ModalVisible: false,})
	}
}
export default customerList;




