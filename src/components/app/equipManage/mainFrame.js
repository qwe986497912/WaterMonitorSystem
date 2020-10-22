import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, Select,BackTop } from 'antd';
import axios from 'axios';
import { originalUrl } from '../../../dataModule/UrlList';
import { Model } from '../../../dataModule/testBone.js';
import '../antd.css';
// import { change } from '../commonFunction.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();


class MainFrame extends Component{
	constructor(props) {
	    super(props);
			console.log('this.props:',this.props)
			this.state = {
				data: [],
				columns : [
				  { title: '主机编码',key:'host_Num', dataIndex: 'host_Num', width: '15%', },
				  { title: '主机名称',key:'host_Name', dataIndex: 'host_Name', width: '15%', },
				  { title: '开始生产日期',key:'start_time', dataIndex: 'start_time', width: '15%', },
					{ title: '结束生产日期', key:'end_time', dataIndex: 'end_time', width: '15%', },
					{ title: '状态', key:'status', dataIndex: 'status', width: '15%', },
					{ title: '备注', key:'remark', dataIndex: 'remark', width: '15%', },
					{ title: '操作', key: 'operation', render: (record) => {
							return <Button type="primary" onClick={()=>{this.Modal1Visible(record.id)}}>编辑</Button>
						} 
					},
				],
				//搜索
				startDateArea: [],
				endDateArea: [],
				modifyTime: '',
				host_Num: '',
				//弹框函数
				title: '',
				Modal1Visible: false,
				dateArea: [],
				id: '',             //编辑行数据的id
				Modal1Form: {
					host_Num: '',
					start_time: '',
					end_time: '',
					status: '',
					host_Name: '',
					remark: '',
				},
				Modal2Visible: false,
				
			}
			this.start_timeArea = this.start_timeArea.bind(this);
			this.end_timeArea = this.end_timeArea.bind(this);
			this.onOk = this.onOk.bind(this);
	}
	render(){
		const { startDateArea ,endDateArea, dateArea, Modal1Form,} = this.state
		return(
		<div style={{height:'100%'}}>
			<div className="header">
				<h2>设备信息管理--主机信息</h2>
				<span>开始生产日期区间:</span>
				<RangePicker className='antd-RangePicker' value={startDateArea} onChange={this.start_timeArea} placeholder='Start' onOk={this.onOk}  showTime format="YYYY-MM-DD"/>
				<span>结束生产日期区间:</span>
				<RangePicker className='antd-RangePicker' value={endDateArea} onChange={this.end_timeArea} placeholder='End' onOk={this.onOk}  showTime format="YYYY-MM-DD"/>
				<span>主机编号</span>
				<Input  className="antd-Input" value={this.state.host_Num} onChange={(ev)=>{this.host_Num(ev)}}/><br/>
				<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
				<Button className="antd-Button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
				<Button style={{margin: '0.625rem 1.25rem'}} type="primary" onClick={()=>{this.Modal2Visible()}}>新增主机</Button>
			</div>
			<div className="main">
				<Table className="antd-Table" columns={this.state.columns} dataSource={this.state.data} 
				pagination={{ pageSize: 8 }} scroll={{ y: '100%',x: '100%' }}/>
				{/* 回到顶部 */}
				<BackTop />
				<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
			</div>
			<div className="mainFrame-modify">
				<Modal
					title="主机信息修改"
					visible={this.state.Modal1Visible}
					onOk={this.handleModal1Ok}
					onCancel={this.handleModal1Cancel}
				>
				<span>主机编码:</span><Input value={Modal1Form.host_Num} onChange={(ev)=>{this.Modal1Change(ev,'host_Num')}}/><br/>
				<span>主机名称:</span><Input value={Modal1Form.host_Name} onChange={(ev)=>{this.Modal1Change(ev,'host_Name')}}/><br/>
				<span>生产日期区间:</span><br/>
				<RangePicker style={{width: 472}} value={dateArea} onChange={this.dateArea} placeholder='' onOk={this.onOk}  showTime format="YYYY-MM-DD"/><br/>
				<span>主机状态:</span>
				<select className="selectLength" onChange={(ev)=>{this.Modal1Change(ev,'status')}} value = {Modal1Form.status}>
					<option value=""></option>
					<option value="1">在产</option>
					<option value="0">停产</option>
				</select>
				<span>备注:</span><Input value={Modal1Form.remark} onChange={(ev)=>{this.Modal1Change(ev,'remark')}}/>
				</Modal>
			</div>
			<div className="mainFrame-add">
				<Modal
					title="增加主机信息"
					visible={this.state.Modal2Visible}
					onOk={this.handleModal2Ok}
					onCancel={this.handleModal2Cancel}
				>
				<span>主机编码:</span><Input value={Modal1Form.host_Num} onChange={(ev)=>{this.Modal2Change(ev,'host_Num')}}/><br/>
				<span>主机名称:</span><Input value={Modal1Form.host_Name} onChange={(ev)=>{this.Modal2Change(ev,'host_Name')}}/><br/>
				<span>生产日期区间:</span><br/>
				<RangePicker style={{width: 472}} value={this.state.dateArea} onChange={this.dateArea} placeholder='Start' onOk={this.onOk}  showTime format="YYYY-MM-DD"/><br/>
				<span>主机状态:</span>
				<select className="selectLength" onChange={(ev)=>{this.Modal2Change(ev,'status')}} value={Modal1Form.status}>
					<option value=""></option>
					<option value="1">在产</option>
					<option value="0">停产</option>
				</select>
				<span>备注:</span><Input value={Modal1Form.remark} onChange={(ev)=>{this.Modal2Change(ev,'remark')}}/>
				</Modal>
			</div>
		</div>
		)
	}
	componentDidMount(){
		this.init()
	}
	// 函数区
		// change将状态码=>值，给每行数据加必备的key 属性,并将数据赋值到state
	change = (data)=>{
			for(let i=0;i<data.length;i++){
				data[i]['key'] = data[i].id;
				if(data[i].status){
					console.log('fd')
					data[i].status = '在产';
				}else{
					console.log('dfd')
					data[i].status = '停产';
				}
			}
			this.setState({
				data: data,
			});
		}
	init = ()=>{
		const me = this;
		let params = {};
		let url = originalUrl+'device/hostInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('init——res.data:',res.data);
			//将状态码=>值，给每行数据加必备的key 属性
			me.change(res.data);
		})
	}
		//筛选区域
		start_timeArea = (value)=>{
			console.log('value:',value)
			this.setState({
				startDateArea: value,
			})
		}
		end_timeArea = (value)=>{
			this.setState({
				endDateArea: value,
			})
		}
		onOk = (value)=>{
			console.log('ok:',moment(value.date).format('YYYY-MM-DD'))
			let modifyTime = moment(value.date).format('YYYY-MM-DD')
			this.setState({modifyTime: modifyTime});
		}
		host_Num = (ev)=>{
			console.log('mainCode:',ev.target.value)
			this.setState({
				host_Num: ev.target.value,
			})
		}
		search = ()=>{
			const me = this;
			let host_Num = me.state.host_Num
			let startDate = [...me.state.startDateArea];
			let endDate = [...me.state.endDateArea];
			let start_time1 = '';
			let start_time2 = '';
			let end_time1 = '';
			let end_time2 = '';
			console.log('host_Num:',host_Num)
			if(startDate.length && !endDate.length){
				console.log('1存在')
				start_time1 = moment(startDate[0]._d).format('YYYY-MM-DD')
				start_time2 = moment(startDate[1]._d).format('YYYY-MM-DD')
				let params1 = {start_time1: start_time1,start_time2: start_time2,host_Num:host_Num};
				let url1 = originalUrl+'device/hostInformation/';
				model.fetch(params1,url1,'get',function(res){
					console.log('res.data:',res.data)
					//将状态码=>值，给每行数据加必备的key 属性
					me.change(res.data);
				})
			}else if(!startDate.length && endDate.length){
				end_time1 = moment(endDate[0]._d).format('YYYY-MM-DD');
				end_time2 = moment(endDate[1]._d).format('YYYY-MM-DD');
				let params2 = {end_time1: end_time1,end_time2: end_time2,host_Num:host_Num};
				let url2 = originalUrl+'device/hostInformation/';
				model.fetch(params2,url2,'get',function(res){
					console.log('res.data:',res.data)
					//将状态码=>值，给每行数据加必备的key 属性
					me.change(res.data);
				})
			}else if(startDate.length && endDate.length){
				start_time1 = moment(startDate[0]._d).format('YYYY-MM-DD')
				start_time2 = moment(startDate[1]._d).format('YYYY-MM-DD')
				end_time1 = moment(endDate[0]._d).format('YYYY-MM-DD')
				end_time2 = moment(endDate[1]._d).format('YYYY-MM-DD')
				let params3 = {
					start_time1:start_time1,
					start_time2:start_time2,
					end_time1:end_time1,
					end_time2:end_time2,
					host_Num:host_Num,
				}
				let url3 = originalUrl+'device/hostInformation/';
				model.fetch(params3,url3,'get',function(res){
					console.log('res.data:',res.data)
					//将状态码=>值，给每行数据加必备的key 属性
					me.change(res.data);
				})
			}else{
				let params4 = {host_Num:host_Num};
				let url4 =  originalUrl+'device/hostInformation/';
				model.fetch(params4,url4,'get',function(res){
					console.log('res.data:',res.data)
					//将状态码=>值，给每行数据加必备的key 属性
					me.change(res.data);
				})
			}
		}
		reset = ()=>{
			this.setState({
				startDateArea: [],
				endDateArea: [],
				host_Num: '',
			})
			this.init();
		}
	
		//弹框函数区域 编辑
		Modal1Visible = (id)=>{
			console.log("编辑id:",id)
			//发送get请求，获取数据
			const me = this;
			let params = {id:id};
			let url = originalUrl+'device/hostInformation/';
			model.fetch(params,url,'get',function(res){
				console.log('putdata:',res.data[0]);
				//切记不能做直接覆盖，会把我定义的Modal1Form的参数丢失
				let data = res.data[0];
				let Modal1Form = {...me.state.Modal1Form};
				let dateArea = [];
				dateArea.push(moment(data['start_time'],'YYYY-MM-DD'),moment(data['end_time'],'YYYY-MM-DD'));
				for(let item in data){
					for(let key in Modal1Form){
						if(item == key){
							Modal1Form[key] = data[item];
						}
					}
				}
				console.log('dfdf')
				//将状态码转变
				for(let item in Modal1Form){
					if(item == 'status'){
						if(Modal1Form[item]){
							Modal1Form[item] = '1';
						}else{
							Modal1Form[item] = '0';
						}
					}
				}
				console.log('Modal1Form；',Modal1Form);
				me.setState({
					id:id,
					Modal1Form: Modal1Form,
					dateArea: dateArea,
					Modal1Visible: true,
				})
			})
		}
		Modal1Change = (ev,key)=>{
			let form = {...this.state.Modal1Form};
			for(let item in form){
				if(item === key){
					form[item] = ev.target.value;
					this.setState({Modal1Form: form});
				}
			}
		}
		handleModal1Ok = e => {
			let id = this.state.id;
			let form = {...this.state.Modal1Form};
			form['statr_time'] = moment(this.state.dateArea[0]._d).format('YYYY-MM-DD');
			form['end_time'] = moment(this.state.dateArea[1]._d).format('YYYY-MM-DD');
			const me = this;
			let params = form;
			let url = originalUrl+'device/hostInformation/'+id+'/';
			model.fetch(params,url,'put',function(res){
				console.log('编辑主机信息发送：',res.data);
				let Form = {...this.state.Modal1Form};
				for(let item in Form){
					Form[item] = ''; 
				}
				me.setState({
					Modal1Form: Form,
					dateArea: [],
					Modal1Visible: false,
				});
				me.init();
			})
		};
		handleModal1Cancel = e => {
		    this.setState({
		      Modal1Visible: false,
		    });
		  };
			//新增主机信息弹窗
		Modal2Visible = ()=>{
			console.log('新增主机弹框')
			this.setState({
				Modal2Visible:true,
			})
		}
		Modal2Change = (ev,key)=>{
			let form = {...this.state.Modal1Form};
			for(let item in form){
				if(item === key){
					form[item] = ev.target.value;
					this.setState({Modal1Form: form});
				}
			}
		}
		//主机日期区间绑定
		dateArea = (value)=>{
			console.log('value:',value);
			this.setState({dateArea:value})
		}
		onOk = (value)=>{
			console.log('onOk:',this.state.dateArea);
		}
		handleModal2Ok = e => {
			let form = {...this.state.Modal1Form};
			form['start_time'] = moment(this.state.dateArea[0]._d).format('YYYY-MM-DD');
			form['end_time'] = moment(this.state.dateArea[1]._d).format('YYYY-MM-DD');
			const me = this;
			let params = form;
			let url = originalUrl+'device/hostInformation/';
			model.fetch(params,url,'post',function(res){
				console.log('主机增加-res.data:',res.data);
				//数据清空,方便下次填写 新增主机表
				let Form = {...me.state.Modal1Form};
				for(let item in Form){
					Form[item] = '';
				}
				me.setState({
					Modal2Visible: false,
					Modal1Form: Form,
					dateArea: [],
				});
				//再次请求，渲染列表 table 
				me.init();
			})
		};
		handleModal2Cancel = e => {
		    console.log(e);
		    this.setState({
		      Modal2Visible: false,
		    });
		  };
}
export default MainFrame;