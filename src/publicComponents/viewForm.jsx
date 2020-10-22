import React, { Component } from 'react';

class ViewForm extends Component {
    constructor(props) {
        super(props);
        this.module = this.props.module;
        this.state = {
            form_data: this.props.form,
        }
    }

    render() {
        let { form_data } = this.state;
        let _viewForm = this.module._viewForm;

        return (
            <div className="view-form">
                {
                    _viewForm.map((item, index) => {
                        let unit = null;
                        if (item[1] === 'int' || item[1] === 'float') {
                            // 当数据为数字型时，需要单位
                            unit = item[3];
                        };

                        let value = form_data[item[0]];
                        if (item[1] === 'date') {
                            value = value.toString();
                            value = `${value.substr(0, 4)}-${value.substr(4, 2)}-${value.substr(6, 2)}`
                        }

                        return (
                            <div key={index}>
                                <span>{item[2]}：</span>
                                <span>{value}</span>
                                {unit === null ? null : <span style={{ marginLeft: 8 }}>{unit}</span>}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
};

export default ViewForm;