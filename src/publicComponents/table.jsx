import React, { Component } from 'react';
import { Pagination } from 'antd';
import { connect } from 'react-redux'

import { dispatchSetDataModule } from '../dataModule/store/actionCreators'
import store from '../store'

let _outModuleName = '';

class Table extends Component {
    constructor(props) {
        super(props);
        if (this.props.myModule !== undefined) {
            this.myModule = this.props.myModule;
            _outModuleName = this.myModule._moduleName;
        }
        if (this.props.header !== undefined) {
            this.header = this.props.header;
        }
        if (this.props.header !== undefined) {
            this.totalNum = this.props.totalNum === undefined ? 50 : this.props.totalNum;
        }
        this.state = {
            // 用于展示的数据
            currentShowLines: [],
            // 所有数据
            allLines: [],
            // 当前选中页
            pageNum: 1,
        };
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentDidMount() {
        const { allLines } = this.state;

        this.myModule._get();

        // 在没有获取到所有数据的情况下，新增空白数据
        // 根据总数据量和已经获取的数据量来确定需要新增的空白数据量
        if (this.totalNum > allLines.length) {
            for (let i = allLines.length; i < this.totalNum; i++) {
                this.myModule._dataStructure["whetherNullLine"] = true;
                allLines.push(this.myModule._dataStructure);
            }
            this.setState({
                allLines: allLines,
            })
        }

        store.dispatch(dispatchSetDataModule([], this.myModule._moduleName));
    }

    componentDidUpdate() {
        const { allLines, pageNum, currentShowLines } = this.state;

        let newLines = this.props.neededData;
        let newLinesJs = newLines.toJS();

        if (allLines.length !== 0) {
            let currentNeededLine = allLines[(pageNum - 1) * 10];

            if (newLinesJs.length !== 0 && currentNeededLine.whetherNullLine !== undefined) {
                for (let i = 0; i < newLinesJs.length; i++) {
                    allLines[(pageNum - 1) * 10 + i] = newLinesJs[i]
                };
                this.setState({
                    allLines: allLines,
                });

            }

            if (newLinesJs.length !== 0 && currentNeededLine.whetherNullLine === undefined) {
                store.dispatch(dispatchSetDataModule([], this.myModule._moduleName))
            }

            if (currentNeededLine.whetherNullLine === undefined && currentShowLines[0].whetherNullLine !== undefined) {
                this.setCurrentShowLines()
            }
        }

        if (pageNum === 1 && currentShowLines.length === 0) {
            this.setState({
                currentShowLines: allLines.slice(0, 10),
            })
        };
    }

    setCurrentShowLines() {
        const { allLines, pageNum } = this.state;
        let currentShowLines = allLines.slice((pageNum - 1) * 10, pageNum * 10);

        this.setState({
            currentShowLines: currentShowLines,
        });

    }

    // 渲染单行内容行
    renderSingleLine(oneLine, index) {
        const thLine = [];
        let keyValue = 0
        for (let i of this.header) {
            thLine.push(<td key={keyValue}>{oneLine[i.dataIndex]}</td>);
            keyValue++;
        }
        thLine.unshift(<td key={-1}>{index + 1}</td>)
        return thLine;
    }

    onChangePage(page) {
        const { allLines } = this.state;
        const neededNewLines = allLines.slice((page - 1) * 10, page * 10);
        this.setState({
            pageNum: page,
            currentShowLines: neededNewLines
        });
        if (neededNewLines[0].whetherNullLine !== undefined) {
            this.myModule._get();
        }
    }

    render() {
        const { currentShowLines } = this.state;
        // console.log(this.state.allLines);

        return (
            <div>
                <table className="public-table">
                    <thead>
                        <tr>
                            <th style={{ width: 40 }}>序号</th>
                            {
                                this.header.map((item, index) => {
                                    return <th key={index}>{item.title}</th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentShowLines.map((item, index) => {
                                return <tr key={index}>{this.renderSingleLine(item, index)}</tr>
                            })
                        }
                    </tbody>
                </table>
                <div className="public-pagination">
                    <Pagination
                        current={this.state.pageNum}
                        total={this.totalNum}
                        onChange={this.onChangePage}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        neededData: state.get('dataModule').get(_outModuleName)
    }
}

export default connect(mapStateToProps, null)(Table);