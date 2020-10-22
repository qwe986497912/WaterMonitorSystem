/*
 * @Descripttion: 
 * @version: 
 * @Author: 唐帆
 * @Date: 2020-03-09 18:54:38
 * @LastEditors: 唐帆
 * @LastEditTime: 2020-04-30 10:07:41
 */
/*
	四个主路由，也就是渲染的界面
*/
import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../components/common/history';

import App from '../components/common/App';     //主页
import Login from '../components/common/Login'; //登录页
import Home from '../components/common/Home'; //首页
import NoMatch from '../components/common/404'; //报错页


class MRoute extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/app" component={App} />
          <Route path="/login" component={Login} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

export default MRoute;
