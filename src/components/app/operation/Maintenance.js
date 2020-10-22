import React, { Component } from 'react';
import { DatePicker, BackTop ,Input, Button, Table, Modal, Select, InputNumber, Popconfirm, Form } from 'antd';
import { originalUrl } from '../../../dataModule/UrlList';
import { Model } from '../../../dataModule/testBone.js';
import history from '../../common/history.js';
// import EditableFormTableMainten from './maintenance/EditableTable.js';
import { timestampToTime, utcToTime } from '../../../publicFunction/index.js';
import '../antd.css';
// import { change } from '../commonFunction.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const model = new Model();
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class Maintenance extends Component{
	constructor(props) {
	    super(props);
			console.log('this.props:',this.props.match.params.id) //设备编号
			this.state = {
				//搜索 报修时间区间
				fixDate: [],
				reason: '',
				//table 区域 data columns
				editingKey: '' ,
				data: [],
				//编辑
				Data:{
					deviceNum: '',   //设备编号
					client_unit: '', //用户单位
					id: '',          //设备信息表中设备id
				},
				deviceNum: '',
				//弹框函数 新增
				ModalVisible: false,
				accountData:[],   //负责人 账户中 职位为经理的账户
				ModalForm: {
					reason: '',
					remark: '',
					result: '',
					status: '',
					repair_time: null,
					operation_time: null,
					responsible_person:'',
				},
			}
			this.columns = [
				{
					title: '报修时间',
					dataIndex: 'repair_time',
					width: '200',
					editable: false,
				},
				{
					title: '维护时间',
					dataIndex: 'operation_time',
					width: '200',
					editable: false,
				},
				{
					title: '维护原因',
					dataIndex: 'reason',
					width: '100',
					editable: false,
				},
				{
					title: '设备状况描述',
					dataIndex: 'remark',
					width: '120',
					editable: false,
				},
				{
					title: '维护结果',
					dataIndex: 'result',
					width: '100',
					editable: true,
				},
				{
					title: '维护状态',
					dataIndex: 'status',
					width: '100',
					editable: true,
				},
				{
					title: '负责人',
					dataIndex: 'responsible_person',
					width: '100',
					editable: true,
				},
				{
					title: '编辑',
					dataIndex: 'edit',
					render: (text, record) => {
						const { editingKey } = this.state;
						const editable = this.isEditing(record);
						return editable ? (
							<span>
								<EditableContext.Consumer>
									{form => (
										<a
											onClick={() => this.save(form, record.id)}
											style={{ marginRight: 8 }}
										>
											保存
										</a>
									)}
								</EditableContext.Consumer>
								<Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
									<a>取消</a>
								</Popconfirm>
							</span>
						) : (
							<a disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
								编辑
							</a>
						);
					},
				},
			];
			
	}
	render(){
		const { fixDate, reason, data, ModalVisible, ModalForm, Data  } = this.state
		const components = {
		  body: {
		    cell: EditableCell,
		  },
		};
		
		const columns = this.columns.map(col => {
		  if (!col.editable) {
		    return col;
		  }
		  return {
		    ...col,
		    onCell: record => ({
		      record,
		      inputType: col.dataIndex === 'age' ? 'number' : 'text',
		      dataIndex: col.dataIndex,
		      title: col.title,
		      editing: this.isEditing(record),
		    }),
		  };
		});
		
		return(
		<EditableContext.Provider value={this.props.form}>
			<div style={{height:'100%'}}>
				<div className="header">
					<h2>运维--设备维护</h2>
					<div className="title">
						<h2 style={{margin: 0,padding: 0,float: 'left'}}>设备编号:{Data.deviceNum}</h2>
						<h2 style={{margin: 0,padding: 0,float: 'right',}}>用户单位:&nbsp;&nbsp;{Data.client_unit}</h2>
					</div>
					<div style={{marginTop: 50}}>
						<span>报修时间:</span>
						<RangePicker className='antd-RangePicker' value={fixDate} onChange={(value)=>{this.fixDate(value)}} placeholder='' onOk={(value)=>{this.onOk(value)}}  showTime format="YYYY-MM-DD"/>
						<span>维护原因: </span>
						<select className="select" value={reason} onChange={(ev)=>{this.reason(ev)}}>
							<option key="d" value=""></option>
							<option key="a" value="例行维护">例行维护</option>
							<option key="b" value="运维报修">运维报修</option>
							<option key="c" value="用户报修">用户报修</option>
						</select>
						<Button className="antd-Button" type="primary" onClick={()=>{this.search()}}>搜索</Button>
						<Button className="antd-Button" type="primary" onClick={()=>{this.reset()}}>重置</Button>
						<Button style={{margin: '0.625rem 1.25rem'}} type="primary" onClick={()=>{this.ModalVisible()}}>新增报修</Button>
					</div>
				</div>
				<div className="mainFrame-modify">
					{/* <EditableFormTableMainten deviceNum={this.props.match.params.id}/> */}
					<Table
					  components={components}
					  bordered
					  dataSource={this.state.data}
					  columns={columns}
					  rowClassName="editable-row"
					  pagination={{
					    onChange: this.cancel,
					  }}
					/>
				</div>
				<div className="mainFrame-add">
					<Modal
						title="设备报修"
						visible={ModalVisible}
						onOk={this.handleModalOk}
						onCancel={this.handleModalCancel}
					>
						<span>设备状况描述:</span><Input className="antd-Input" value={ModalForm.remark} onChange={(ev)=>{this.ModalChange(ev,'remark')}}/><br/>
						<span>维护原因:</span>
						<select className="select" onChange={(ev)=>{this.ModalChange(ev,'reason')}} value={ModalForm.reason}>
							<option value=""></option>
							<option value="例行维护">例行维护</option>
							<option value="运维报修">运维报修</option>
							<option value="用户报修">用户报修</option>
						</select><br/>
						<span>维护结果:</span>
						<select className="select" onChange={(ev)=>{this.ModalChange(ev,'result')}} value={ModalForm.result}>
							<option value=""></option>
							<option value="等待维护">等待维护</option>
							<option value="正在维护">正在维护</option>
							<option value="维护完成">维护完成</option>
						</select><br/>
						<span>设备状态:</span>
						<select className="select" onChange={(ev)=>{this.ModalChange(ev,'status')}} value={ModalForm.status}>
							<option value=""></option>
							<option value="正常">正常</option>
							<option value="维护">维护</option>
							<option value="故障(停运)">故障(停运)</option>
							<option value="报废">报废</option>
						</select><br/>
						<span>报修时间:</span>
						<DatePicker className="antd-DatePicker" value={ModalForm.repair_time} onChange={(value)=>{this.repair_time(value)}} placeholder='选择日期' onOk={(value)=>{this.onOk(value)}}  showTime format="YYYY-MM-DD HH:mm:ss"/><br/>
						<span>负责人:</span>
						<select className="select" onChange={(ev)=>{this.ModalChange(ev,'responsible_person')}} value={ModalForm.responsible_person}>
							<option value=""></option>
							{
								this.state.accountData.map((item)=>{
									return <option key={item.id} value={item.name}>{item.name}</option>
								})
							}
						</select><br/>
					</Modal>
					{/* 回到顶部 */}
					<BackTop />
					<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
				</div>
			</div>
		</EditableContext.Provider>
		
		)
	}
	componentDidMount(){
		this.init();
		this.initGetdata();
	}
	
	isEditing = record => record.id === this.state.editingKey;
	//init()
	init = ()=>{
		console.log(this.props)
		const me = this;
		let deviceNum = this.props.match.params.id;
		let params = {deviceNum: deviceNum,};
		let url = originalUrl+'operation/operationInformation/';
		console.log('params:',params)
		model.fetch(params,url,'get',function(res){
			console.log('接收报修设备数据：',res.data);
			let data = res.data;
			for(let i=0;i<data.length;i++){
				data[i]['key'] = data[i].id;
			}
				me.setState({data: data,});
			})
		//根据设备编号查deviceInformation中的设备id
		let deviceParams = {deviceNum: deviceNum};
		let deviceUrl = originalUrl + 'device/deviceInformation/'
		model.fetch(deviceParams,deviceUrl,'get',function(res){
			let id = res.data[0].id;
			me.setState({
				id: id,
			})
		})
	}
	save(form, id) {
	  form.validateFields((error, row) => {
	    if (error) {
	      return;
	    }
	    const newData = [...this.state.data];
	    const index = newData.findIndex(item => id === item.id);
	    if (index > -1) {
	      const item = newData[index];
	      newData.splice(index, 1, {
	        ...item,
	        ...row,
	      });
	      this.setState({ data: newData, editingKey: '' });
				console.log('newdata:',newData);
				//将编辑的数据发送客户基础信息表
				const me = this;
				let deviceId = me.state.id;  //这条信息是设备信息表的id，此时要传的是设备维护表的id
				console.log('id:',deviceId)
				let deviceMainId = newData[index].id;  //这才是设备维护的id 注意别搞混了
				let deviceNum = me.props.match.params.id;
				let params = newData[index];
				let url = originalUrl+'operation/operationInformation/'+deviceMainId+'/';
				console.log('编辑的数据params:',params);
				if(params['result'] == '维护完成'){
					params['operation_time'] = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
					model.fetch(params,url,'put',function(res){
						console.log('发送编辑联系人数据：',res.data);
					})
				}else{
					model.fetch(params,url,'put',function(res){
						console.log('发送编辑联系人数据：',res.data);
					})
				}
				//将设备状态发送到deviceInformation put 进行修改
				let status = params['status'];
				if(status == '正常'){
					status = 'a';
				}else if(status == '维护'){
					status = 'b';
				}else if(status == '故障(停运)'){
					status = 'c';
				}else if(status == '报废'){
					status = 'd';
				}
				let params1 = {status1:status,deviceNum:deviceNum}
				let url1 = originalUrl+'device/deviceInformation/'+deviceId+'/';
				model.fetch(params1,url1,'put',function(res){
					console.log('修改成功');
				})
	    } else {
	      newData.push(row);
	      this.setState({ data: newData, editingKey: '' });
	    }
	  });
	}
	cancel = () => {
	  this.setState({ editingKey: '' });
	};
	edit(id) {
	  this.setState({ editingKey: id });
	}
	
	initGetdata = ()=>{
		let Data = {...this.state.Data}
		//获取用户单位
		let deviceNum = this.props.match.params.id; //设备编号
		console.log('deviceNum:',deviceNum)
		const me = this;
		let Queryparams = {deviceNum: deviceNum};
		let clientUrl = originalUrl+'device/allocation';
		model.fetch(Queryparams,clientUrl,'get',function(res){
			console.log('该设备数据：',res.data[0].client);
			let client_unit = res.data[0].client;
			Data['client_unit'] = client_unit;
			Data['deviceNum'] = deviceNum;
			console.log('Data:',Data)
			me.setState({
				Data: Data,
			})
		})
		//根据设备编号查deviceInformation中的设备id
		let deviceParams = {deviceNum: deviceNum};
		let deviceUrl = originalUrl + 'device/deviceInformation/'
		model.fetch(deviceParams,deviceUrl,'get',function(res){
			let id = res.data[0].id;
			Data['id'] = id;
			console.log('Data:',Data)
			me.setState({
				Data: Data,
			})
		})

	}
		//筛选区域
		 //报修时间
		fixDate = (value)=>{
			this.setState({fixDate: value});
		}
		onOk = (value)=>{
			console.log('onOk:',moment(value[0]._d).format('YYYY-MM-DD'),moment(value[1]._d).format('YYYY-MM-DD'))
		}
			// 报修原因
		reason = (ev)=>{
			console.log('维护原因选择：',ev.target.value);
			this.setState({reason: ev.target.value});
		}
		search = ()=>{
			let deviceNum = this.props.match.params.id; //设备编号
			const me = this;
			let fixDate = [...this.state.fixDate];
			let reason = me.state.reason;
			let url = originalUrl+'operation/operationInformation/';
			//如果报修时间不存在，
			if(!fixDate.length){
				let params = {reason: reason,deviceNum:deviceNum};
				model.fetch(params,url,'get',function(res){
					console.log('搜索的数据：',res.data);
					for(let i=0;i<res.data.length;i++){
						res.data[i]['key'] = res.data[i]['id']
					}
					me.setState({data: res.data})
				})
			}else{
				let start_time = moment(fixDate[0]._d).format('YYYY-MM-DD HH:mm:ss');
				let end_time = moment(fixDate[1]._d).format('YYYY-MM-DD HH:mm:ss');
				let params = {start_time: start_time,end_time: end_time,reason: reason}
				model.fetch(params,url,'get',function(res){
					console.log('请求到的数据：',res.data);
					for(let i=0;i<res.data.length;i++){
						res.data[i]['key'] = res.data[i]['id']
					}
					me.setState({data: res.data});
				})
			}
		}
		reset = ()=>{
			this.setState({
				reason: '',
				fixDate: [],
			})
			this.init();
		}
			//新增主机信息弹窗
		ModalVisible = ()=>{
			const me = this;
			let params = {};
			let url = originalUrl + 'account/User/';
			let accountData = [];
			model.fetch(params,url,'get',function(res){
				let data = res.data;
				for(let i=0;i<data.length;i++){
					if(data[i]['position'] == '经理'){
						accountData.push(data[i]);
					}
				}
				me.setState({
					accountData: accountData,
					ModalVisible:true,
				})
			})
		}
		ModalChange = (ev,key)=>{
			let ModalForm = {...this.state.ModalForm};
			for(let item in ModalForm){
				if(item == key){
					ModalForm[item] = ev.target.value;
				}
			}
			this.setState({ModalForm: ModalForm});
		}
		// 报修时间
		repair_time = (value)=>{
			console.log(typeof(value))
			console.log('value:',value)
			console.log('报修时间：',moment(value._d).format('YYYY-MM-DD HH:mm:ss'));
			let ModalForm = {...this.state.ModalForm};
			ModalForm['repair_time'] = value;
			this.setState({ModalForm: ModalForm});
		}
		onOk = (value)=>{
			console.log('报修/维修时间：',moment(value._d).format('YYYY-MM-DD HH:mm:ss'))
		}
		handleModalOk = e => {
			//将填写的数据发送到维护表 post
			//时间转化
			let ModalForm = {...this.state.ModalForm};
			console.log(new Date(ModalForm['repair_time']._d));
			let repair_time = moment(new Date(ModalForm['repair_time']._d)).format('YYYY-MM-DD HH:mm:ss');
			
			ModalForm['repair_time'] = repair_time;
			const me = this;
			let deviceNum = me.props.match.params.id;
			let result = this.state.ModalForm.result;
			let params = {...ModalForm,deviceNum: deviceNum};
			let url = originalUrl+'operation/operationInformation/';
			//维护完成时，记录该时间为维护完成时间
			if(result == '维护完成'){
				let operation_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
				params['operation_time'] = operation_time;
				model.fetch(params,url,'post',function(res){
					console.log('发送成功');
					me.init();
				})
			}else{
				model.fetch(params,url,'post',function(res){
					console.log('发送成功');
					me.init();
				})
			}
			//将设备状态发送到deviceInformation put
			let status = ModalForm.status;
			if(status == '正常'){
				status = 'a';
			}else if(status == '维护'){
				status = 'b';
			}else if(status == '故障(停运)'){
				status = 'c';
			}else if(status == '报废'){
				status = 'd';
			}
			let id = this.state.Data.id;
			let params1 = {status1:status,deviceNum:deviceNum}
			let url1 = originalUrl+'device/deviceInformation/'+id+'/';
			model.fetch(params1,url1,'put',function(res){
				console.log('修改成功');
			})
			//数据清除
			let Form = {...this.state.ModalForm}
			for(let item in Form){
				if(item == 'repair_time'){
					Form[item] = null;
				}else if(item == 'operation_time'){
					Form[item] = null;
				}else{
					Form[item] = '';
				}
			}
			 this.setState({
				 ModalVisible: false,
				 ModalForm: Form,
			 })
		};
		handleModalCancel = e => {
			let Form = {...this.state.ModalForm}
			for(let item in Form){
				if(item == 'repair_time'){
					Form[item] = null;
				}else if(item == 'operation_time'){
					Form[item] = null;
				}else{
					Form[item] = '';
				}
			}
			 this.setState({
				 ModalVisible: false,
				 ModalForm: Form,
			 })
		};
}
// export default Maintenance;
export default Form.create()(Maintenance);