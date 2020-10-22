import React, {Component} from "react";
import { Menu } from 'antd';
import { Link } from "react-router-dom";

import { getUserName } from '../../publicFunction';
import history from './history';

const { SubMenu } = Menu;

export default class HeaderMenu extends Component {
  state = {
    current: 'mail',
  };

  handleClick = e => {
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <Menu
        style={{width: '125%', marginLeft: '-12.5%', paddingLeft: '12.5%', position: 'fixed', zIndex: 999}}
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal">
        <SubMenu title="检验">
          <Menu.Item key="焊接检验">
            <Link to="/technology-system/check/welding">焊接检验</Link>
          </Menu.Item>
          <Menu.Item key="涂胶检验">
            <Link to="/technology-system/check/gluing">涂胶检验</Link>
          </Menu.Item>
          <Menu.Item key="样架测量检验">
            <Link to="/technology-system/check/sample-frame">样架测量检验</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu title="问题">
          <Menu.Item key="提问">
            <Link to="/technology-system/issue/put-issue">提问</Link>
          </Menu.Item>
          <Menu.Item key="我的问题">
            {/*我的问题*/}
            {/* 此处需要加上用户id，暂时没有加 */}
            <Link to={`/technology-system/issue/my-issues/${getUserName()}`}>我的问题</Link>
          </Menu.Item>
          <Menu.Item key="问题池">
            <Link to="/technology-system/issue/other-issues">问题池</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu title="工艺参数">
          <Menu.Item key="焊接">
            <Link to="/technology-system/params/welding">焊接</Link>
          </Menu.Item>
          <Menu.Item key="涂胶">
            <Link to="/technology-system/params/gluing">涂胶</Link>
          </Menu.Item>
        </SubMenu>
        {/* '/technology-system/finished-tasks' */}
        <SubMenu title="我的任务">
          <Menu.Item key="已完成任务">
            <Link to="/technology-system/finished-tasks">已完成任务</Link>
          </Menu.Item>
          <Menu.Item key="未完成任务">
            <Link to="/technology-system/unfinished-tasks">未完成任务</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu title="数据导入（临时）">
          <Menu.Item key="焊接数据">
            <Link to="/technology-system/import-data/welding">焊接数据</Link>
          </Menu.Item>
        </SubMenu>
				<SubMenu title="组织管理">
				  <Menu.Item key="部门管理">
				    <Link to="/technology-system/org/department">部门管理</Link>
				  </Menu.Item>
					<Menu.Item key="职位管理">
					  <Link to="/technology-system/org/position">职位管理</Link>
					</Menu.Item>
					<Menu.Item key="工段管理">
					  <Link to="/technology-system/org/workshop">工段管理</Link>
					</Menu.Item>
					<Menu.Item key="工位管理">
					  <Link to="/technology-system/org/station">工位管理</Link>
					</Menu.Item>
					<Menu.Item key="人员管理">
					  <Link to="/technology-system/org/staff">人员管理</Link>
					</Menu.Item>
				</SubMenu>
      </Menu>
    );
  }
}

