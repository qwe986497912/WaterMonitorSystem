import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, BackTop } from 'antd';
import axios from 'axios';
import { Model } from '../../../dataModule/testBone.js';
import { originalUrl } from '../../../dataModule/UrlList';
import history from '../../common/history.js';

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
			id:'',
			data: [],
			editingKey: '' ,
		};
    this.columns = [
      {
        title: '联系人',
        dataIndex: 'contacts',
        width: '20%',
        editable: true,
      },
      {
        title: '职位',
        dataIndex: 'position',
        width: '15%',
        editable: true,
      },
      {
        title: '电话',
        dataIndex: 'tell',
        width: '25%',
        editable: true,
      },
			{
			  title: '备注',
			  dataIndex: 'remark',
			  width: '25%',
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
                  <a
                    style={{ marginRight: 8 }} onClick={() => this.save(form, record.id)}
                  >
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="确定取消?" onConfirm={() => this.cancel(record.client_id)}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
						<span>
							<a disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
							  编辑
							</a>&nbsp;&nbsp;&nbsp;&nbsp;
							<Popconfirm title="确定删除?" onConfirm={() => this.delete(record.id)}>
							  <a>删除</a>
							</Popconfirm>
						</span>
            
          );
        },
      },
    ];
  }
	componentDidMount(){
		console.log('id:',this.props.id);
		this.setState({id: this.props.id ,})
		this.init();
	}
	// init
	init = ()=>{
		const me = this;
		let params = {client_id: this.props.id,};
		let url = originalUrl+'client/contactsInformation/';
		model.fetch(params,url,'get',function(res){
			console.log('接收联系人数据：',res.data);
		let data = res.data;
		for(let i=0;i<data.length;i++){
			data[i]['key'] = data[i].id;
		}
			me.setState({data: data,});
		})
	}
	//增加客户
	handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      // key: this.props.id,
      contacts: null,
      position: null,
      tell: null,
			remark: null,
    };
    this.setState({
      data: [...this.state.data, newData],
    });
		//新增客户
		const me = this;
		let params = {...newData,client_id: this.props.id,};
		let url = originalUrl+'client/contactsInformation/';
		model.fetch(params,url,'post',function(res){
			console.log('发送编辑联系人数据：',res.data);
			me.init();
		})
  };
  isEditing = record => record.id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, id) {
		console.log('id:',id)
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
				//将编辑的数据发送到联系人表
				const me = this;
				let params = newData[index];
				let url = originalUrl+'client/contactsInformation/'+id+'/';
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
		console.log('id:',id);
    this.setState({ editingKey: id });
  }
	delete = (id)=>{
		console.log('delete--id:',id);
		//将删除的数据的id发送到联系人表
		const me = this;
		let params = {};
		let url = originalUrl+'client/contactsInformation/'+id+'/';
		model.fetch(params,url,'delete',function(res){
			console.log('发送编辑联系人数据：',res.data);
			me.init();
		})
	
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
			<Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
			          添加联系人
			</Button>
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
				{/* 回到顶部 */}
				<BackTop />
				<strong style={{ color: 'rgba(64, 64, 64, 0.6)' }}></strong>
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;