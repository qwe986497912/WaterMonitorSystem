import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { getCookie, setCookie } from "../../helpers/cookies";
import store from '../../store';
import { Provider } from 'react-redux';

import HeaderMenu from './HeaderMenu'
import HeaderCustom from './HeaderCustom';
import SiderMenu from './SiderMenu.js';
import Index from '../index/index';
import noMatch from './404';

//运维
import Operation from '../app/operation/Operation';
import RemindRecord from '../app/operation/RemindRecord';
import WaterMonitor from '../app/operation/WaterMonitor';
import DeviceDetails from '../app/operation/DeviceDetails';
import Sensor from '../app/operation/Sensor';
import Maintenance from '../app/operation/Maintenance';
import DeviceStatus from '../app/operation/DeviceStatus';
// 设备信息管理
import MainFrame from '../app/equipManage/mainFrame';
import EquipBasic from '../app/equipManage/equipInformation/EquipBasic';
import EquipRecord from '../app/equipManage/equipInformation/EquipRecord';
import TransferBasic from '../app/equipManage/equipTransfer/TransferBasic';
import TransferRecord from '../app/equipManage/equipTransfer/TransferRecord';
import TransterForm from '../app/equipManage/equipTransfer/TransterForm';
import ScrapBasic from '../app/equipManage/equipScrap/ScrapBasic';
import ScrapForm from '../app/equipManage/equipScrap/ScrapForm';
// 信息账户管理
import Account from '../app/informationManage/Account.js';
// 客户关系管理
import CustomerList from '../app/customerManage/CustomerList';
import CustomerDetails from '../app/customerManage/CustomerDetails';

const { Content, Footer,Sider,Header } = Layout;
const { SubMenu } = Menu;

class App extends Component {
  state = {
    collapsed: getCookie("mspa_SiderCollapsed") === "true",
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    }, function () {
      setCookie("mspa_SiderCollapsed", this.state.collapsed);
    });
  };

  componentDidMount() {
    if (getCookie("mspa_SiderCollapsed") === null) {
      setCookie("mspa_SiderCollapsed", false);
    }
  }

  render() {
    const { collapsed } = this.state;
    // const {location} = this.props;
    let name;
    if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
      return <Redirect to="/login" />
    } else {
      name = JSON.parse(getCookie("mspa_user")).username;
    }

    return (
     <Layout style={{ minHeight: '100vh' }}>
         <Provider store={store}>
         <HeaderCustom collapsed={collapsed} toggle={this.toggle} username={name} />
         <Layout>
           <Sider width={200} style={{ background: '#fff' }}>
             	<SiderMenu/>
           </Sider>
           <Layout style={{ padding:0, marginTop: '3rem' }}>
             <Content
               style={{
                 background: '#fff',
                 padding: 24,
                 margin: 0
               }}
             >
               <Switch>
									{/* 运维部分 */}
								<Route exact path="/app/operation/Operation" component={Operation}></Route>
								<Route exact path="/app/operation/RemindRecord/:id" component={RemindRecord}></Route>
								<Route exact path="/app/operation/WaterMonitor/:id" component={WaterMonitor}></Route>
								<Route exact path="/app/operation/DeviceDetails/:id" component={DeviceDetails}></Route>
								<Route exact path="/app/operation/Sensor/:id" component={Sensor}></Route>
								<Route exact path="/app/operation/Maintenance/:id" component={Maintenance}></Route>
								<Route exact path="/app/operation/DeviceStatus/:id" component={DeviceStatus}></Route>
									{/* 设备信息部分 */}
								<Route exact path="/app/equipManage/MainFrame" component={MainFrame}></Route>
								<Route exact path="/app/equipManage/equipInformation/EquipBasic" component={EquipBasic}></Route>
								<Route exact path="/app/equipManage/equipInformation/EquipRecord" component={EquipRecord}></Route>
								<Route exact path="/app/equipManage/equipTransfer/TransferRecord" component={TransferRecord}></Route>
								<Route exact path="/app/equipManage/equipTransfer/TransterForm" component={TransterForm}></Route>
								<Route exact path="/app/equipManage/equipTransfer/TransferBasic" component={TransferBasic}></Route>
								<Route exact path="/app/equipManage/equipScrap/ScrapBasic" component={ScrapBasic}></Route>
								<Route exact path="/app/equipManage/equipScrap/ScrapForm" component={ScrapForm}></Route>
									{/* 信息账户部分 */}
								<Route exact path="/app/informationManage/Account" component={Account}></Route>
									{/* 客户关系管理部分 */}
								<Route exact path="/app/customerMange/CustomerList" component={CustomerList}></Route>
								<Route exact path="/app/customerMange/CustomerDetails/:id" component={CustomerDetails}></Route>
								<Route component={noMatch} />
							 </Switch>
             </Content>
						 <Footer style={{ textAlign: 'center', backgroundColor: "#778899", color: "white" }}>
						 	<span style={{ display: "block" }}>公司地址：上海市杨浦区军工路516号上海理工大学</span>
						 	<span style={{ display: "block" }}>联系电话：12345</span>
						 	<span style={{ display: "block" }}>邮箱：12345@qq.com</span>
						 </Footer>
           </Layout>
         </Layout>
				 </Provider>
       </Layout>
    )
  }
}

export default withRouter(App);
