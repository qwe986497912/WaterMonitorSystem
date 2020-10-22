import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, BackTop } from 'antd';
import { Redirect, Route, Switch, withRouter, Link } from 'react-router-dom';
import { getCookie, setCookie } from "../../../../helpers/cookies";
import { originalUrl } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import '../../antd.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Option } = Select;
const model = new Model();

class TransferBasic extends Component{
	constructor() {
	    super();
			this.state = {
				//header 搜索框
				host_Num: '',
				deviceNum: '',
				// table data: 数据 columns 表头
				data: [],
				columns: [
					{ title: '主机编号', key:'host_Num', dataIndex: 'host_Num', width: '7%', },
					{ title: '主机名称', key:'host_Name', dataIndex: 'host_Name', width: '7%', },
					{ title: '设备编号', key:'deviceNum', dataIndex: 'deviceNum', width: '7%', },
					{ title: 'PH传感器', key:'PH', dataIndex: 'PH', width: '7%', },
					{ title: '电导率传感器', key:'conductivity', dataIndex: 'conductivity', width: '7%', },
					{ title: '浊度传感器', key:'turbidity', dataIndex: 'turbidity', width: '7%', },
					{ title: 'orp传感器', key:'orp', dataIndex: 'orp', width: '7%', },
					{ title: '腐蚀速率', key:'corrosion', dataIndex: 'corrosion', width: '7%', },
					{ title: '温度传感器', key:'temper', dataIndex: 'temper', width: '7%', },
					{ title: '运行状态', key:'status1', dataIndex: 'status1', width: '7%', },
					{ title: '备注', key:'remark', dataIndex: 'remark', width: '7%', },
					{ title: '操作', render: (record) => {
							return <Button type="primary" onClick={()=>{this.ModalVisible(record.id)}}>申请调拨</Button>
						} 
					},
				],
				receiveForm: {
					host_Num: '',  //要留着上传
					host_Name: '',
					deviceNum: '',  //要留着上传
					PH: '',
					conductivity: '',
					turbidity: '',
					orp: '',
					corrosion: '',
					temper: '',
					remark: '',
				},
				// 申请调拨弹窗 ModalVisible
				id: '',             //该行数据的id
				allocation_time: null,
				ModalVisible: false,
				ModalForm: {
					client: '',             //客户单位
					address: '',            //客户地址
					allocation_remark: '',  // 设备调拨备注
					associate: '',   //客户单位接收人
					associate_tell: '', // 接收人电话
					transport: '',      //运输单位
					responsible_person: '',   //经办人
					responsible_tell: '', //经办人电话
					install_person: '',  //安装人
					install_tell: '',   //安装人电话
				},
				associateData: [],   //客户单位接收人库
				clientData: [],      // 客户单位库
			}
	}
	render(){
		const { host_Num, deviceNum, ModalForm, data, columns, ModalVisible,receiveForm,associateData, clientData } = this.state;
		return(
		<div>
			<div className="header">
				<div className="title">
					<h2>设备调拨</h2>
				</div>
				<div className="box">
					<span>主机编号:</span>
					<Input className="antd-Input" value={host_Num} onChange={(ev)=>{this.host_Num(ev)}}/>
					<span>设备编号:</span>
					<Input className="antd-Input" value={deviceNum} onChange={(ev)=>{this.deviceNum(ev)}}/>
					<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
					<Button className="antd-Button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
				</div>
				<div className="main">
					<Table className="antd-Table" columns={columns} dataSource={data} 
					pagination={{ pageSize: 10 }} scroll={{ y: '100%', x:'100%' }} />
					{/* 回到顶部 */}
					<BackTop />
					<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
				</div>
				<div className="transferBasic-apply">
					<Modal
						title="设备调拨单填写："
						visible={ModalVisible}
						onOk={this.handleModalOk}
						onCancel={this.handleModalCancel}
						width={520}
					>
						<span>申请时间:</span><p className='p_line'>{moment().format('YYYY-MM-DD')}</p>
						<span>主机编码:</span><p className='p_line'>{receiveForm.host_Num}</p><br/>
						<span>设备编号:</span><p className='p_line'>{receiveForm.deviceNum}</p><br/>
						<span>客户单位:</span>
						<select className="selectLength" value={ModalForm.client} onChange={(ev)=>{this.ModalChange(ev,'client')}}>
							<option key='0' value=''></option>
							{
								clientData.map((item)=>{
									return <option key={item.id} value={item.client_unit}>{item.client_unit}</option>
								})
							}
						</select>
						<span>调拨时间:</span><DatePicker value={this.state.allocation_time} style={{width: 472}} onChange={(ev)=>{this.allocation_time(ev,'allocation_time')}} placeholder='' onOk={this.onOk}  showTime format="YYYY-MM-DD"/>
						<span>客户单位接收人:</span>
						<select className="selectLength" value={ModalForm.associate} onChange={(ev)=>{this.ModalChange(ev,'associate')}}>
							<option key='0' value=''></option>
							{
								associateData.map((item)=>{
									return <option key={item.id} value={item.contacts}>{item.contacts}</option>
								})
							}
						</select>
						<span>运输单位:</span><Input value={ModalForm.transport} onChange={(ev)=>{this.ModalChange(ev,'transport')}}/><br/>
						{/* 
							<span>经办人:</span><Input value={ModalForm.responsible_person} onChange={(ev)=>{this.ModalChange(ev,'responsible_person')}}/>
							<span>经办人电话:</span>
							<Input value={ModalForm.responsible_tell} onChange={(ev)=>{this.ModalChange(ev,'responsible_tell')}}/><br/>
						 */}
						<span>安装人:</span><Input value={ModalForm.install_person} onChange={(ev)=>{this.ModalChange(ev,'install_person')}}/><br/>
						<span>安装人电话:</span><Input value={ModalForm.install_tell} onChange={(ev)=>{this.ModalChange(ev,'install_tell')}}/><br/>
						<span>备注:</span><Input value={ModalForm.allocation_remark} onChange={(ev)=>{this.ModalChange(ev,'allocation_remark')}}/>
					</Modal>
				</div>
			</div>
		</div>
			
		)
	}
	// 挂载初始全部闲置设备数据列 
	componentDidMount(){
		this.init();
	}
	// init函数
	init = ()=>{
		const me = this;
		let params = {status2:0};
		let url = originalUrl+'device/deviceInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('闲置设备:',res.data)
			let data = res.data;
			for(let i=0;i<data.length;i++){
				data[i]['key'] = data[i].id;
				let num = data[i].host_Num;
				if(res.data[i].status1 == 'a'){
					res.data[i].status1 = '正常';
				}else if(res.data[i].status1 == 'b'){
					res.data[i].status1 = '维护';
				}else if(res.data[i].status1 == 'c'){
					res.data[i].status1 = '停运';
				}else if(res.data[i].status1 == 'd'){
					res.data[i].status1 = '报废';
				}
				//根据post得到的主机编号host_Num，查主机名称host_Name：
				let hostUrl = originalUrl+'device/hostInformation/';
				model.fetch({host_Num:num},hostUrl,'get',function(res){
					//吧获取到的主机名称加到data表里
					data[i]['host_Name'] = res.data[0].host_Name;
					me.setState({data: data,})
				})
			}
		})
	}
	//头部 搜索框
	host_Num = (ev)=>{
		this.setState({
			host_Num: ev.target.value,
		})
	}
	deviceNum = (ev)=>{
		this.setState({
			deviceNum: ev.target.value,
		})
	}
	search = ()=>{
		console.log('search');
		const me = this;
		let params = {host_Num:me.state.host_Num,deviceNum:me.state.deviceNum};
		let url = originalUrl+'device/deviceInformation/';
		model.fetch(params,url,'get',function(res){
			let data = res.data;
			let filterData = [];
			for(let i=0;i<data.length;i++){
				data[i]['key'] = data[i].id;
				if(data[i].status2 == 0){
					data[i].status2 = '闲置';
					if(data[i].status1 == 'a'){
						data[i].status1 = '正常';
					}else if(data[i].status1 == 'b'){
						data[i].status1 = '维护';
					}else if(data[i].status1 == 'c'){
						data[i].status1 = '停运';
					}else if(data[i].status1 == 'd'){
						data[i].status1 = '报废';
					}
					filterData.push(data[i]);
				}
			}
			me.setState({
				data: filterData,
			})
		})
	}
	reset = ()=>{
		this.setState({
			host_Num: '',
			deviceNum: '',
		})
		this.init();
	}
	//申请调拨 弹窗函数ModalVisible id 为每行数据的一条标识id:0/1..属性 在data中赋值
	ModalVisible = (id)=>{
		const me = this;
		let params = {id:id};
		let url = originalUrl+'device/deviceInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('申请报废的该设备数据：',res.data[0])
			//切记不能做直接覆盖，会把我定义的receiveForm的参数丢失
			let data = res.data[0];
			let receiveForm = {...me.state.receiveForm};
			for(let item in data){
				for(let key in receiveForm){
					if(item == key){
						receiveForm[key] = data[item];
					}
				}
			}
			me.setState({
				id: id,
				receiveForm: receiveForm,
				ModalVisible:true,
			})
		})
		//获取所有的单位数据
		let clientUnit_params = {};
		let clientUnit_url = originalUrl+'client/clientInformation/';
		model.fetch(clientUnit_params,clientUnit_url,'get',function(res){
			console.log('所有单位数据：',res.data);
			me.setState({clientData: res.data});
		})
		//获取所有单位的联系人数据
		let associateUnit_params = {};
		let associateUnit_url = originalUrl+'client/contactsInformation/';
		model.fetch(associateUnit_params,associateUnit_url,'get',function(res){
			console.log('所有单位联系人数据：',res.data);
			me.setState({associateData: res.data});
		})
	}
	allocation_time = (value)=>{
		this.setState({allocation_time: value});
	}
	onOk = (value)=>{
		console.log('日期：',value);
	}
	ModalChange = (ev,key)=>{
		const me = this;
		let form = me.state.ModalForm;
		//将客户单位 查出 客户地址存入  联系人查出tell存入
		if(key == 'client'){
			let params = {client_unit:ev.target.value};
			let url = originalUrl+'client/clientInformation/';
			model.fetch(params,url,'get',function(res){
				console.log('客户地址:',res.data[0].client_address);
				form['address'] = res.data[0].client_address;
			})
		}else if(key == 'associate'){
			let params = {contacts: ev.target.value};
			let url = originalUrl+'client/contactsInformation/';
			model.fetch(params,url,'get',function(res){
				console.log('联系人电话:',res.data[0].tell);
				form['associate_tell'] = res.data[0].tell;
			})
		}
		for(let item in form){
			if(item === key){
				form[item] = ev.target.value;
				console.log('value:',ev.target.value);
				me.setState({
					ModalForm: form,
				})
			}
		}
	}
	//确定调拨了，这条数据要在列表中删除
	handleModalOk = ()=>{
		//cookie中取username
		let responsible_person;
		//cookie不存在重定向到登录界面
		if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
		  return <Redirect to="/login" />
		} else {
						responsible_person = JSON.parse(getCookie("mspa_user")).username;
		}
		let form = this.state.ModalForm;
		let id = this.state.id;
		let host_Num = this.state.receiveForm.host_Num;
		let deviceNum = this.state.receiveForm.deviceNum;
		let applyTime = moment().format('YYYY-MM-DD');
		let allocation_time = moment(this.state.allocation_time).format('YYYY-MM-DD');
		console.log('form:',form)
		form['applyTime'] = applyTime;
		form['deviceNum'] = deviceNum;
		form['allocation_time'] = allocation_time;
		form['responsible_person'] = responsible_person;
		console.log('postform:',form)
		//要传的参数Form  设备编号是必须参数
		const me = this;
		let params  = form;
		let url = originalUrl+'device/allocation/';
		model.fetch(params,url,'post',function(res){
			console.log('调拨成功');
			me.init();
		})
		//修改状态 将设备的闲置改为使用 status2: 0=>1
		let params1 = {status2:'1',host_Num:host_Num,deviceNum:deviceNum,};
		let url1 = originalUrl+'device/deviceInformation/'+id+'/';
		model.fetch(params1,url1,'put',function(res){
			console.log('状态修改成功');
			me.setState({
				ModalVisible: false,
			})
			me.init();
		})
	}
	handleModalCancel = ()=>{
		this.setState({
			ModalVisible: false,
		})
	}
}
export default TransferBasic;