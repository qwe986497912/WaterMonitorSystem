import React, { Component } from 'react';
import { DatePicker, Input, Button, Table, Modal, BackTop } from 'antd';
import { originalUrl } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import '../../antd.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();
class EquipRecord extends Component{
	constructor() {
	    super();
			this.state = {
				//table data:数据 colums: 表头
				data: [],
				columns : [
					{ title: '创建时间', key:'create_time', dataIndex: 'create_time', width: '7%', },
					{ title: '更改时间', key:'update_time', dataIndex: 'update_time', width: '7%', },
					{ title: '配置人', key:'responsible_person', dataIndex: 'responsible_person', width: '7%', },
				  { title: '主机编号', key:'host_Num', dataIndex: 'host_Num', width: '7%', },
				  { title: '主机名称', key:'host_Name',dataIndex: 'host_Name', width: '7%', },
				  { title: '设备编号', key:'deviceNum', dataIndex: 'deviceNum', width: '7%', },
					{ title: 'PH传感器', key:'PH', dataIndex: 'PH', width: '7%', },
					{ title: '电导率传感器', key:'conductivity', dataIndex: 'conductivity', width: '7%', },
					{ title: '浊度传感器', key:'turbidity', dataIndex: 'turbidity', width: '7%', },
					{ title: 'ORP传感器', key:'orp', dataIndex: 'orp', width: '7%', },
					{ title: '腐蚀速率', key:'corrosion', dataIndex: 'corrosion', width: '7%', },
					{ title: '温度传感器', key:'temper', dataIndex: 'temper', width: '7%', },
					{ title: '备注', key:'remark', dataIndex: 'remark', },
				],
				//搜索 区域
				dateArea: [],
				host_Num: '',
				deviceNum: '',
			}
		this.dateArea = this.dateArea.bind(this);
	}
	render(){
		const { dateArea, host_Num, deviceNum,columns, data, } = this.state;
		return(
		<div>
			<div className="header">
				<h2>设备配置记录</h2>
				<span>更改日期筛选:</span>
				<RangePicker className='antd-RangePicker' value={dateArea} onChange={this.dateArea} placeholder='Start' onOk={this.onOk}  showTime format="YYYY-MM-DD"/>
				<span>主机编号</span>
				<Input className="antd-Input" value={this.state.host_Num} onChange={(ev)=>{this.host_Num(ev)}}/>
				<span>设备编号</span>
				<Input className="antd-Input" value={this.state.deviceNum} onChange={(ev)=>{this.deviceNum(ev)}}/><br/>
				<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
				<Button className="antd-Button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
			</div>
			<div className="main">
				<Table className="antd-Table" columns={columns} dataSource={data} 
				pagination={{ pageSize: 8 }} scroll={{ y: '100%',x:'100%', }}/>
			</div>
			{/* 回到顶部 */}
			<BackTop />
			<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
		</div>
		)
	}
	//初始化
	componentDidMount(){
		this.init();
	}
	//change
	change = (data)=>{
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i].id;
		}
			this.setState({data: data,})
	}
	// 初始化渲染table列表
	init = ()=>{
		const me = this;
		let params = {};
		let url = originalUrl+'device/deviceInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('设备配置记录-res.data:',res.data);
			let data = res.data;
				for(let i=0;i<res.data.length;i++){
					data[i]['key'] = res.data[i].id;
					let host_Num = data[i].host_Num;
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
					let params1 = {host_Num:host_Num};
					let url1 = originalUrl+'device/hostInformation/';
					model.fetch(params1,url1,'get',function(res){
						//吧获取到的主机名称加到data表里
						data[i]['host_Name'] = res.data[0].host_Name;
						me.setState({data: data,})
					})
				}
		})
	}
	dateArea = (value)=>{
		console.log(value);
		this.setState({
			dateArea: value,
		})
	}
	onOk = (value)=>{
		console.log('onOk:',value);
	}
	//两个输入框
	host_Num = (ev)=>{
		this.setState({host_Num: ev.target.value,});
	}
	deviceNum = (ev)=>{
		this.setState({deviceNum: ev.target.value,});
	}
	search = ()=>{
		const me = this;
		let host_Num = me.state.host_Num;
		let deviceNum = me.state.deviceNum;
		let dateArea = [...me.state.dateArea];
		let update_time1 = '';
		let update_time2 = '';
		if(dateArea.length){
			update_time1 = moment(dateArea[0]._d).format('YYYY-MM-DD');
			update_time2 = moment(dateArea[1]._d).format('YYYY-MM-DD');
			let params1 = {update_time1:update_time1,update_time2:update_time2,host_Num:host_Num,deviceNum:deviceNum};
			let url1 = originalUrl+'device/deviceInformation/';
			model.fetch(params1,url1,'get',function(res){
				console.log('搜索获得的数据-res.data:',res.data);
				let data = res.data;
					for(let i=0;i<res.data.length;i++){
						data[i]['key'] = res.data[i].id;
						let host_Num = data[i].host_Num;
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
						let params1 = {host_Num:host_Num};
						let url1 = originalUrl+'device/hostInformation/';
						model.fetch(params1,url1,'get',function(res){
							//吧获取到的主机名称加到data表里
							data[i]['host_Name'] = res.data[0].host_Name;
							me.setState({data: data,})
						})
					}
			})
		}else{
			let params2 = {host_Num:host_Num,deviceNum:deviceNum};
			let url2 = originalUrl+'device/deviceInformation/';
			model.fetch(params2,url2,'get',function(res){
				console.log('搜索获得的数据-res.data:',res.data);
				let data = res.data;
					for(let i=0;i<res.data.length;i++){
						data[i]['key'] = res.data[i].id;
						let host_Num = data[i].host_Num;
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
						let params1 = {host_Num:host_Num};
						let url1 = originalUrl+'device/hostInformation/';
						model.fetch(params1,url1,'get',function(res){
							//吧获取到的主机名称加到data表里
							data[i]['host_Name'] = res.data[0].host_Name;
							me.setState({data: data,})
						})
					}
			})
		}
	}
	reset = ()=>{
		this.setState({
			dateArea: [],
			host_Num: '',
			deviceNum: '',
		})
		this.init();
	}
}
export default EquipRecord;