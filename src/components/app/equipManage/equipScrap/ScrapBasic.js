import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select, BackTop } from 'antd';
import axios from 'axios';
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
					{ title: '主机编号', key:'host_Num', dataIndex: 'host_Num', width: '6%', },
					{ title: '设备编号', key:'deviceNum', dataIndex: 'deviceNum', width: '8%', },
					{ title: 'PH传感器', key:'PH', dataIndex: 'PH', width: '8%', },
					{ title: '电导率传感器', key:'conductivity', dataIndex: 'conductivity', width: '8%', },
					{ title: '浊度传感器', key:'turbidity', dataIndex: 'turbidity', width: '8%', },
					{ title: 'ORP传感器', key:'orp', dataIndex: 'orp', width: '8%', },
					{ title: '腐蚀速率', key:'corrosion', dataIndex: 'corrosion', width: '8%', },
					{ title: '温度', key:'temper', dataIndex: 'temper', width: '8%', },
					{ title: '设备状态', key:'status1', dataIndex: 'status1', width: '6%', },
					{ title: '备注', key:'remark', dataIndex: 'remark', width: '14%', },
					{ title: '操作', render: (record) => {
							return <Button type="primary" onClick={()=>{this.ModalVisible(record.id)}}>申请报废</Button>
						} 
					},
				],
				receiveForm: {
					host_Num: '',  //要留着上传
					deviceNum: '',  //要留着上传
					PH: '',
					conductivity: '',
					turbidity: '',
					orp: '',
					corrosion: '',
					temper: '',
					remark: '',
				},
				// 接收的申请人信息 申请人 申请人电话 申请人部门
				applyForm: {
					application_person: '',
					tell: '',   //申请人电话
					depart: '',   //申请人部门
				},
				// 申请报废弹窗 需要用户填写的设备报废清单
				id: '',             //该行数据的id
				time: null,         // 审批时间
				ModalVisible: false,
				ModalForm: {
					application_person: '',
					tell: '',   //申请人电话
					depart: '',   //申请人部门
					reason: '', //报废原因
					charge_view: '',      //主管意见
					charge_person: '',   //主管签字
					scrape_remark: '',  //设备备注
				},
			}
	}
	render(){
		const { host_Num, deviceNum, ModalForm, data, columns, ModalVisible,receiveForm } = this.state;
		return(
		<div>
			<div className="header">
				<div className="title">
					<h2>设备报废</h2>
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
						
					<span>申请人:</span><Input value={ModalForm.application_person} onChange={(ev)=>{this.ModalChange(ev,'application_person')}}/><br/>
					<span>申请人电话:</span><Input value={ModalForm.tell} onChange={(ev)=>{this.ModalChange(ev,'tell')}}/>
					<span>申请人部门:</span><Input value={ModalForm.depart} onChange={(ev)=>{this.ModalChange(ev,'depart')}}/><br/>
					
					<span>报废原因:</span><Input value={ModalForm.reason} onChange={(ev)=>{this.ModalChange(ev,'reason')}}/>
					<span>主管意见:</span><Input value={ModalForm.charge_view} onChange={(ev)=>{this.ModalChange(ev,'charge_view')}}/><br/>
					<span>主管签字:</span><Input value={ModalForm.charge_person} onChange={(ev)=>{this.ModalChange(ev,'charge_person')}}/><br/>
					<span>审批时间:</span><DatePicker style={{width:472}} value={this.state.time} onChange={(ev)=>{this.time(ev,'time')}} placeholder='' onOk={this.onOk}  showTime format="YYYY-MM-DD"/>
					<span>备注:</span><Input value={ModalForm.scrape_remark} onChange={(ev)=>{this.ModalChange(ev,'scrape_remark')}}/>
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
		let params = {status: '!d'};
		let url = originalUrl+'device/deviceInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('设备可以报废(状态是非报废)信息-res.dsata',res.data)
			let data = res.data;
			//筛选出status1 不是'd'(报废);
			for(let i=0;i<data.length;i++){
				let num = data[i].host_Num;
				data[i]['key'] = data[i].id;
				if(data[i].status1 == 'a'){
					data[i].status1 = '正常';
				}else if(data[i].status1 == 'b'){
					data[i].status1 = '维护';
				}else if(data[i].status1 == 'c'){
					data[i].status1 = '停运';
				}
			}
			me.setState({data: data});
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
		let params = {status: '!d',host_Num: me.state.host_Num,deviceNum:me.state.deviceNum};
		let url = originalUrl+'device/deviceInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('可以报废设备信息（非d):',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				data[i]['key'] = data[i]['id'];
			}
			me.setState({data: data})
		})
	}
	reset = ()=>{
		this.setState({
			host_Num: '',
			deviceNum: '',
		})
		this.init();
	}
	//申请报废 弹窗函数ModalVisible id 为每行数据的身份识别id:0/1..属性 在data中赋值
	ModalVisible = (id)=>{
		console.log('ModalForm:',this.state.ModalForm)
		console.log('id:',id);	
		const me = this;
		let params = {id:id};
		let url = originalUrl+'device/deviceInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('申请调拨的该设备数据：',res.data[0])
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
				// applyForm: applyForm,
				ModalVisible:true,
			})
		})
	}
	time = (value)=>{
		this.setState({time: value});
	}
	onOk = (value)=>{
		console.log('日期：',value);
	}
	ModalChange = (ev,key)=>{
		let form = this.state.ModalForm;
		for(let item in form){
			if(item === key){
				form[item] = ev.target.value;
				this.setState({
					ModalForm: form,
				})
			}
		}
	}
	//确定调拨了，这条数据要在列表中删除
	handleModalOk = ()=>{
		console.log('ModalForm:',this.state.ModalForm);
		let form = this.state.ModalForm;
		let id = this.state.id;
		let host_Num = this.state.receiveForm.host_Num;
		let deviceNum = this.state.receiveForm.deviceNum;
		let time = moment().format('YYYY-MM-DD');
		console.log('form:',form)
		form['time'] = time;
		form['deviceNum'] = deviceNum;
		console.log('postform:',form)
		//要传的参数Form  设备编号是必须参数
		const me = this;
		let params = form;
		let url = originalUrl+'device/allocation/';
		model.fetch(params,url,'post',function(res){
			console.log('post成功');
		})
		//修改状态 将设备的闲置改为使用 status1: 0=>1
		let params1 = {status1:'d',host_Num:host_Num,deviceNum:deviceNum,};
		let url1 = originalUrl+'device/deviceInformation/'+id+'/';
		model.fetch(params1,url1,'put',function(res){
			console.log('报废成功');
			let Form = me.state.ModalForm;
			for(let item in Form){
				Form[item] = '';
			}
			me.setState({
				ModalForm: Form,
				ModalVisible: false,
			})
			me.init();
		})
	}
	handleModalCancel = ()=>{
		let Form = this.state.ModalForm;
		for(let item in Form){
			Form[item] = '';
		}
		this.setState({
			ModalForm: Form,
			ModalVisible: false,
		})
	}
}
export default TransferBasic;