import React, { Component } from 'react';
import { DatePicker, Input, Button, } from 'antd';
import { originalUrl } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import history from '../../../common/history.js';
import '../../antd.css';
// import { change } from '../commonFunction.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();

export default class DeviceDetailsTable extends Component{
	constructor(props){
		super(props);
		this.state = {
			data: {
				deviceNum: '',
				production_date: '',   //出厂日期
				allocation_time: '',   // 调拨日期
				PH: '',                //ph
				conductivity: '',      // 电导率传感器
				turbidity: '',         // 浊度传感器
				corrosion: '',         // 腐蚀速率
				orp: '',               //orp
				temper:'',             //温度传感器
				install_person: '',    //安装人
				install_tell: '',      // 安装人电话
				associate: '',         //联系人（设备调拨联系人）
				associate_tell: '',    // 联系人电话
				operation_time: '',    // 检修时间
			}
		}
	}
	render(){
		const { data } = this.state;
		return(
			<div style={{margin: '0 auto'}}>
				<table width="800" height="450" border="1" cellPadding="0" cellSpacing="0" className="deviceDetailsTable">
					<tbody>
						<tr>
							<td>设备编号:</td>
							<td>{this.props.deviceNum}</td>
							<td colSpan="2">设备配置:</td>
						</tr>
						<tr>
							<td>出厂日期:</td>
							<td>{data.production_date}</td>
							<td>PH传感器</td>
							<td>{data.PH}</td>
						</tr>
						<tr>
							<td>调拨日期:</td>
							<td>
								{data.allocation_time}
							</td>
							<td>电导率传感器</td>
							<td>
								{data.conductivity}
							</td>
						</tr>
						<tr>
							<td>安装人:</td>
							<td>
								{data.install_person}
							</td>
							<td>浊度传感器</td>
							<td>
								{data.turbidity}
							</td>
						</tr>
						<tr>
							<td>安装人电话:</td>
							<td>
								{data.install_tell}
							</td>
							<td>腐蚀速率</td>
							<td>
								{data.corrosion}
							</td>
						</tr>
						<tr>
							<td>联系人:</td>
							<td>
								{data.associate}
							</td>
							<td>ORP传感器</td>
							<td>
								{data.orp}
							</td>
						</tr>
						<tr>
							<td>联系人电话:</td>
							<td>
								{data.associate_tell}
							</td>
							<td>温度传感器</td>
							<td>
								{data.temper}
							</td>
						</tr>
						<tr>
							<td>上次检修时间:</td>
							<td colSpan="3">
								{data.operation_time}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		)
	}
	componentDidMount(){
		console.log(this.props)
		this.init();
	}
	init = ()=>{
		const me = this;
		let deviceNum = me.props.deviceNum;
		let params = {deviceNum:deviceNum};
		let url = originalUrl + 'sensor/info/';
		console.log('deviceNum:',deviceNum)
		console.log('params:',params)
		model.fetch(params,url,'get',function(res){
			console.log('res.data:',res.data);
			let data = {...me.state.data};
			for(let item in data){
				for(let index in res.data){
					if(item == index){
						data[item] = res.data[index];
					}
				}
			}
			me.setState({
				data:data,
			})
		})
	}
}
