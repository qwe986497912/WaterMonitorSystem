import React, { Component } from 'react';
import { Button, Input, Select, DatePicker, BackTop } from 'antd';
import axios from 'axios';
import { Model } from '../../../../dataModule/testBone.js';
import { originalUrl } from '../../../../dataModule/UrlList';
import { timestampToTime, utcToTime } from '../../../../publicFunction/index.js';
import echarts from 'echarts';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const {Option} = Select;
const model = new Model();

export default class ChartsModel extends Component{
	constructor(props){
		super(props);
		this.state = {
			//筛选区域
			dateArea: [],
			step:'',  //步长
			data: this.props.data,       // 父组件传的参数 name route min max
			x_data: [],
			y_data: [],
			msg:[],
		}
	}
	render(){
		console.log('charmodel render')
		const { dateArea, step, } = this.state;
		return(
			<div>
				<div className="header">
					<div className="title">
						<h2>水质实时监控</h2>
					</div>
					<div className="box">
						<span>日期筛选:</span>
						<RangePicker className='antd-RangePicker' value={dateArea} onChange={(ev)=>{this.dateArea(ev)}}  onOk={this.onOk}  showTime format="YYYY-MM-DD HH:mm:ss"/>
						<span>步长:</span>
						<select className="select" value={step} onChange={(ev)=>{this.step(ev)}}>
							<option value="0"></option>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="40">40</option>
						</select>
						<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
						<Button className="antd-Button" type="primary" onClick={(ev)=>{this.reset(ev)}}>重置</Button>
						<Button className="antd-Button" type="primary" onClick={()=>{this.handleFlash()}} style={{}}>刷新</Button>
					</div>
				</div>
				<div className='echarts'>
					<div id={this.props.data.name} style={{width: '800px',height: '400px'}}></div>
					{/* 回到顶部 */}
					<BackTop />
					<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
				</div>
			</div>
		);
	}
	componentDidMount(){
		//可以设置settimeout才强制渲染
		console.log(moment(new Date("2020-10-08T00:55:58.538859Z")).format('YYYY-MM-DD HH:mm:ss'))
		this.init();
		this.time = setInterval(()=>this.init(),2000)
	};
	componentWillUnMount(){
		clearInterval(this.time);
		console.log(this.props.data.name,'卸载');
	}
	init = ()=>{
		const me = this;  //this 指向和model.fetch函数内this指向，应该this指向model
		let params = {deviceNum: this.props.data.deviceNum};
		let url = originalUrl+'sensor/value/';
		let name = this.props.data.name;
		console.log('name:',name)
		model.fetch(params,url,'get',function(res){
			let msg = res.data;
			let x_data = [];
			let y_data = [];
			for(let i=0;i<res.data.length;i++){
				x_data.push(utcToTime(res.data[i].time));
				y_data.push(res.data[i][name]);
			}
			console.log('time:',x_data)
			/* 
			 setState即刻渲染 每次init吧所有数据放在state 之后步长筛选的筛选数据源就直接从state拿就可以了
			 二不需要重新请求后台
			 */
			setTimeout(()=>{
				me.setState({
					msg,
					x_data,
					y_data,
				})
			},0)
			// console.log('x_data:',x_data)
			me.mount(x_data,y_data);
		})
	}
	//echarts函数 把数据挂载到图像上
	mount= (x_data,y_data)=>{
		//将ph cod 等学名 转换成中文名字
		// if(this != me){
		// 	this = me
		// }
		// let propsData = {...this.props.data}
		console.log('x_data:',x_data)
		let propsData = {...this.props.data}
		console.log('propsData:',propsData)
		if(propsData.name == 'ph'){
			propsData.name = 'PH';
		}else if(propsData.name == 'conduct'){
			propsData.name = '电导率';
		}else if(propsData.name == 'temper'){
			propsData.name = '温度';
		}else if(propsData.name == 'orp'){
			propsData.name = '荧光度';
		}else if(propsData.name == 'turbidity'){
			propsData.name = '浊度';
		}else if(propsData.name == 'cod'){
			propsData.name = 'COD';
		}
		// 基于准备好的dom，初始化echarts实例
		let myChart = echarts.init(document.getElementById(this.props.data.name));
		// 指定图表的配置项和数据
		let option = {
			title: {
				//折线图title
				text: propsData.name+'折线图',
				left: 180,
				top: 15,
				textAlign: 'center',
				fontFamily: '微软雅黑',
			},
			color: ['#f44'],//折线颜色
			tooltip : {
				trigger: 'axis',//坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
				axisPointer : {
				// 坐标轴指示器，坐标轴触发有效
					type : 'shadow'// 默认为直线，可选为：'line' | 'shadow'
				}
			},
			//x坐标轴属性设置
			xAxis : [
				{
					type : 'category', //类名轴
					data : x_data,//x坐标数据填充
					axisTick: {
						alignWithLabel: true
					}
				}
			],
			yAxis : [
				{//y坐标轴的属性设置
				type : 'value',
				//y坐标轴的最大最小值设置
				min: Number(this.props.data.min),//只能接收数字类型
				max: Number(this.props.data.max),
				}
			],
			//series y坐标轴数据渲染
			series : [
				{
				name:'ph值',
				type:'line',//折线 bar:柱状图
				lineWidth: '10%',//折线宽度
				data:y_data,
				}
			],
			dataZoom: [// 这个dataZoom组件，若未设置xAxisIndex或yAxisIndex，则默认控制x轴。
				{
				type: 'slider',//这个 dataZoom 组件是 slider 型 dataZoom 组件（只能拖动 dataZoom 组件导致窗口变化）
				xAxisIndex: 0, //控制x轴
				start: 0, 	// 左边在 0% 的位置
				end: 100	,// 右边在 20% 的位置
				},
			 //  {
				// type: 'inside',//这个 dataZoom 组件是 inside 型 dataZoom 组件（能在坐标系内进行拖动，以及用滚轮（或移动触屏上的两指滑动）进行缩放）
				// xAxisIndex: 0,//控制x轴
				// start: 0,
				// end: 20
			 //  },
				{
				type: 'slider',//slider 型 dataZoom 组件
				yAxisIndex: 0,//控制y轴
				start: 0,//开始和结束位置设置为0，100，100%比例展示
				end: 100
				},
			 //  {
				// type: 'inside',// inside 型 dataZoom 组件
				// yAxisIndex: 0,//控制y轴
				// start: 0,
				// end: 100
			 //  }
			],
		
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		 //根据窗口的大小变动图表 --- 重点
		//建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
		// window.addEventListener('resize',function() {myChart.resize()});
		window.addEventListener('resize', () => {
			if (myChart) {
				myChart.resize();
			}
		});
	}
	// 筛选数据
	dateArea = (value)=>{
		console.log('时间value：',value)
		this.setState({dateArea: value,})
	}
	onOk = (value)=>{
		let dateArea = [...this.state.dateArea];
		console.log('时间：',moment(dateArea[0]._d).format('YYYY-MM-DD HH:mm:ss'));
	}
	//步长 step
	step = (ev)=>{
		let value = ev.target.value;
		console.log('步长：',value);
		console.log("x_data:",x_data,"y_data:",y_data);
		let xData = [];
		let yData = [];
		let x_data = [...this.state.x_data];
		let y_data = [...this.state.y_data];
		for(let i=0;i<x_data.length;i++){
			if(i>0 && i%value == 0){
				xData.push(x_data[i]);
			}
		}
		for(let i=0;i<y_data.length;i++){
			if(i>0 && i%value == 0){
				yData.push(y_data[i]);
			}
		}
		this.setState({step:value});
		this.mount(xData,yData);
	}
	handleFlash = ()=>{
		this.init();
	}
	//search  因为写的问题，取得数据和挂载数据分离了，所以每次获取数据，都要刷新一次，重新挂载
	search = ()=>{
		clearInterval(this.time)//将定时器清除，以免冲突
		let dateArea = [...this.state.dateArea];
		let start_time = moment(dateArea[0]._d).format('YYYY-MM-DD HH:mm:ss');
		let end_time = moment(dateArea[1]._d).format('YYYY-MM-DD HH:mm:ss');
		const me = this;
		let params = {start_time: start_time,end_time: end_time,}
		let url = originalUrl+'sensor/value/';
		let name = this.props.data.name;
		model.fetch(params,url,'get',function(res){
			console.log('取得的筛选数据',res.data);
			console.log('res.data:',res.data)
			let msg = res.data;
			let x_data = [];
			let y_data = [];
			for(var i=0;i<res.data.length;i++){
				x_data.push(utcToTime(res.data[i].time));
				y_data.push(res.data[i][name]);
			}
			me.mount(x_data,y_data);
		})
	}
	//重置
	reset = ()=>{
		this.time = setInterval(()=>this.init(),100000);
		this.setState({
			dateArea: null,
			step: 0,
		})
		this.init();
	}
}
