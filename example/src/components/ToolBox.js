import React from 'react';
import _ from 'lodash';
import {Panel,Tabs,Tab} from 'react-bootstrap';
import ToolBoxItem from './ToolBoxItem.js';

var textParagraph = require('../toolbox/TextParagraph.json').containers[0];
var textTitles = require('../toolbox/TextTitles.json').containers[0];
var textLists = require('../toolbox/TextLists.json').containers[0];
var textColumns = require('../toolbox/TextColumns.json').containers[0];
class ToolboxTexts extends React.Component {
    render(){
        return (
            <div>
                <h3>Titles</h3>
                <hr/>
                <ToolBoxItem imgUrl='toolbox/TextTitles.png' container={textTitles} addFce={this.props.add} />
                <h3>Paragraphs</h3>
                <hr/>
                <ToolBoxItem imgUrl='toolbox/TextParagraph.png' container={textParagraph} addFce={this.props.add} />
                <h3>Lists</h3>
                <hr/>
                <ToolBoxItem imgUrl='toolbox/TextLists.png' container={textLists} addFce={this.props.add} />
                <h3>Multiple columns paragraphs</h3>
                <hr/>
                <ToolBoxItem imgUrl='toolbox/TextColumns.png' container={textColumns} addFce={this.props.add} />
            </div>
        )
    }
};


var shapeBasic = require('../toolbox/ShapeBasic.json').containers[0];
class ToolboxShapes extends React.Component {
    render(){
        return (
            <div>
                <h3>Basic shapes</h3>
                <hr/>
                <ToolBoxItem imgUrl='toolbox/ShapeBasic.png' container={shapeBasic} addFce={this.props.add} />
            </div>
        )
    }
};
var bootstrapCon = require('../toolbox/Bootstrap.json').containers[0];
class ToobBoxBootstrap extends React.Component {
    render(){
        return (
            <div>
                <h3>Bootstrap controls</h3>
                <hr/>
                <ToolBoxItem imgUrl='toolbox/Bootstrap.png' container={bootstrapCon} addFce={this.props.add} />
            </div>
        )
    }
};

var imagesCon = require('../toolbox/Images.json').containers[0];
class ToobBoxImages extends React.Component {
    render(){
        return (
            <div>
                <h3>Image boxes</h3>
                <hr/>
                <ToolBoxItem imgUrl='toolbox/Images.png' container={imagesCon} addFce={this.props.add} />
            </div>
        )
    }
};
var chartCon = require('../toolbox/Chart.json').containers[0];
class ToolBoxCharts extends React.Component {
    render(){
        return (
            <div>
                <h3>Image boxes</h3>
                <hr/>
                <ToolBoxItem imgUrl='toolbox/Chart.png' container={chartCon} addFce={this.props.add} />
            </div>
        )
    }
};

export default class ToolBox extends React.Component {
    handleClick(ctrl) {
        this.props.addCtrl(ctrl.name);
    }
    add(item){
        this.props.addCtrl(item.elementName,item);
    }
    render() {
        var header = function (name, count) {
            return (<h4>{name} <span className='badge'>{count}</span></h4>);
        };

        return (
            <div>
                <Tabs defaultActiveKey={0} position='left' tabWidth={3} paneWidth={8}>
                    <Tab title='Texts' eventKey={0} key='tab0'>
                        <ToolboxTexts add={this.add.bind(this)} />
                    </Tab>
                    <Tab title='Bootstrap' eventKey={1} key='tab1'>
                        <ToobBoxBootstrap add={this.add.bind(this)} />
                    </Tab>
                    <Tab title='Images' eventKey={2} key='tab2'>
                        <ToobBoxImages add={this.add.bind(this)} />
                    </Tab>
                    <Tab title='Shapes' eventKey={4} key='tab4'>
                        <ToolboxShapes add={this.add.bind(this)} />
                    </Tab>
                    <Tab title='Charts' eventKey={5} key='tab5'>
                        <ToolBoxCharts add={this.add.bind(this)} />
                    </Tab>
                    <Tab title='Controls' eventKey={10} key='tab10'>
                        {this.props.dataSource.map(function (node, i) {
                            return (
                                <Panel header={header(node.type,node.controls.length)} key={'panel' + i}>
                                        {node.controls.map(function (ctrl, j) {
                                            return (
                                                <div className="Tile" onClick={this.handleClick.bind(this,ctrl)} key={'tile' + j}>
                                                    {React.DOM.span({className:'label label-info'}, ctrl.label)}
                                                </div>
                                            );
                                        }, this)}
                                </Panel>);
                        }, this)}
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
            controls: _.map(['Rectangle', 'Circle', 'Ellipse', 'Line', 'Triangle','Dimension'], function (x) {
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
                {name: 'Repeater', label: 'Repeater'}
            ]
        },
        {
            type: 'Extra',
            collapsed: true,
            controls: [
                {name: 'Core.PivotTable', label: 'Pivot table'},
                {name: 'Core.Flipper', label: 'Flipper'},
                {name: 'react-griddle', label: 'Griddle'},
                {name: 'react-inlinesvg', label: 'SvgBox'}
        //        {name: 'MovieSelect', label: 'Movie carousel select'}
        //        //{name: 'Reacticon', label: 'Reacticon'},
        //        //{name: 'SnapSvgBox', label: 'SnapSvgBox'},
            ]
        }
    ]
}

