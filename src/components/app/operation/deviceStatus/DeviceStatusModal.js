import React, { Component } from "react";
import { Table, Input, InputNumber, Popconfirm, Form, Select } from 'antd';
import axios from 'axios';
import { Model } from '../../../../dataModule/testBone.js';
import { originalUrl } from '../../../../dataModule/UrlList';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const EditableContext = React.createContext();
const model = new Model();
const { Option } = Select;

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
			arry: {},               //接收的设备 id 编号 用户单位 
    	data: [],
    	editingKey: '' ,
    };
    this.columns = [
      {
        title: 'PH传感器',
        dataIndex: 'PH',
        width: '100',
        editable: false,
      },
      {
        title: '电导率传感器',
        dataIndex: 'conductivity',
        width: '100',
        editable: false,
      },
      {
        title: '浊度传感器',
        dataIndex: 'turbidity',
        width: '100',
        editable: false,
      },
			{
			  title: 'COD传感器',
			  dataIndex: 'COD',
			  width: '120',
			  editable: false,
			},
			{
			  title: '荧光度传感器',
			  dataIndex: 'Fluorescence',
			  width: '100',
			  editable: true,
			},
			{
			  title: 'PLC',
			  dataIndex: 'PLC',
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

  isEditing = record => record.id === this.state.editingKey;
	
	componentDidMount(){
		this.setState({arry: this.props.data});
		this.init();
	}
	//init()
	init = ()=>{
		const me = this;
		let deviceNum = this.props.data.deviceNum;
		let id = this.props.data.id;
		let params = {deviceNum: deviceNum,};
		let url = originalUrl+'operation/operationInformation';
		model.fetch(params,url,'get',function(res){
			console.log('接收报修设备数据：',res.data);
		let data = res.data;
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i].id;
		}
			me.setState({data: data,});
		})
	}
  cancel = () => {
    this.setState({ editingKey: '' });
  };

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
				let params = newData[index];
				let url = originalUrl+'operation/operationInformation/'+id+'/';
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
				let params1 = {status1:status}
				let id = this.props.data.id;
				let url1 = originalUrl+'device/deviceInformation/'+id+'/';
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

const DeviceStatusModal = Form.create()(EditableTable);
export default DeviceStatusModal;