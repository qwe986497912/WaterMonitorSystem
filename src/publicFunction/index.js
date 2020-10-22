import {getCookie} from "../helpers/cookies";
import createBrowserHistory from '../components/common/history'
import {message} from "antd";
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export function nowTime() {
  const date = new Date();
  const seperator1 = "-";
  const seperator2 = ":";
  const month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
  const strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
  const strHours = date.getHours()<10?'0' + date.getHours():date.getHours();
  const strMinutes = date.getMinutes()<10?'0' + date.getMinutes():date.getMinutes();
  return date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + strHours + seperator2 + strMinutes
}

export function nowTimeBigInt() {
  const date = new Date();
  const month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
  const strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
  const strHours = date.getHours()<10?'0' + date.getHours():date.getHours();
  const strMinutes = date.getMinutes()<10?'0' + date.getMinutes():date.getMinutes();
  // eslint-disable-next-line radix
  return parseInt(date.getFullYear() + month + strDate + strHours + strMinutes)
}

export function getUserName() {
  if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
    return createBrowserHistory.push('/login')
  } else {
    return JSON.parse(getCookie("mspa_user")).username
  }
}

export function getUserId() {
  if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
    return createBrowserHistory.push('/login')
  } else {
    return JSON.parse(getCookie("mspa_user"))._id
  }
}

export function handleChange(value, type, me){
  if (value === '' || value === undefined) value = null;
  const form = me.state;
  form[type] = value;
  me.setState(form)
}

export function ejectMessage (text, type) {
  if (type === 'success') {
    message.success(text)
  } else if (type === 'error') {
    message.error(text)
  } else if (type === 'warning') {
    message.warning(text)
  } else {
    message.info(text)
  }
}
//将时间戳转换为 2014-06-18 10:33:24
export function  timestampToTime(timestamp) {
		 var  date =  new  Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		 let Y = date.getFullYear() +  '-' ;
		 let M = (date.getMonth()+1 < 10 ?  '0' +(date.getMonth()+1) : date.getMonth()+1) +  '-' ;
		 let D = date.getDate() +  ' ' ;
		 let h = date.getHours() +  ':' ;
		 let m = date.getMinutes() +  ':' ;
		 let s = date.getSeconds();
		 return  Y+M+D+h+m+s;
	}
	//将时间转换为时间戳
export function timeToTimestamp(time){
	var  date =  new  Date( '2014-04-23 18:55:49:123' );
	 // 有三种方式获取
	 var  time1 = date.getTime();
	 var  time2 = date.valueOf();
	 var  time3 = Date.parse(date);
	 console.log(time1); //1398250549123
	 console.log(time2); //1398250549123
	 console.log(time3); //1398250549000
	 return date.getDate(time);
}
// utc 格式转换为 YYYY-MM-DD HH:hh:ss; 有缺陷 有时日期和时间中间仍然会有T
export function utcToTime(utc){
	return moment(new Date(utc)).format('YYYY-MM-DD HH:mm:ss')
}

