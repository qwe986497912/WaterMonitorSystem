import React, { Component } from 'react';
import { connect } from 'react-redux';


import { Model } from '../../dataModule/testBone'

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  componentDidMount() {
   
  }
  render(){
   return(
		<div>
			
		</div>
	 )
  }
}

const mapStateToProps = (state) => {
    return {
        // dataModule: state.get('dataModule').get('dataModule').toJS(),
    }
}

export default connect(mapStateToProps, null)(Index);
