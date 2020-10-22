import React, { Component } from 'react';
import { Table, Modal, Input, Button, Select, DatePicker, BackTop } from 'antd';
import { Redirect, Route, Switch, withRouter, Link } from 'react-router-dom';
import { getCookie, setCookie } from "../../../../helpers/cookies";
import { originalUrl } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import '../../antd.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();
class EquipBasic extends Component{
	constructor() {
	    super();
			this.state = {
				mainFrameCode: '',
				deviceNum: '',
				//table data:数据 columns:表头 
				data: [],
				columns : [
				  { title: '主机编号', dataIndex: 'host_Num', width: '6%', },
				  { title: '主机名称', dataIndex: 'host_Name', width: '6%', },
				  { title: '设备编号', dataIndex: 'deviceNum', width: '6%', },
					{ title: '出厂日期', dataIndex: 'production_date', width: '12%', },
					{ title: 'PH传感器', dataIndex: 'PH', width: '6%', },
					{ title: '电导率传感器', dataIndex: 'conductivity', width: '6%', },
					{ title: '浊度传感器', dataIndex: 'turbidity', width: '6%', },
					{ title: 'ORP', dataIndex: 'orp', width: '6%', },
					{ title: '腐蚀速率', dataIndex: 'corrosion', width: '6%', },
					{ title: '温度传感器', dataIndex: 'temper', width: '6%', },
					{ title: '运行状态', dataIndex: 'status1', width: '6%', },
					{ title: '设备状态', dataIndex: 'status2', width: '6%', },
					{ title: '备注', dataIndex: 'remark', width: '6%', },
					{ title: '操作', key: 'operation', render: (record) => {
							return <Button type="primary" onClick={()=>{this.Modal1Visible(record.id)}}>编辑</Button>
						} 
					},
				],
				// 编辑 弹框 
				id: '',
				title: '',
				Modal1Visible: false,
				Modal2Visible: false,
				production_date: null,
				accountData:[],   //所有企业账户
				Modal1Form: {
					host_Num: '',
					host_Name: '',
					deviceNum: '',
					PH: '',
					conductivity: '',
					turbidity: '',
					orp: '',
					corrosion: '',
					temper: '',
					remark: '',
					responsible_person: '',
					status1: '',
				},
				//新增设备时，所有主机编码
				allMainFrame: [],
				//出厂日期
				production_date: null,
			}
			this.production_date = this.production_date.bind(this);
	}
	render(){
		//cookie中取username
		let name;
		//cookie不存在重定向到登录界面
		if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
		  return <Redirect to="/login" />
		} else {
						name = JSON.parse(getCookie("mspa_user")).username;
		}
		console.log('name:',name)
		const { mainFrameCode, deviceNum, columns, data, Modal1Form, Modal1Visible, Modal2Visible,production_date }  = this.state;
		return(
			<div>
				<div className="header">
					<h2>设备信息</h2>
					<span>主机编号:</span>
					<Input className="antd-Input" value={mainFrameCode} onChange={(ev)=>{this.mainFrameCode(ev)}}/>
					<span>设备编号:</span>
					<Input className="antd-Input" value={deviceNum} onChange={(ev)=>{this.deviceNum(ev)}}/>
					<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
					<Button className="antd-Button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
					<Button style={{margin:'0.625rem 1.25rem'}} type="primary" onClick={()=>{this.Modal2Visible()}}>增加设备</Button>
				</div>
				<div className="main">
					<Table className="antd-Table" columns={columns} dataSource={data} 
					pagination={{ pageSize: 8 }} scroll={{ y: '100%', x:'100%' }} />
				</div>
				<div className="mainFrame-modify">
					<Modal
						title="设备信息修改"
						visible={Modal1Visible}
						onOk={this.handleModal1Ok}
						onCancel={this.handleModal1Cancel}
					>
					<span>主机编码:</span>
					<select className="selectLength" value={Modal1Form.host_Num} onChange={(ev)=>{this.Modal2Change(ev,'host_Num')}}>
					{
						this.state.allMainFrame.map((item)=>{
							return <option key={item.id} value={item.host_Num}>{item.host_Num}</option>
						})
					}
					</select>
					<span>设备编号:</span><Input value={Modal1Form.deviceNum} onChange={(ev)=>{this.Modal1Change(ev,'deviceNum')}}/><br/>
					<span>出厂日期:</span>
					<DatePicker style={{width: 472}} value={production_date} onChange={this.production_date} placeholder='' onOk={this.onOk}  showTime format="YYYY-MM-DD"/><br/>
					<span>PH传感器:</span><Input value={Modal1Form.PH} onChange={(ev)=>{this.Modal1Change(ev,'PH')}}/><br/>	
					<span>电导率传感器:</span><Input value={Modal1Form.conductivity} onChange={(ev)=>{this.Modal1Change(ev,'conductivity')}}/><br/>
					<span>浊度传感器:</span><Input value={Modal1Form.turbidity} onChange={(ev)=>{this.Modal1Change(ev,'turbidity')}}/>
					<span>ORP传感器:</span><Input value={Modal1Form.orp} onChange={(ev)=>{this.Modal1Change(ev,'orp')}}/>
					<span>荧光度传感器:</span><Input value={Modal1Form.corrosion} onChange={(ev)=>{this.Modal1Change(ev,'corrosion')}}/>
					<span>温度:</span><Input value={Modal1Form.temper} onChange={(ev)=>{this.Modal1Change(ev,'temper')}}/>
					<span>设备状态:</span><br/>
					<select style={{width: 472,height:32,border: '1px solid #d9d9d9'}} onChange={(ev)=>{this.Modal2Change(ev,'status1')}} value={Modal1Form.status1}>
						<option value=''></option>
						<option value="a">正常</option>
						<option value="b">维护</option>
						<option value="c">停运</option>
					</select>
					{/* 
						<span>配置人:</span>
						<select className="selectLength" onChange={(ev)=>{this.Modal2Change(ev,'responsible_person')}} value={Modal1Form.responsible_person}>
							<option value=""></option>
							{
								this.state.accountData.map((item)=>{
									return <option key={item.id} value={item.name}>{item.name}</option>
								})
							}
						</select>
					 */}
					<span>备注:</span><Input value={Modal1Form.remark} onChange={(ev)=>{this.Modal1Change(ev,'remark')}}/>
					</Modal>
				</div>
				<div className="mainFrame-add">
					<Modal
						title="添加设备"
						visible={Modal2Visible}
						onOk={this.handleModal2Ok}
						onCancel={this.handleModal2Cancel}
					>
					<span>主机编码:</span>
					<select className="selectLength" value={Modal1Form.host_Num} onChange={(ev)=>{this.Modal2Change(ev,'host_Num')}}>
						<option key="0" value=""></option>
					{
						this.state.allMainFrame.map((item)=>{
							return <option key={item.id}>{item.host_Num}</option>
						})
					}
					</select>
					<span>设备编号:</span><Input value={Modal1Form.deviceNum} onChange={(ev)=>{this.Modal2Change(ev,'deviceNum')}}/><br/>
					<span>出厂日期:</span>
					<DatePicker style={{width: 472}} value={production_date} onChange={this.production_date}  onOk={this.onOk}  showTime format="YYYY-MM-DD"/><br/>
					<span>PH传感器:</span><Input value={Modal1Form.PH} onChange={(ev)=>{this.Modal2Change(ev,'PH')}}/><br/>	
					<span>电导率传感器:</span><Input value={Modal1Form.conductivity} onChange={(ev)=>{this.Modal2Change(ev,'conductivity')}}/><br/>
					<span>浊度传感器:</span><Input value={Modal1Form.turbidity} onChange={(ev)=>{this.Modal2Change(ev,'turbidity')}}/>
					<span>ORP传感器:</span><Input value={Modal1Form.orp} onChange={(ev)=>{this.Modal2Change(ev,'orp')}}/>
					<span>荧光度传感器:</span><Input value={Modal1Form.corrosion} onChange={(ev)=>{this.Modal2Change(ev,'corrosion')}}/>
					<span>温度传感器:</span><Input value={Modal1Form.temper} onChange={(ev)=>{this.Modal2Change(ev,'temper')}}/>
					{/* 
					<span>配置人:</span>
					<p className="p_line">{name}</p>
						<span>配置人:</span>
						<select className="selectLength" onChange={(ev)=>{this.Modal2Change(ev,'responsible_person')}} value={Modal1Form.responsible_person}>
							<option value=""></option>
							{
								this.state.accountData.map((item)=>{
									return <option key={item.id} value={item.name}>{item.name}</option>
								})
							}
						</select>
					 */}
					<span>备注:</span><Input value={Modal1Form.remark} onChange={(ev)=>{this.Modal2Change(ev,'remark')}}/>
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
		this.getAccountData();//挂在账户数据
	}
	// change将状态码=>值，给每行数据加必备的key 属性,并将数据赋值到state
	change = (data)=>{
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i].id;
			if(data[i].status1 == 'a'){
				data[i].status1 = '正常';
			}else if(data[i].status1 == 'b'){
				data[i].status1 = '维护';
			}else if(data[i].status1 == "c"){
				data[i].status1 = '停运';
			}else if(data[i].status1 == 'd'){
				data[i].status1 = '报废';
			}
		}
		console.log('data:',data);
		this.setState({
			data: data,
		});
	}
	//init
	init = ()=>{
		const me = this;
		let params = {};
		let url = originalUrl+'device/deviceInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('设备信息res.data:',res.data)
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
				if(res.data[i].status2 == true){
					res.data[i].status2 = '使用中';
				}else if(res.data[i].status2 == false){
					res.data[i].status2 = '闲置';
				}
				//根据post得到的主机编号host_Num，查主机名称host_Name：
				console.log('num:',num)
				let params1 = {host_Num: num};
				let url1 = originalUrl+'device/hostInformation/';
				model.fetch(params1,url1,'get',function(res){
					//吧获取到的主机名称加到data表里  当主机编号不存在的时候，不能出现报undefiend的错，用if判断解决。空的给个默认值
					console.log('res.dat:',res.data)
					data[i]['host_Name'] = res.data[0].host_Name;
					me.setState({data: data,})
				})
			}
		})
		let params2 = {};
		let url2 = originalUrl + 'device/hostInformation/';
		model.fetch(params2,url2,'get',function(res){
			console.log('主机信息：',res.data);
			me.setState({
				allMainFrame: res.data,
			})
		})
	}
	getAccountData = ()=>{
		const me = this;
		let params = {};
		let url = originalUrl + 'account/User/';
		let accountData = [];
		model.fetch(params,url,'get',function(res){
			console.log('data:',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				if(data[i]['account_type'] == '0'){
					accountData.push(data[i]);
				}
			}
			me.setState({
				accountData: accountData,
			})
		})
	}
	//筛选 输入框
	mainFrameCode = (ev)=>{
		this.setState({mainFrameCode: ev.target.value})
	}
	deviceNum = (ev)=>{
		this.setState({deviceNum: ev.target.value})
	}
	search = ()=>{
		console.log(this.state.mainFrameCode,this.state.deviceNum);
		const me = this;
		let params = {host_Num:me.state.mainFrameCode,deviceNum:me.state.deviceNum};
		let url = originalUrl+'device/deviceInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('搜索获得的数据-res.data:',res.data);
			me.change(res.data);
		})
	}
	reset = ()=>{
		this.setState({
			mainFrameCode: '',
			deviceNum: '',
		})
		this.init();
	}
	//Modal1Visible 弹出框 编辑 
	Modal1Visible = (id)=>{
		console.log('id:',id)
		const me = this;
		let form = {...me.state.Modal1Form};
		let params = {id: id};
		let url = originalUrl+'device/deviceInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('编辑数据行数据：',res.data)
			//切记不能做直接覆盖，会把我定义的Modal1Form的参数丢失
			let data = res.data[0];
			let production_date = moment(data['production_date'],'YYYY-MM-DD');
			let Modal1Form = {...me.state.Modal1Form};
			for(let item in data){
				for(let key in Modal1Form){
					if(item == key){
						Modal1Form[key] = data[item];
					}
				}
			}
			me.setState({
				id: id,
				production_date: production_date,
				Modal1Form: Modal1Form,
				Modal1Visible:true,
			})
		})
	}
	select1Status = (value)=>{
		console.log('value:',value)
		console.log('status1:',this.state.Modal1Form);
		let form = {...this.state.Modal1Form};
		form['status1'] = value;
		this.setState({Modal1Form: form});
	}
	// 出厂时间
	production_date = (value)=>{
		this.setState({production_date: value});
	}
	Modal1Change = (ev,key)=>{
		let form = {...this.state.Modal1Form};
		for(let item in form){
			if(item === key){
				form[item]=ev.target.value
				this.setState({Modal1Form: form})
			}
		}
	}
	handleModal1Ok = ()=>{
		//cookie中取username
		let responsible_person;
		//cookie不存在重定向到登录界面
		if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
		  return <Redirect to="/login" />
		} else {
						responsible_person = JSON.parse(getCookie("mspa_user")).username;
		}
		let id = this.state.id;
		//记录下修改时间,将修改时间和设备信息传入设备信息修改记录表中
		let update_time = moment().format('YYYY-MM-DD');
		let production_date = this.state.production_date;
		let date = moment(production_date._d).format('YYYY-MM-DD');
		let Modal1Form = {...this.state.Modal1Form};
		Modal1Form['responsible_person'] = responsible_person;
		console.log('Modal1Form:',Modal1Form)
		const me = this;
		let params = {...Modal1Form,'update_time':update_time,'production_date':date};
		let url = originalUrl+'device/deviceInformation/'+id+'/';
		model.fetch(params,url,'put',function(res){
			console.log('修改成功');
			let Form = {...me.state.Modal1Form};
			for(let item in Form){
				Form[item] = '';
			}
			me.setState({
				Modal1Visible: false,
				Modal1Form: Form,
				production_date:null,
			})
			me.init();
		})
	}
	handleModal1Cancel = ()=>{
		//数据清空
		let Form = {...this.state.Modal1Form};
		for(let item in Form){
			Form[item] = '';
		}
		this.setState({
			Modal1Visible: false,
			Modal1Form: Form,
			production_date: null,
		})
	}
	//新增主机信息弹窗
	Modal2Visible = ()=>{
		this.setState({Modal2Visible:true,});
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
	//出厂日期填写
	
	handleModal2Ok = ()=>{
		//cookie中取username
		let responsible_person;
		//cookie不存在重定向到登录界面
		if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
		  return <Redirect to="/login" />
		} else {
						responsible_person = JSON.parse(getCookie("mspa_user")).username;
		}
		let create_time = moment().format('YYYY-MM-DD');
		let production_date = moment(this.state.production_date._d).format('YYYY-MM-DD');
		
		let form = this.state.Modal1Form;
		form.status1 = 'a';
		const me = this;
		let params = {...form,create_time:create_time,production_date: production_date,responsible_person:responsible_person};
		let url = originalUrl+'device/deviceInformation/';
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
				production_date: null,
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
			production_date: null,
		})
	}
}
export default EquipBasic;