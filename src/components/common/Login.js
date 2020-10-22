import React, { Component } from 'react';
import {setCookie} from "../../helpers/cookies";
import { originalUrl } from '../../dataModule/UrlList';
import { Model } from '../../dataModule/testBone.js';
import '../../style/login.less';
import { Form, Icon, Input, Button, Checkbox, message, Spin } from 'antd';
const FormItem = Form.Item;
const model = new Model();
// const users = [{
//     username:'admin',
//     password:'admin'
// }, {
//   username:'reviewer1',
//   password:'reviewer1'
// }, {
//   username:'reviewer2',
//   password:'reviewer2'
// }, {
//   username:'reviewer3',
//   password:'reviewer3'
// }, {
//   username:'rectifier1',
//   password:'rectifier1'
// }, {
//   username:'rectifier2',
//   password:'rectifier2'
// }, {
//   username:'root',
//   password:'root'
// }, {
//   username:'root',
//   password:'rock1204',
// 	type:'3',
	
// }];
// function PatchUser(values) {  //匹配用户
// 		    const {username, password} = values;
// 				const { users } = this.state;
// 		    return users.find(user => user.username === username && user.password === password);
// 		}


class NormalLoginForm extends Component {
    state = {
        isLoding:false,
				users: [
					
				],
    };
		componentDidMount(){
			console.log('挂载');
			this.init();
		}
		//取账户表中 取账号和密码和权限
		init = ()=>{
			const me = this;
			let params = {};
			let url = originalUrl + 'account/User/';
			let user = [];
			model.fetch(params,url,'get',function(res){
				console.log('账户信息：',res.data);
				let data = res.data;
				for(let i=0;i<data.length;i++){
					user.push(data[i]);
				}
				me.setState({
					users: user,
				})
			})
			
				// this.setState({
				// 	users: users,
				// })
		}
		PatchUser = (values)=>{  //匹配用户
			const {username, password,type} = values;
			const { users } = this.state;
			return users.find(user => user.username === username && user.password === password&& user.type === type);
		}
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of operation: ', values);
								//给cookie加权限值 type
								let data = this.state.users;
								for(let item in data){
									if(data[item]['username'] == values['username']){
										values['type'] = data[item]['type'];
									}
								}
								/////
                if(this.PatchUser(values)){
                    this.setState({
                        isLoding: true,
                    });
                    values['_id'] = values.username
                    console.log(values);
                    setCookie('mspa_user',JSON.stringify(values));
                    message.success('login successed!'); //成功信息
                    let that = this;
                    setTimeout(function() { //延迟进入
                        // that.props.history.push({pathname:'/',state:values});
												that.props.history.push({pathname:'app/operation/Operation/',state:values});
                    }, 2000);

                }else{
                    message.error('login failed!'); //失败信息
                }
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            this.state.isLoding?<Spin size="large" className="loading" />:
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <div className="login-name" style={{marginLeft:"30px"}}>水循环监控系统</div>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名 (admin)" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码 (admin)" />
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:'0'}}>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <a className="login-form-forgot" href="" style={{float:'right'}}>忘记密码?</a>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                    {/* <a className="githubUrl" href={`${authorize_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}`}> </a> */}
                </div>
            </div>
        );
    }
}

const Login = Form.create()(NormalLoginForm);
export default Login;
