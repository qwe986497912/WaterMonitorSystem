import React, { Component } from 'react';
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './style.less';

class EditForm extends Component {
    constructor(props) {
        super(props);
        /**
         * 在直接继承该组件的情况下，module 不是传参；
         * 但是在子组件的构造函数中同样需要定义 this.module；
         * 此处使用子组件中定义的 this.module 替代传参中的 module；
         */
        if (this.props.module !== undefined) {
            this.module = this.props.module;
        }
        this.state = {
            form_data: this.props.form,
        }
    }

    changeDate(date, dateString, name) {
        let form_data = this.state.form_data;
        form_data[name] = parseInt(dateString.substr(0, 4) + dateString.substr(5, 2) + dateString.substr(8, 2), 10);

        this.setState({
            form_data: form_data
        })
    }

    onChange = (e) => {
        let form_data = this.state.form_data;
        form_data[e.target.name] = e.target.value;

        this.setState({
            form_data: form_data,
        })
    }

    render() {
        let { form_data } = this.state;
        let { submitFunction } = this.props;

        // 在直接继承该组件的情况下，由于回调函数不是通过传参获得的，所以要通过 this
        if (submitFunction === undefined) submitFunction = this.submitFunction;

        let _editForm = this.module._editForm;

        return (
            <div className="edit-form">
                {
                    _editForm.map((item, index) => {
                        let type = "text";
                        let unit = null;
                        if (item[1] === 'int' || item[1] === 'float') {
                            type = "number";
                            // 当数据为数字型时，需要单位
                            unit = item[3];
                        };
                        let value = form_data[item[0]] ? form_data[item[0]] : '';

                        let element = null;
                        if (item[1] === 'date') {
                            element = <DatePicker
                                onChange={(date, dateString) => this.changeDate(date, dateString, item[0])}
                                locale={locale}
                                value={moment(value.toString(), 'YYYYMMDD')}
                            />
                        } else {
                            element = <div key={index}>
                                <span>{item[2]}：</span>
                                <input
                                    type={type}
                                    autoComplete="off"
                                    name={item[0]}
                                    onChange={this.onChange}
                                    value={value}
                                />
                                {unit === null ? null : <span style={{ marginLeft: 8 }}>{unit}</span>}
                            </div>
                        }

                        return element;
                    })
                }
                <button onClick={() => submitFunction()}>提交</button>
            </div>
        )
    }
}

export default EditForm;