import { originalUrl } from '../../../../dataModule/UrlList';
import { Model } from '../../../../dataModule/testBone.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const model = new Model();

export function PH(data,deviceNum,min,max){	
	console.log('ph传感器',data,deviceNum,data[data.length-1].ph);
	console.log('min-max:',min,max)
	let ph = data[data.length-1].ph; //测量值
	let reminder = '';       // 提示内容
	let indicator = '';   // 指标
	let time = moment(data[data.length-1].time).format('YYYY-MM-DD HH:mm:ss'); // 时间，是否处理 默认未处理
	console.log('ph13132:',ph);
	if(ph<min){
		reminder = 'PH:'+ph+',低于警戒线';
	}else if(ph>max){
		console.log('>7.5')
		reminder = 'PH:'+ph+',高于警戒线';
	}
	if(reminder){
		indicator = 'PH值';
		//将提醒的数据发给水质提醒
		let params = {deviceNum:deviceNum,time:time,indicator:indicator,value:ph,reminder:reminder};
		let url = originalUrl+'operation/reminder/';
		model.fetch(params,url,'post',function(res){
			console.log('发送成功');
		})
	}
}

export function Temper(data,deviceNum,min,max){	
	console.log('温度传感器',data,deviceNum,data[data.length-1].temper);
	console.log('min-max:',min,max)
	// let temper = data[data.length-1].temper; //测量值
	let temper = data[1].temper; //测量值
	let reminder = '';       // 提示内容
	let indicator = '';   // 指标
	// let time = moment(data[data.length-1].time).format('YYYY-MM-DD HH:mm:ss'); // 时间，是否处理 默认未处理
	let time = moment(data[1].time).format('YYYY-MM-DD HH:mm:ss'); // 时间，是否处理 默认未处理
	console.log('temper13132:',temper);
	if(temper<min){
		reminder = '温度:'+temper+',低于警戒线';
	}else if(temper>max){
		console.log('>25')
		reminder = '温度:'+temper+',高于警戒线';
	}
	if(reminder){
		indicator = '温度';
		//将提醒的数据发给水质提醒
		let params = {deviceNum:deviceNum,time:time,indicator:indicator,value:temper,reminder:reminder};
		let url = originalUrl+'operation/reminder/';
		model.fetch(params,url,'post',function(res){
			console.log('发送成功');
		})
	}
}
export function ORP(data,deviceNum,min,max){	
	console.log('ORP传感器',data,deviceNum,data[data.length-1].orp);
	console.log('min-max:',min,max)
	let orp = data[1].orp; //测量值
	let reminder = '';       // 提示内容
	let indicator = '';   // 指标
	let time = moment(data[1].time).format('YYYY-MM-DD HH:mm:ss'); // 时间，是否处理 默认未处理
	if(orp<min){
		reminder = 'ORP:'+orp+',低于警戒线';
	}else if(orp>max){
		console.log('>36')
		reminder = 'ORP:'+orp+',高于警戒线';
	}
	if(reminder){
		indicator = 'ORP';
		//将提醒的数据发给水质提醒
		let params = {deviceNum:deviceNum,time:time,indicator:indicator,value:orp,reminder:reminder};
		let url = originalUrl+'operation/reminder/';
		model.fetch(params,url,'post',function(res){
			console.log('发送成功');
		})
	}
}