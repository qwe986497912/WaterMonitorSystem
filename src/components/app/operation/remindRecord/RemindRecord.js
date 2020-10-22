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
                  message: `请输入 ${title}!`,
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
			deviceNum: '', //设备编号
    	data: [
				
			],
    	editingKey: '' ,
    };
    this.columns = [
      {
        title: 'PH传感器',
        dataIndex: 'ph',
        width: '14%',
        editable: true,
      },
			{
			  title: '电导率传感器',
			  dataIndex: 'conductivity',
			  width: '14%',
			  editable: true,
			},
			{
			  title: '浊度传感器',
			  dataIndex: 'turbidity',
			  width: '14%',
			  editable: true,
			},
			{
			  title: '腐蚀速率',
			  dataIndex: 'corrosion',
			  width: '14%',
			  editable: true,
			},
			{
			  title: 'ORP',
			  dataIndex: 'orp',
			  width: '14%',
			  editable: true,
			},
			{
			  title: '温度传感器',
			  dataIndex: 'temper',
			  width: '14%',
			  editable: true,
			},
      {
        title: '设定',
        dataIndex: 'edit',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    确认设定
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="确定取消?" onConfirm={() => this.cancel(record.key)}>
                <a>取消设定</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              设定
            </a>
          );
        },
      },
    ];
  }

  isEditing = record => record.key === this.state.editingKey;
	
	componentDidMount(){
		this.setState({deviceNum: this.props.deviceNum});
		this.init();
	}
	init = ()=>{
		const me = this;
		let deviceNum = me.props.deviceNum;
		console.log('deviceNum:',deviceNum)
		console.log('me.props.deviceNum:',me.props.deviceNum)
		let data = [...me.state.data];
		let params = {deviceNum:deviceNum};
		let url = originalUrl + 'operation/limit/';
		model.fetch(params,url,'get',function(res){
			console.log('传感器阈值：',res.data)
			let data = [];
			if(res.data.length){
				data.push(res.data[0]);
				data['key'] = data['id'];
				me.setState({
					data:data,
				});
			}else{
				console.log('kong')
				let data = [{
					key: 1,
					ph: '5-10',
					conductivity: '5-10',
					turbidity: '5-10',
					corrosion: '5-10',
					orp: '5-10',
					temper: '5-10',
				},]
				me.setState({
					data:data,
				});
			}
		})
	}
  cancel = () => {
    this.setState({ editingKey: '' });
  };
	

  save(form, key) {
		console.log('key:',key)
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
				console.log('newdata:',newData[index]);
				//将阈值设定数据发送到 阈值表中
				const me = this;
				let deviceNum = me.props.deviceNum;
				let url = originalUrl + 'operation/limit/';
				let params = {...newData[index],deviceNum:deviceNum};
				model.fetch(params,url,'post',function(res){
					console.log('发送成功');
					//给父组件传值 刷新父组件
					me.props.flash('刷新');
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

const RemindModal = Form.create()(EditableTable);
export default RemindModal;