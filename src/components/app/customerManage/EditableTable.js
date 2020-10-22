import React from 'react';
import { Table, Input, Button, Popconfirm, Form, } from 'antd';
import { Model } from '../../../dataModule/testBone.js';
import { originalUrl } from '../../../dataModule/UrlList';
import history from '../../common/history.js';
const EditableContext = React.createContext();
const model = new Model();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
			data: '',
			editingKey: '',
		  dataSource: [],
		  count: 2,
			columns: [
			  {
			    title: '联系人',
			    dataIndex: 'contacts',
			    width: '30%',
			    editable: true,
			  },
			  {
			    title: '联系人职位',
			    dataIndex: 'position',
					editable: true,
			  },
			  {
			    title: '联系人电话',
			    dataIndex: 'tell',
					editable: true,
			  },
				{
				  title: '备注',
				  dataIndex: 'remark',
					editable: true,
				},
			  {
			    title: 'operation',
			    dataIndex: 'operation',
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
											Save
										</a>
									)}
								</EditableContext.Consumer>
								<Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
									<a>Cancel</a>
								</Popconfirm>
							</span>
						) : (
							<span>
								<a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
									Edit
								</a>&nbsp;&nbsp;&nbsp;
								<Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
									<a>Delete</a>
								</Popconfirm>
							</span>
						);
					},
			  },
			],
		};
    

    
  }
	
	 isEditing = record => record.key === this.state.editingKey;
		componentDidMount(){
			this.init();
		}
		init = ()=>{
			// model.fetch(originalUrl,'get',function(res){
			// 	console.log('联系人信息--res.data:',res.data);
			// 	this.setState({dataSource: res.data,});
			// })
			let data = [
				{
					key: 0,
					client_id: 0,
					contacts: 'jack',
					position: '经理',
					tell: 158326952,
					remark: '无',
				},
				{
					key: 1,
					client_id: 1,
					contacts: 'Mary',
					position: '工程师',
					tell: 2513512,
					remark: '23636',
				},
			];
			this.setState({dataSource: data,})
		}
	  cancel = () => {
	    this.setState({ editingKey: '' });
	  };
	
	  save(form, key) {
			console.log('form:',form)
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
					console.log('newData:',newData)
	        this.setState({ data: newData, editingKey: '' });
	      } else {
	        newData.push(row);
	        this.setState({ data: newData, editingKey: '' });
	      }
	    });
	  }
	
	  edit(key) {
	    this.setState({ editingKey: key });
	  }
  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
			 contacts: '请输入联系人',
			 position: '请输入职位',
			 tell: '请输入电话',
			 remark: '请输入备注',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
				row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={this.state.dataSource}
          columns={columns}
        />
      </div>
    );
  }
}
