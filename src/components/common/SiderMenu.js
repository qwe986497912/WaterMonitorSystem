import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { getCookie, setCookie } from "../../helpers/cookies";
import store from '../../store';
import { Provider } from 'react-redux';
 const { SubMenu } = Menu;
 const { Content, Sider } = Layout;
 class SiderMenu extends Component{
	 render(){
		 //cookie中取username
		 let name;
		 let type;
		 if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
		   return <Redirect to="/login" />
		 } else {
				name = JSON.parse(getCookie("mspa_user")).username;
				type = JSON.parse(getCookie("mspa_user")).type;
		 }
		 console.log('type:',type)
		 if(type == 3){
			 return(
			 			<Menu
			 				mode="inline"
			 				defaultSelectedKeys={['1']}
			 				defaultOpenKeys={['sub1']}
			 				style={{ height: 'calc(100% - 3rem)', borderRight: 0 ,marginTop: '3rem'}}
			 			>
			 				<SubMenu
			 					key="sub1"
			 					title={
			 						<span>
			 							<Icon type="operation" />
			 							运维
			 						</span>
			 					}
			 				>
			 				  <Menu.Item key="1">
			 				  	<Link to="/app/operation/Operation/">&nbsp;&nbsp;&nbsp;&nbsp;运维首页</Link>
			 				  </Menu.Item>
			 				</SubMenu>
			 				<SubMenu
			 					key="sub2"
			 					title={
			 						<span>
			 							<Icon type="equipManage" />
			 							设备信息管理
			 						</span>
			 					}
			 				>
			 					<Menu.Item key="7">
			 						<Link to="/app/equipManage/mainFrame">&nbsp;&nbsp;&nbsp;&nbsp;主机信息</Link>
			 					</Menu.Item>
			 					<Menu.Item key="8">
			 						<Link to="/app/equipManage/equipInformation/EquipBasic">&nbsp;&nbsp;&nbsp;&nbsp;设备信息</Link>
			 					</Menu.Item>
			 					<Menu.Item key="10">
			 						<Link to="/app/equipManage/equipInformation/EquipRecord">&nbsp;&nbsp;&nbsp;&nbsp;设备配置记录</Link>
			 					</Menu.Item>
			 					<Menu.Item key="11">
			 						<Link to="/app/equipManage/equipTransfer/TransferBasic">&nbsp;&nbsp;&nbsp;&nbsp;设备调拨</Link>
			 					</Menu.Item>
			 					<Menu.Item key="12">
			 						<Link to="/app/equipManage/equipTransfer/TransferRecord">&nbsp;&nbsp;&nbsp;&nbsp;设备调拨记录</Link>
			 					</Menu.Item>
			 					<Menu.Item key="14">
			 						<Link to="/app/equipManage/equipScrap/ScrapBasic">&nbsp;&nbsp;&nbsp;&nbsp;设备报废</Link>
			 					</Menu.Item>
			 				</SubMenu>
			 				<SubMenu
			 					key="sub3"
			 					title={
			 						<span>
			 							<Icon type="informationManage" />
			 							信息账户管理
			 						</span>
			 					}
			 				>
			 					<Menu.Item key="16">
			 						<Link to="/app/informationManage/Account">&nbsp;&nbsp;&nbsp;&nbsp;账户管理</Link>
			 					</Menu.Item>
			 					{/* 
			 						<Menu.Item key="17">企业账户管理</Menu.Item>
			 						<Menu.Item key="18">客户账户管理</Menu.Item>
			 						<Menu.Item key="19">角色管理</Menu.Item>
			 						<Menu.Item key="20">权限管理</Menu.Item>
			 					 */}
			 				</SubMenu>
			 				<SubMenu
			 					key="sub4"
			 					title={
			 						<span>
			 							<Icon type="customerManage" />
			 							客户关系管理
			 						</span>
			 					}
			 				>
			 					<Menu.Item key="21">
			 						<Link to="/app/customerMange/CustomerList">&nbsp;&nbsp;&nbsp;&nbsp;客户信息</Link>
			 					</Menu.Item>
			 					{/* 
			 					 <Menu.Item key="22">客户信息编辑</Menu.Item>
			 					 <Menu.Item key="23">联系人信息</Menu.Item>
			 					 <Menu.Item key="24">联系人编辑</Menu.Item>
			 					 <Menu.Item key="25">新增联系人</Menu.Item>
			 					 <Menu.Item key="26">客户列表</Menu.Item>
			 					 */}
			 				</SubMenu>
			 			</Menu>
			 )
		 }else if(type == 2){
			 return(
			 			<Menu
			 				mode="inline"
			 				defaultSelectedKeys={['1']}
			 				defaultOpenKeys={['sub1']}
			 				style={{ height: 'calc(100% - 3rem)', borderRight: 0 ,marginTop: '3rem'}}
			 			>
			 				<SubMenu
			 					key="sub1"
			 					title={
			 						<span>
			 							<Icon type="operation" />
			 							运维
			 						</span>
			 					}
			 				>
			 				  <Menu.Item key="1">
			 				  	<Link to="/app/operation/Operation/">&nbsp;&nbsp;&nbsp;&nbsp;运维首页</Link>
			 				  </Menu.Item>
			 				</SubMenu>
			 				<SubMenu
			 					key="sub2"
			 					title={
			 						<span>
			 							<Icon type="equipManage" />
			 							设备信息管理
			 						</span>
			 					}
			 				>
			 					<Menu.Item key="7">
			 						<Link to="/app/equipManage/mainFrame">&nbsp;&nbsp;&nbsp;&nbsp;主机信息</Link>
			 					</Menu.Item>
			 					<Menu.Item key="8">
			 						<Link to="/app/equipManage/equipInformation/EquipBasic">&nbsp;&nbsp;&nbsp;&nbsp;设备信息</Link>
			 					</Menu.Item>
			 					<Menu.Item key="10">
			 						<Link to="/app/equipManage/equipInformation/EquipRecord">&nbsp;&nbsp;&nbsp;&nbsp;设备配置记录</Link>
			 					</Menu.Item>
			 					<Menu.Item key="11">
			 						<Link to="/app/equipManage/equipTransfer/TransferBasic">&nbsp;&nbsp;&nbsp;&nbsp;设备调拨</Link>
			 					</Menu.Item>
			 					<Menu.Item key="12">
			 						<Link to="/app/equipManage/equipTransfer/TransferRecord">&nbsp;&nbsp;&nbsp;&nbsp;设备调拨记录</Link>
			 					</Menu.Item>
			 					<Menu.Item key="14">
			 						<Link to="/app/equipManage/equipScrap/ScrapBasic">&nbsp;&nbsp;&nbsp;&nbsp;设备报废</Link>
			 					</Menu.Item>
			 				</SubMenu>
			 			</Menu>
			 )
		 }else{
			 return (
				<Menu
					mode="inline"
					defaultSelectedKeys={['1']}
					defaultOpenKeys={['sub1']}
					style={{ height: 'calc(100% - 3rem)', borderRight: 0 ,marginTop: '3rem'}}
				>
					<SubMenu
						key="sub1"
						title={
							<span>
								<Icon type="operation" />
								运维
							</span>
						}
					>
					  <Menu.Item key="1">
					  	<Link to="/app/operation/Operation/">&nbsp;&nbsp;&nbsp;&nbsp;运维首页</Link>
					  </Menu.Item>
					</SubMenu>
				</Menu>
			 )
		 }
		 return(
			<Menu
				mode="inline"
				defaultSelectedKeys={['1']}
				defaultOpenKeys={['sub1']}
				style={{ height: 'calc(100% - 3rem)', borderRight: 0 ,marginTop: '3rem'}}
			>
				<SubMenu
					key="sub1"
					title={
						<span>
							<Icon type="operation" />
							运维
						</span>
					}
				>
				  <Menu.Item key="1">
				  	<Link to="/app/operation/Operation/">&nbsp;&nbsp;&nbsp;&nbsp;运维首页</Link>
				  </Menu.Item>
				</SubMenu>
				<SubMenu
					key="sub2"
					title={
						<span>
							<Icon type="equipManage" />
							设备信息管理
						</span>
					}
				>
					<Menu.Item key="7">
						<Link to="/app/equipManage/mainFrame">&nbsp;&nbsp;&nbsp;&nbsp;主机信息</Link>
					</Menu.Item>
					<Menu.Item key="8">
						<Link to="/app/equipManage/equipInformation/EquipBasic">&nbsp;&nbsp;&nbsp;&nbsp;设备信息</Link>
					</Menu.Item>
					<Menu.Item key="10">
						<Link to="/app/equipManage/equipInformation/EquipRecord">&nbsp;&nbsp;&nbsp;&nbsp;设备配置记录</Link>
					</Menu.Item>
					<Menu.Item key="11">
						<Link to="/app/equipManage/equipTransfer/TransferBasic">&nbsp;&nbsp;&nbsp;&nbsp;设备调拨</Link>
					</Menu.Item>
					<Menu.Item key="12">
						<Link to="/app/equipManage/equipTransfer/TransferRecord">&nbsp;&nbsp;&nbsp;&nbsp;设备调拨记录</Link>
					</Menu.Item>
					<Menu.Item key="14">
						<Link to="/app/equipManage/equipScrap/ScrapBasic">&nbsp;&nbsp;&nbsp;&nbsp;设备报废</Link>
					</Menu.Item>
				</SubMenu>
				<SubMenu
					key="sub3"
					title={
						<span>
							<Icon type="informationManage" />
							信息账户管理
						</span>
					}
				>
					<Menu.Item key="16">
						<Link to="/app/informationManage/Account">&nbsp;&nbsp;&nbsp;&nbsp;账户管理</Link>
					</Menu.Item>
				</SubMenu>
				<SubMenu
					key="sub4"
					title={
						<span>
							<Icon type="customerManage" />
							客户关系管理
						</span>
					}
				>
					<Menu.Item key="21">
						<Link to="/app/customerMange/CustomerList">&nbsp;&nbsp;&nbsp;&nbsp;客户信息</Link>
					</Menu.Item>
				</SubMenu>
			</Menu>
		 )
	 }
 }
 export default SiderMenu;
 