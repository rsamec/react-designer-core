import React from 'react';
import Binder from 'react-binding';
import _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {CSSTranshand} from 'transhand';
import Container from './../workplace/Container';
import backgroundStyle from '../util/backgroundStyle';
import RichTextEditor from '../workplace/RichTextEditor';

var defaultTransform = {
    tx: 0, ty: 0,     //translate in px
    sx: 1, sy: 1,     //scale
    rz: 0,            //rotation in radian
    ox: 0.5, oy: 0.5 //transform origin
};

class Workplace extends React.Component {
	constructor(props) {
		super(props);
		this.state = {data: _.cloneDeep(this.props.schema.props.defaultData) || {}};
	}
	getChildContext() {
		return {snapGrid: this.props.snapGrid};
	}
	handleChange(change) {
		var currentNode = this.props.current.node;
		if (currentNode == undefined) return;

		var style = currentNode.style;
		if (style === undefined) return;

		//resolution strategy -> defaultTransform -> style.transform -> change
		var transform = _.merge(_.merge(_.clone(defaultTransform), style.transform), change);

		//apply to current DOM node
		//this.state.currentNode.style.transform = this.generateCssTransform(transform);
		//this.state.currentNode.style.transformOrigin = `${transform.ox*100}% ${transform.oy*100}%`;

		var updated = currentNode.set('style', _.extend(_.clone(style), {'transform': transform}));
		this.props.currentChanged(updated);
	}

	componentWillReceiveProps(newProps) {
		var defaultData = this.props.schema.props && this.props.schema.props.defaultData;
		var newDefautData = newProps.schema.props && newProps.schema.props.defaultData;

		if (defaultData !== newDefautData) {
			this.setState({data: _.cloneDeep(newDefautData)});
		}
	}

	currentChanged(node, domEl) {
		this.setState({currentDOMNode: domEl});
		if (this.props.currentChanged !== undefined) this.props.currentChanged(node);
	}

	render() {
		var handleClick = function () {
			if (this.props.currentChanged !== undefined) this.props.currentChanged(this.props.schema);
		}.bind(this);

		var dataContext = Binder.bindToState(this, 'data');

		var style = this.props.current.node.style || {};
		var transform = _.merge(_.clone(defaultTransform), style.transform);

		var ctx = (this.props.schema.props && this.props.schema.props.context) || {};
		var customStyles = ctx['styles'] || {};
		var code = ctx['code'] && ctx['code'].code;
		var customCode = !!code ? new Function(code)() : undefined;
		
		//append shared code to data context
		dataContext.customCode = customCode;
		
		var context = {
			styles: customStyles,
			customCode: customCode
		};

		
		var bg = (this.props.schema.props && this.props.schema.props.background) || {};
		var bgStyle = backgroundStyle(bg);
		
		bgStyle.position = 'absolute';
		bgStyle.width = '100%';
		bgStyle.height = '100%';
		bgStyle.zIndex = -1;

		var component =
			<Container
				containers={this.props.schema.containers}
				boxes={this.props.schema.boxes}
				currentChanged={this.currentChanged.bind(this)}
				current={this.props.current}
				handleClick={handleClick}
				isRoot={true}
				node={this.props.schema}
				dataBinder={dataContext}
				ctx={context}
				widgets={this.props.widgets}
				widgetRenderer={this.props.widgetRenderer}
			/>;

		return ( <div className="cWorkplace">
			<div style={bgStyle}></div>
			{component}
			{this.state.currentDOMNode !== undefined ?
				<CSSTranshand transform={transform} deTarget={this.state.currentDOMNode}
							  onChange={this.handleChange.bind(this)}/> : null}
			
		</div>);
	}
};
Workplace.childContextTypes = {snapGrid: React.PropTypes.arrayOf(React.PropTypes.number)};
export default DragDropContext(HTML5Backend)(Workplace);
