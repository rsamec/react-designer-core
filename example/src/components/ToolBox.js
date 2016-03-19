import React from 'react';
import _ from 'lodash';
import ToolBoxItem from './ToolBoxItem.js';
import ToolBoxCore from './ToolBoxCore.js';
import ToolBoxIcons from './ToolBoxIcons.js';

var textParagraph = require('../toolbox/TextParagraph.json').containers[0];
var textTitles = require('../toolbox/TextTitles.json').containers[0];
var textLists = require('../toolbox/TextLists.json').containers[0];
var textColumns = require('../toolbox/TextColumns.json').containers[0];

let ToolBoxTexts = (props) => {
	return (<div>
			<h3>Titles</h3>
			<hr/>
			<ToolBoxItem imgUrl='toolbox/TextTitles.png' container={textTitles} addFce={props.add}/>
			<h3>Paragraphs</h3>
			<hr/>
			<ToolBoxItem imgUrl='toolbox/TextParagraph.png' container={textParagraph} addFce={props.add}/>
			<h3>Lists</h3>
			<hr/>
			<ToolBoxItem imgUrl='toolbox/TextLists.png' container={textLists} addFce={props.add}/>
			<h3>Multiple columns paragraphs</h3>
			<hr/>
			<ToolBoxItem imgUrl='toolbox/TextColumns.png' container={textColumns} addFce={props.add}/>
		</div>
	)
}


var shapeBasic = require('../toolbox/ShapeBasic.json').containers[0];
let ToolBoxShapes = (props) => {
	return (
		<div>
			<h3>Basic shapes</h3>
			<hr/>
			<ToolBoxItem imgUrl='toolbox/ShapeBasic.png' container={shapeBasic} addFce={props.add}/>
		</div>
	)
}

var bootstrapCon = require('../toolbox/Bootstrap.json').containers[0];
let ToolBoxBootstrap = (props) => {
	return (
		<div>
			<h3>Image boxes</h3>
			<hr/>
			<ToolBoxItem imgUrl='toolbox/Bootstrap.png' container={bootstrapCon} addFce={props.add}/>
		</div>
	)
}

var imagesCon = require('../toolbox/Images.json').containers[0];
let ToolBoxImages = (props) => {
	return (
		<div>
			<h3>Image boxes</h3>
			<hr/>
			<ToolBoxItem imgUrl='toolbox/Images.png' container={imagesCon} addFce={props.add}/>
		</div>
	)
}
var chartCon = require('../toolbox/Chart.json').containers[0];
let ToolBoxCharts = (props) => {
	return (
		<div>
			<h3>Charts</h3>
			<hr/>
			<ToolBoxItem imgUrl='toolbox/Chart.png' container={chartCon} addFce={props.add}/>
		</div>
	)
}
const tabs = ['Core','Texts', 'Bootstrap', 'Images', 'Shapes', 'Chart','Icons'];
const tabContents = [ToolBoxCore,ToolBoxTexts, ToolBoxBootstrap, ToolBoxImages, ToolBoxShapes, ToolBoxCharts,ToolBoxIcons];

export default class ToolBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {selectedIndex: 0}
	}

	handleClick(ctrl) {
		this.props.addCtrl(ctrl.name);
	}

	add(item) {
		this.props.addCtrl(item.elementName, item);
	}

	render() {

		var currentTab = React.createElement(tabContents[this.state.selectedIndex], {add: this.add.bind(this)});

		return (
			<div>
				<ul className="nav nav-pills nav-stacked toolBox leftNav">
					{tabs.map(function (tabName, i) {
						var active = this.state.selectedIndex === i ? 'active' : null;
						return <li key={'titem' + i} className={active}><a
							onClick={(e)=>{this.setState({selectedIndex:i})}}>{tabName}</a></li>
					}, this)}
				</ul>
				<div>
					{currentTab}
				</div>
			</div>
		);
	}
};

