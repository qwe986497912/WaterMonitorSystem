import React, { Component } from 'react';
import axios from 'axios';
import { Model } from '../../../../dataModule/testBone.js';
import { originalUrl } from '../../../../dataModule/UrlList';
import ChartsModel from './ChartsModel.js';

class Temper extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:{
				name: 'temper',
				min: 24,
				max: 28,
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
export default Temper;