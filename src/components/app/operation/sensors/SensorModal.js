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
				{
					key: 0,
					value: 'ph',
					sensor_name: 'PH传感器',
					sensor_value1: '',
				},
				{
					key: 1,
					value: 'conductivity',
					sensor_name: '电导率传感器',
					sensor_value1: '',
				},
				{
					key: 2,
					value: 'turbidity',
					sensor_name: '浊度传感器',
					sensor_value1: '',
				},
				{
					key: 3,
					value: 'ORP',
					sensor_name: 'ORP传感器',
					sensor_value1: '',
				},
				{
					key: 4,
					value: 'corrosion',
					sensor_name: '腐蚀速率',
					sensor_value1: '',
				},
				{
					key: 5,
					value: 'temper',
					sensor_name: '温度传感器',
					sensor_value1: '',
				},
			],
    	editingKey: '' ,
    };
    this.columns = [
      {
        title: '传感器',
        dataIndex: 'sensor_name',
        width: '100',
        editable: false,
      },
      {
        title: '理论值',
        dataIndex: 'sensor_value1',
        width: '100',
        editable: true,
      },
      {
        title: '标定',
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
                    确认标定
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>取消标定</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              标定
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
	//init() 比如取sensor_name='PH传感器',取出几条数据，选择最新的一条吧值覆盖到data
	init = ()=>{
		const me = this;
		let deviceNum = me.props.deviceNum;
		console.log('deviceNum:',deviceNum)
		console.log('me.props.deviceNum:',me.props.deviceNum)
		let data = [...me.state.data];
		for(let i=0;i<data.length;i++){
			let params = {sensor_name:data[i].sensor_name,deviceNum:deviceNum};
			let url = originalUrl+'operation/calibration';
			model.fetch(params,url,'get',function(res){
				console.log('理论值筛选的数据：',res.data);//此时的数据可能是多个设备的
				let Data = res.data;
				let value = '';
				if(Data.length){
					value = Data[0].sensor_value1;
				}else{
					value = '请输入理论值'
				}
				data[i].sensor_value1 = value;
				me.setState({data:data});
			})
		}
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
				//将标定数据发送到 标定表中
				const me = this;
				let deviceNum = me.props.deviceNum;
				let time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
				let sensor_name = newData[index].sensor_name;
				let sensor_value1 = newData[index].sensor_value1;
				let value = newData[index].value;   //查询时传感器的关键字
				console.log('传感器名字value:',value);
				//实测值需要从数据库sensor/value中取最新一条数据的对应sensor_name的值
				let url = originalUrl+'sensor/value/';
				let params = {deviceNum:deviceNum};
				model.fetch(params,url,'get',function(res){
					console.log('res.data:',res.data)
					console.log('最新一条数据：',res.data[res.data.length-1])
					let sensor_value2 = res.data[res.data.length-1][value];  //实测值
					let params = {
						deviceNum:deviceNum,
						time:time,
						sensor_name:sensor_name,
						sensor_value1:sensor_value1,
						sensor_value2:sensor_value2,
					}
					let Url = originalUrl+'operation/calibration/';
					model.fetch(params,Url,'post',function(res){
						console.log('发送成功');
						//给父组件传值 刷新父组件
						console.log('me:',me)
						me.props.flash('刷新');
					})
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

const SensorModal = Form.create()(EditableTable);
export default SensorModal;