import React, { Component } from 'react';
import axios from 'axios';
import { Model } from '../../../../dataModule/testBone.js';
import { originalUrl } from '../../../../dataModule/UrlList';
import ChartsModel from './ChartsModel.js';

class Turbidity extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:{
				name: 'turbidity',
				min: 7.9,
				max: 8,
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
export default Turbidity;