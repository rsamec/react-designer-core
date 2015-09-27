import React from 'react';
import _ from 'lodash';
import {Panel,Tabs,Tab} from 'react-bootstrap';
import ToolboxShapes from './toolbox/Shapes.js';

export default class ToolBox extends React.Component {
    handleClick(ctrl) {
        this.props.addCtrl(ctrl.name);
    }
    add(name){
        this.props.addCtrl(name);
    }

    render() {
        var header = function (name, count) {
            return (<h4>{name} <span className='badge'>{count}</span></h4>);
        };

        return (
            <div>
                <Tabs defaultActiveKey={0} position='left' tabWidth={5} paneWidth={6}>

                    {this.props.dataSource.map(function (node, i) {
                        return (
                            <Tab title={node.type} eventKey={i} key={'tab' + i}>
                                <div className="toolboxGroup">
                                    {header(node.type,node.controls.length)}
                                    <hr/>
                                    {node.controls.map(function (ctrl, j) {
                                        return (
                                            <div className="Tile" onClick={this.handleClick.bind(this,ctrl)}>
                                                {React.DOM.span({className:'label label-info'}, ctrl.label)}
                                            </div>
                                        );
                                    }, this)}
                                </div>
                            </Tab>
                        );
                    }, this)}

                    <Tab title='Shapes' eventKey={10} key='tab10'>
                        <ToolboxShapes add={this.add.bind(this)} />
                    </Tab>

                </Tabs>
            </div>
        );
    }
};

ToolBox.defaultProps = {
    dataSource: [
        {
            type: 'Text',
            collapsed: false,
            controls: [
                {name: 'Core.HtmlBox', label: 'HtmlEditor'},
                {name: 'Core.TextBox', label: 'TextBox'},
                {name: 'Core.JSXBox', label: 'JSXBox'},
                {name: 'Core.ValueBox', label: 'ValueBox'},
            ]
        },
        {
            type: 'Images',
            collapsed: false,
            controls: [

                {name: 'Core.ImageBox', label: 'ImageBox'},
                {name: 'Core.ImagePanel', label: 'ImagePanel'}
            ]
        },
        {
            type: 'Input',
            collapsed: false,
            controls: [
                {name: 'Core.TextBoxInput', label: 'TextBoxInput'},
                {name: 'Core.CheckBoxInput', label: 'CheckBoxInput'},
                {name: 'Core.SelectBoxInput', label: 'SelectBoxInput'},
                {name: 'Core.TangleNumberText', label: 'TangleNumberText'},
                {name: 'Core.TangleBoolText', label: 'TangleBoolText'}
            ]
        },
        {
            type: 'Shapes',
            collapsed: true,
            controls: _.map(['Rectangle', 'Circle', 'Ellipse', 'Line', 'Triangle'], function (x) {
                return {
                    'name': 'Shapes.' + x, 'label': x
                }
            })
        },
        {
            type: 'Charts',
            collapsed: true,
            controls: _.map(['Bar', 'Pie', 'Tree', 'SmoothLine', 'StockLine', 'Scatterplot', 'Radar'], function (x) {
                return {'name': 'Chart.' + x, 'label': x}
            })
        },
        {
            type: 'Bootstrap',
            collapsed: true,
            controls: _.map(['Input', 'Button', 'Panel', 'Glyphicon', 'Tooltip', 'Alert', 'Label'], function (x) {
                return {
                    'name': 'react-bootstrap.' + x, 'label': x
                }
            })
        },
        {
            type: 'Panels',
            collapsed: false,
            controls: [
                {name: 'Container', label: 'Container'},
                {name: 'Repeater', label: 'Repeater'},
            ]
        }
        //{
        //    type: 'Extra',
        //    collapsed: true,
        //    controls: [
        //        {name: 'React.Griddle', label: 'Griddle'},
        //        {name: 'react-pivot.PivotTable', label: 'Pivot table'},
        //        {name: 'Flipper', label: 'Flipper'},
        //        {name: 'react-inlinesvg', label: 'SvgBox'},
        //        {name: 'MovieSelect', label: 'Movie carousel select'}
        //        //{name: 'Reacticon', label: 'Reacticon'},
        //        //{name: 'SnapSvgBox', label: 'SnapSvgBox'},
        //    ]
        //}
    ]
}

