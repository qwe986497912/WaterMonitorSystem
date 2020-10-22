import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select,BackTop } from 'antd';
import { originalUrl } from '../../../dataModule/UrlList';
import { Redirect, Route, Switch, withRouter, Link } from 'react-router-dom';
import { getCookie, setCookie } from "../../../helpers/cookies";
import { Model } from '../../../dataModule/testBone.js';
import '../antd.css';
// import { change } from '../commonFunction.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();

export default class Account extends Component{
	constructor(){
		super();
		this.state = {
			//筛选区域 
			username: '',
			position: '',
			character: '',
			//table data:数据 columns:表头
			data: [],
			columns : [
				{ title: '姓名', dataIndex: 'name', width: '6%', },
			  { title: '账户名称', dataIndex: 'username', width: '10%', },
			  { title: '账户密码', dataIndex: 'password', width: '6%', },
			  { title: '职位', dataIndex: 'position', width: '6%', },
				{ title: '角色', dataIndex: 'character', width: '6%', },
				{ title: '状态', dataIndex: 'status', width: '6%', },
				{ title: '联系方式', dataIndex: 'tell', width: '10%',},
				{ title: '创建时间', dataIndex: 'create_time', width: '6%', },
				{ title: '创建人', dataIndex: 'create_people', width: '6%', },
				{ title: '修改时间', dataIndex: 'repair_time', width: '6%', },
				{ title: '账户类型', dataIndex: 'account_type', width: '6%', },
				{ title: '账户权限', dataIndex: 'type', width: '6%', },
				{ title: '编辑', key: 'edit', render: (record) => {
						return <Button type="primary" onClick={()=>{this.Modal1Visible(record.id)}}>编辑</Button>
					} 
				},
				{ title: '删除', key: 'delete', render: (record) => {
						return <Button type="primary" onClick={()=>{this.handleDelete(record.id)}}>删除</Button>
					} 
				},
			],
			// 编辑 弹框
			id: '',    //编辑行的id
			title: '',
			Modal1Visible: false,
			Modal2Visible: false,
			create_time: null,
			repair_time: null,
			Modal1Form: {
				name: '',
				username: '',
				password: '',
				position: '',
				character: '',
				tell: '',
				status: '',
				create_people: '', //创建人应为登录账户人员
				account_type: '',
				type: '',
			},
		}
		this.create_time = this.create_time.bind(this);
	}
	render(){
		const { create_time, repair_time, username, position, character, data, columns, Modal1Form, Modal1Visible,Modal2Visible } = this.state;
		return(
			<div>
				<div className="header">
					<h2>账户管理</h2>
					<span>账户名称:</span>
					<Input className="antd-Input" value={username} onChange={(ev)=>{this.username(ev)}}/>
					<span>职位:</span>
					<Input className="antd-Input" value={position} onChange={(ev)=>{this.position(ev)}}/>
					<span>角色:</span>
					<Input className="antd-Input" value={character} onChange={(ev)=>{this.character(ev)}}/>
					<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
					<Button className="antd-Button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
					<Button style={{margin:'0.625rem 1.25rem'}} type="primary" onClick={()=>{this.Modal2Visible()}}>添加账户</Button>
				</div>
				<div className="main">
					<Table className="antd-Table" columns={columns} dataSource={data} 
					pagination={{ pageSize: 10 }} scroll={{ y: '100%', x:'100%' }} />
				</div>
				<div className="account-modify">
					<Modal
						title="账户信息修改"
						visible={Modal1Visible}
						onOk={this.handleModal1Ok}
						onCancel={this.handleModal1Cancel}
					>
					<span>姓名:</span><Input value={Modal1Form.name} onChange={(ev)=>{this.Modal2Change(ev,'name')}}/><br/>
					<span>账户名称:</span><Input value={Modal1Form.username} onChange={(ev)=>{this.Modal1Change(ev,'username')}}/><br/>
					<span>账户密码:</span><Input value={Modal1Form.password} onChange={(ev)=>{this.Modal1Change(ev,'password')}}/><br/>
					<span>职位:</span>
					<select style={{width: 472,height:32,border: '1px solid #d9d9d9'}} value={Modal1Form.position} onChange={(ev)=>{this.Modal2Change(ev,'position')}}>
						<option value=''></option>
						<option value="经理">经理</option>
						<option value="高级工程师">高级工程师</option>
						<option value="中级工程师">中级工程师</option>
						<option value="初级工程师">初级工程师</option>
						<option value="高级客户">高级客户</option>
						<option value="中级客户">中级客户</option>
						<option value="低级客户">低级客户</option>
					</select>
					<span>角色:</span>
					<select style={{width: 472,height:32,border: '1px solid #d9d9d9'}} value={Modal1Form.character} onChange={(ev)=>{this.Modal2Change(ev,'character')}}>
						<option value=''></option>
						<option value="项目经理">项目经理</option>
						<option value="工程经理">工程经理</option>
						<option value="普通工程师">普通工程师</option>
					</select>
					<span>联系方式:</span><Input value={Modal1Form.tell} onChange={(ev)=>{this.Modal1Change(ev,'tell')}}/><br/>
					<span>状态:</span>
					<select style={{width: 472,height:32,border: '1px solid #d9d9d9'}} onChange={(ev)=>{this.Modal2Change(ev,'status')}} value={Modal1Form.status}>
						<option value=''></option>
						<option value="1">活跃</option>
						<option value="0">冻结</option>
					</select>
					{/* 
						<span>创建人:</span><Input value={Modal1Form.create_people} onChange={(ev)=>{this.Modal1Change(ev,'create_people')}}/><br/>
					 */}
					<span>创建日期:</span>
					<DatePicker style={{width: 472}} value={create_time} onChange={this.create_time} placeholder='' onOk={this.onOk}  showTime format="YYYY-MM-DD"/><br/>
					<span>账户类型:</span>
					<select style={{width: 472,height:32,border: '1px solid #d9d9d9'}} onChange={(ev)=>{this.Modal2Change(ev,'account_type')}} value={Modal1Form.account_type}>
						<option value=''></option>
						<option value="0">企业</option>
						<option value="1">客户</option>
					</select>
					<span>账户权限:</span><br/>
					<select style={{width: 472,height:32,border: '1px solid #d9d9d9'}} onChange={(ev)=>{this.Modal2Change(ev,'type')}} value={Modal1Form.type}>
						<option value=''></option>
						<option value="3">dba</option>
						<option value="2">管理用户</option>
						<option value="1">普通用户</option>
					</select>
					</Modal>
				</div>
				<div className="account-add">
					<Modal
						title="添加账户"
						visible={Modal2Visible}
						onOk={this.handleModal2Ok}
						onCancel={this.handleModal2Cancel}
					>
					<span>姓名:</span><Input value={Modal1Form.name} onChange={(ev)=>{this.Modal2Change(ev,'name')}}/><br/>
					<span>账户名称:</span><Input value={Modal1Form.username} onChange={(ev)=>{this.Modal2Change(ev,'username')}}/><br/>
					<span>账户密码:</span><Input value={Modal1Form.password} onChange={(ev)=>{this.Modal2Change(ev,'password')}}/><br/>
					<span>职位:</span>
					<select style={{width: 472,height:32,border: '1px solid #d9d9d9'}} value={Modal1Form.position} onChange={(ev)=>{this.Modal2Change(ev,'position')}}>
						<option value=''></option>
						<option value="经理">经理</option>
						<option value="高级工程师">高级工程师</option>
						<option value="中级工程师">中级工程师</option>
						<option value="初级工程师">初级工程师</option>
						<option value="高级客户">高级客户</option>
						<option value="中级客户">中级客户</option>
						<option value="低级客户">低级客户</option>
					</select>
					<span>角色:</span>
					<select style={{width: 472,height:32,border: '1px solid #d9d9d9'}} value={Modal1Form.character} onChange={(ev)=>{this.Modal2Change(ev,'character')}}>
						<option value=''></option>
						<option value="项目经理">项目经理</option>
						<option value="工程经理">工程经理</option>
						<option value="普通工程师">普通工程师</option>
					</select>
					<span>联系方式:</span><Input value={Modal1Form.tell} onChange={(ev)=>{this.Modal1Change(ev,'tell')}}/><br/>
					<span>状态:</span>
					<select style={{width: 472,height:32,border: '1px solid #d9d9d9'}} onChange={(ev)=>{this.Modal2Change(ev,'status')}} value={Modal1Form.status}>
						<option value=''></option>
						<option value="1">活跃</option>
						<option value="0">冻结</option>
					</select>
					{/* 
					 <span>创建人:</span><Input value={Modal1Form.create_people} onChange={(ev)=>{this.Modal2Change(ev,'create_people')}}/><br/>
					 */}
					<span>账户类型:</span>
					<select style={{width: 472,height:32,border: '1px solid #d9d9d9'}} onChange={(ev)=>{this.Modal2Change(ev,'account_type')}} value={Modal1Form.account_type}>
						<option value=''></option>
						<option value="0">企业</option>
						<option value="1">客户</option>
					</select>
					<span>账户权限:</span><br/>
					<select style={{width: 472,height:32,border: '1px solid #d9d9d9'}} onChange={(ev)=>{this.Modal2Change(ev,'type')}} value={Modal1Form.type}>
						<option value=''></option>
						<option value="3">dba</option>
						<option value="2">管理用户</option>
						<option value="1">普通用户</option>
					</select>
					</Modal>
				</div>
				{/* 回到顶部 */}
				<BackTop />
				<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
			</div>
		);
	}
	componentDidMount(){
		this.init();
	}
	changeStatus = (data)=>{
		//状态转码
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i]['id'];
			if(data[i]['status'] == 1){
				data[i]['status'] = '活跃';
			}else if(data[i]['status'] == 0){
				data[i]['status'] = '冻结';
			}
		}
		//账户权限转码
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i]['id'];
			if(data[i]['type'] == 1){
				data[i]['type'] = '普通用户';
			}else if(data[i]['type'] == 2){
				data[i]['type'] = '管理用户';
			}else if(data[i]['type'] == 3){
				data[i]['type'] = 'dba';
			}
		}
		//账户类型转码
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i]['id'];
			if(data[i]['account_type'] == 0){
				data[i]['account_type'] = '企业';
			}else if(data[i]['account_type'] == 1){
				data[i]['account_type'] = '客户';
			}
		}
	}
	//init
	init = ()=>{
		const me = this;
		let params = {};
		let url = originalUrl + 'account/User/';
		model.fetch(params,url,'get',function(res){
			console.log('获取到的账户数据：',res.data);
			let data = res.data;
			me.changeStatus(data);
			me.setState({data:data});
		})
	}
	//查询区域 username position character
	username = (ev)=>{
		this.setState({username:ev.target.value})
	}
	position = (ev)=>{
		this.setState({position: ev.target.value});
	}
	character = (ev)=>{
		this.setState({character: ev.target.value});
	}
	search = ()=>{
		const me = this;
		let username = me.state.username;
		let position = me.state.position;
		let character = me.state.character;
		let params = {username:username,position:position,character:character};
		let url = originalUrl + 'account/User';
		model.fetch(params,url,'get',function(res){
			console.log('搜索到的账户数据：',res.data);
			let data = res.data;
			me.changeStatus(data);
			me.setState({data: data});
		})
	}
	reset = ()=>{
		this.setState({
			username: '',
			position: '',
			character: '',
		})
		this.init();
	}
	//添加账户
	Modal2Visible = ()=>{
		this.setState({
			Modal2Visible:true,
		})
	}
	Modal2Change = (ev,key)=>{
		console.log('value:',ev.target.value)
		let form = {...this.state.Modal1Form};    //key为onChange传的第二个参数
		for(let item in form){
			if(item === key){
				form[item] = ev.target.value
				this.setState({Modal1Form: form})
			}
		}
	}
	//创建日期 不填写，默认当前时间
	
	handleModal2Ok = ()=>{
		//cookie中取username
		let create_people;
		//cookie不存在重定向到登录界面
		if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
		  return <Redirect to="/login" />
		} else {
						create_people = JSON.parse(getCookie("mspa_user")).username;
		}
		let create_time = moment().format('YYYY-MM-DD');
		let form = {...this.state.Modal1Form};
		const me = this;
		let params = {...form,create_time:create_time,create_people:create_people};
		let url = originalUrl + 'account/User/';
		//发送form表  axios请求是异步的，所以会先执行下面的数据清除
		model.fetch(params,url,'post',function(res){
			console.log('res.data:',res.data);
			//记录下创建时间,将创建时间和设备信息传入设备信息修改记录表中
			   //数据清空
			let Form = {...me.state.Modal1Form};
			for(let item in Form){
				Form[item] = '';
			}
			me.setState({
				Modal2Visible:false,
				Modal1Form: Form,
				create_time: [],
			});
			//再次渲染 
			me.init();
		})
	}
	handleModal2Cancel = ()=>{
		let Form = {...this.state.Modal1Form};
		let production_date = this.state.production_date;
		for(let item in Form){
			Form[item] = '';
		}
		this.setState({
			Modal2Visible: false,
			Modal1Form: Form,
			create_time: [],
		})
	}

//编辑数据
Modal1Visible = (id)=>{
	console.log('id:',id);
	const me = this;
	let params = {id:id};
	let url = originalUrl + 'account/User/';
	model.fetch(params,url,'get',function(res){
		console.log(id+'的编辑的数据：',res.data);
		let data = res.data[0];
		let create_time = moment(data['create_time'],'YYYY-MM-DD');
		let repair_time = [];
		if(repair_time.length){
			repair_time = moment(data['repair_time'],'YYYY-MM-DD');
		}else{
			repair_time = null;
		}
		let Modal1Form = {...me.state.Modal1Form};
		for(let item in data){
			for(let key in Modal1Form){
				if(item == key){
					Modal1Form[key] = data[item];
				}
			}
		}
		me.setState({
			id:id,
			create_time: create_time,
			repair_time: repair_time,
			Modal1Form: Modal1Form,
			Modal1Visible:true,
		})
	})
}
//创建时间 触发事件
create_time = (value)=>{
	console.log('value:',value)
	let create_time = moment(value[0]._d).format('YYYY-MM-DD');
	console.log('create_time:',create_time);
	this.setState({create_time: value})
}
//触发事件
Modal1Change = (ev,key)=>{
	console.log('ev.target.value:',ev.target.value)
		let form = {...this.state.Modal1Form};
		for(let item in form){
			if(item === key){
				form[item]=ev.target.value
				this.setState({Modal1Form: form})
			}
		}
	}
//ok 发送编辑的数据
handleModal1Ok = ()=>{
	//cookie中取username
	let create_people;
	//cookie不存在重定向到登录界面
	if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
	  return <Redirect to="/login" />
	} else {
					create_people = JSON.parse(getCookie("mspa_user")).username;
	}
	const me = this;
	let id = me.state.id;
	let Modal1Form = {...me.state.Modal1Form};
	let create_time = moment(me.state.create_time).format('YYYY-MM-DD');
	let repair_time = moment().format('YYYY-MM-DD');
	let params = {...Modal1Form,create_time:create_time,repair_time:repair_time,create_people:create_people};
	let url = originalUrl + 'account/User/'+id+'/';
	model.fetch(params,url,'put',function(res){
		console.log('编辑账户修改成功');
		let Form = {...me.state.Modal1Form};
		for(let item in Form){
			Form[item] = '';
		}
		me.setState({
			Modal1Form:Form,
			create_time:null,
			repair_time:null,
			Modal1Visible:false,
		})
		me.init();
	})
}
//取消
handleModal1Cancel = ()=>{
	let Modal1Form = {...this.state.Modal1Form};
	for(let item in Modal1Form){
		Modal1Form[item] = '';
	}
	this.setState({
		Modal1Visible:false,
		Modal1Form:Modal1Form,
		create_time: null,
		repair_time: null,
	})
}
//delete 
handleDelete = (id)=>{
	console.log('id:',id);
	const me = this;
	let params = {};
	let url = originalUrl + 'account/User/'+id+'/';
	model.fetch(params,url,'delete',function(res){
		console.log('删除成功')
		me.init();
	})
}
}