import React, { Component } from 'react';
import axios from 'axios';
import { Model } from '../../../../dataModule/testBone.js';
import { originalUrl } from '../../../../dataModule/UrlList';
import ChartsModel from './ChartsModel.js';

class Conduct extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:{
				name: 'conduct',
				min: 0,
				max: 2,
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
export default Conduct;