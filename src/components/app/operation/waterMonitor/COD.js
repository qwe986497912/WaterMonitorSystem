import React, { Component } from 'react';
import axios from 'axios';
import { Model } from '../../../../dataModule/testBone.js';
import { originalUrl } from '../../../../dataModule/UrlList';
import ChartsModel from './ChartsModel.js';
import echarts from 'echarts';

class COD extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:{
				name: 'cod',
				min: 35.8,
				max: 38,
				deviceNum: this.props.deviceNum,
			},
		}
	}
	render(){
		return(
			<div>
				<ChartsModel data={this.state.data}/>
			</div>
		);
	}
}
export default COD;