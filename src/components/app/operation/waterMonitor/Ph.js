import React, { Component } from 'react';
import axios from 'axios';
import { Model } from '../../../../dataModule/testBone.js';
import { originalUrl } from '../../../../dataModule/UrlList';
import ChartsModel from './ChartsModel.js';

class PH extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:{
				name: 'ph',
				min: 7.9,
				max: 8,
				deviceNum: this.props.deviceNum,
			},
		}
	}
	componentDidMount(){
		console.log('ph挂载')
	}
	componentWillUnMount(){
		console.log('ph卸载')
	}
	render(){
		console.log(this.props)
		return(
			<div>
				<ChartsModel data={this.state.data}/>
			</div>
		);
	}
	// handleClick = ()=>{
	// 	this.setState({})
	// }
}
export default PH;