import React, { Component } from "react";
import { Table, Input, InputNumber, Popconfirm, Form, BackTop } from 'antd';
import axios from 'axios';
import { Model } from '../../../dataModule/testBone.js';
import { originalUrl } from '../../../dataModule/UrlList';

const EditableContext = React.createContext();
const model = new Model();

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
        title: '客户单位',
        dataIndex: 'client_unit',
        width: '10%',
        editable: true,
      },
      {
        title: '客户地区',
        dataIndex: 'client_address',
        width: '10%',
        editable: true,
      },
      {
        title: '客户邮编',
        dataIndex: 'client_EM',
        width: '10%',
        editable: true,
      },
			{
			  title: '客户行业',
			  dataIndex: 'client_industry',
			  width: '10%',
			  editable: true,
			},
			{
			  title: '客户电话',
			  dataIndex: 'client_tell',
			  width: '15%',
			  editable: true,
			},
			{
			  title: '客户传真',
			  dataIndex: 'client_fax',
			  width: '15%',
			  editable: true,
			},
			{
			  title: '备注',
			  dataIndex: 'remark',
			  width: '15%',
			  editable: true,
			},
      {
        title: '编辑',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <Popconfirm title="确定更改?" onConfirm={() => this.save(form, record.id)}>
                    <a
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </a>
                  </Popconfirm>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="确定取消?" onConfirm={() => this.cancel(record.id)}>
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
		console.log('id:',this.props.id);
		this.setState({id: this.props.id ,})
		this.init();
	}
	//init()
	init = ()=>{
		const me = this;
		let params = {id: this.props.id,};
		let url = originalUrl+'client/clientInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('接收联系人数据：',res.data);
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
				let url = originalUrl+'client/clientInformation/'+id+'/';
				model.fetch(params,url,'put',function(res){
					console.log('发送编辑联系人数据：',res.data);
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
			{/* 回到顶部 */}
			<BackTop />
			<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
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

const EditableFormTableRight = Form.create()(EditableTable);
export default EditableFormTableRight;