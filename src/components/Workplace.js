var React = require('react');
import PropTypes from 'prop-types';
import _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {CSSTranshand} from 'transhand';
import Container from './../workplace/Container';

import backgroundStyle from '../util/backgroundStyle';

const DEFAULT_TRANSFORM = {
    tx: 0, ty: 0,     //translate in px
    sx: 1, sy: 1,     //scale
    rz: 0,            //rotation in radian
    ox: 0.5, oy: 0.5 //transform origin
};

const DEFAULT_ROOT_PATH = 'path';

class Workplace extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {};
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
		var transform = _.merge(_.merge(_.clone(DEFAULT_TRANSFORM), style.transform), change);
		

		var updated = currentNode.set('style', _.extend(_.clone(style), {'transform': transform}));
		this.props.currentChanged(updated);
	}

	
	currentChanged(node,path,domEl) {
		if (this.props.currentChanged !== undefined) this.props.currentChanged(node,path);
		this.setState({
			currentDOMNode: domEl
		});
	}

	render() {
		
		const {schema,current,currentChanged, dataContext} = this.props;
		
		var handleClick = function () {
			if (currentChanged !== undefined) currentChanged(schema,DEFAULT_ROOT_PATH);
		};

		

		var style = current.node && current.node.style || {};
		var transform = _.merge(_.clone(DEFAULT_TRANSFORM), style.transform);

		var ctx = (schema.props && schema.props.context) || {};
		var customStyles = ctx['styles'] || {};
		var code = ctx['code'] && ctx['code'].compiled;
		var customCode = !!code ? eval(code) : undefined;
		
		//append shared code to data context
		if (dataContext !== undefined) dataContext.customCode = customCode;
		
		var context = {
			styles: customStyles,
			customCode: customCode
		};

		
		var bg = (schema.props && schema.props.background) || {};
		var bgStyle = backgroundStyle(bg);
		
		bgStyle.position = 'absolute';
		bgStyle.width = '100%';
		bgStyle.height = '100%';
		bgStyle.zIndex = -1;

		var component =
			<Container
				containers={schema.containers}
				boxes={schema.boxes}
				currentChanged={this.currentChanged.bind(this)}
				current={current}
				path={DEFAULT_ROOT_PATH}
				handleClick={handleClick}
				isRoot={true}
				node={schema}
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
Workplace.childContextTypes = {snapGrid: PropTypes.arrayOf(PropTypes.number)};
export default DragDropContext(HTML5Backend)(Workplace);
