import React, { Component } from "react";
import { Table, Input, InputNumber, Popconfirm, Form, DatePicker,Button } from 'antd';
import { Model } from '../../../../dataModule/testBone.js';
import { originalUrl } from '../../../../dataModule/UrlList';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const EditableContext = React.createContext();
const model = new Model();
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

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

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	id:'',
    	data: [],
    	editingKey: '' ,
    };
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
			  editable: false,
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

  isEditing = record => record.id === this.state.editingKey;
	
	componentDidMount(){
		this.init();
	}
	//init()
	init = ()=>{
		console.log(this.props)
		const me = this;
		let deviceNum = this.props.deviceNum;
		let params = {deviceNum: this.props.deviceNum,};
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
				let deviceNum = me.props.deviceNum;
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

  edit(id) {
    this.setState({ editingKey: id });
  }

  render() {
		const { fixDate, reason, } = this.state
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

    return (
			
      <EditableContext.Provider value={this.props.form}>
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
      </EditableContext.Provider>
    );
  }
}

const EditableFormTableMainten = Form.create()(EditableTable);
export default EditableFormTableMainten;