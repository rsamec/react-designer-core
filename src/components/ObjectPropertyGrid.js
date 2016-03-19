import React from 'react';
import _ from 'lodash';
import PropertyEditor from 'react-property-editor';
import toEmptyProps from '../util/toEmptyProps';

const BOX_EMPTY_STYLE = {
	top: undefined,
	left: undefined,
	width: undefined,
	height: undefined,
	zIndex: undefined,
	transform: {
		tx: undefined, ty: undefined,     //translate in px
		sx: undefined, sy: undefined,     //scale
		rz: undefined,            //rotation in radian
		ox: undefined, oy: undefined //transform origin
	}
};

const CONTAINER_EMPTY_STYLE = {
	top: undefined,
	left: undefined,
	width: undefined,
	height: undefined,
	position: 'relative'
};
const EMPTY_BINDING_PROPS ={
	path:undefined,
	mode:undefined,
	converter:undefined,
	converterArgs:undefined
};

let COMPONENT_METADATA = {
	ObjectSchema: {
		metaData: {
			settings: {
				fields: {
					defaultData: {type: 'plainJsonEditor'},
					background: {type:'bgEditor'},
					defaultPageSize: {type: 'select', settings: {options: ['A4','A3','A2','A5','A6','Tabloid','Letter']}},
					doublePage:{type:'boolean'},
					context: {
						fields:{
							intlData: {type: 'plainJsonEditor'},
							styles:{type:'widgetStyleEditor'},
							code:{type:'codeEditor'}
						}
					},
					
				}
			}
		}
	},
	Container:{
		metaData: {
			settings: {
				fields: {
					visibility: {type: 'boolean'},
					startOnNewPage: {type: 'boolean'},
					unbreakable: {type: 'boolean'}

				}
			}
		}
	},
	Repeater:{
		metaData: {
			settings: {
				fields: {
					binding: {type: 'array'},
					startOnNewPage: {type: 'boolean'},
					unbreakable: {type: 'boolean'}
				}
			}
		}
	}
};



export default class ObjectPropertyGrid extends React.Component
{
    widgetPropsChanged(updatedValue) {
		var current = this.props.current.node;
		var updated = current.set({"props": updatedValue.props, "bindings":updatedValue.binding});
        this.props.currentChanged(updated);
    }
    commonPropsChanged(updatedValue){
		updatedValue = updatedValue.props;
        var current = this.props.current.node;
        var updated;
        if (current.name !== updatedValue.name){
            updated = current.set("name", updatedValue.name);
        }
        else{
            updated = current.set("style", updatedValue.style);
        }
        this.props.currentChanged(updated);
    }
    render() {
        var currentNode = this.props.current.node;
        var elementName = currentNode.elementName;

        var isContainer = (elementName === "Container" || elementName === "Repeater" || elementName === "ObjectSchema");
		
        var metaData = isContainer? COMPONENT_METADATA[elementName].metaData:this.props.widgets[elementName] && this.props.widgets[elementName].metaData;
		
		if ( elementName === "ObjectSchema") metaData.settings.fields["context"].fields["styles"].settings = {widgets :this.props.widgets};
		//only to remove freezer js -> thats is needed for react-json to refresh state when changing instance nodes
		//TODO: better solution for comunication between this component and react-json
		var plainNode = currentNode.toJS();
		
		//bindings
		var bindings = _.reduce(plainNode.bindings,function(memo, item, key){
			if (item!==undefined) memo[key] = _.extend(_.clone(EMPTY_BINDING_PROPS),item);
			return memo; 
		},{});
		
        //props
        var settings = _.extend(metaData && metaData.settings || {},{useBinding:true});
		var props = _.merge(toEmptyProps(settings),plainNode.props);

        var commonProps = { name:currentNode.name};
        if (elementName !== "ObjectSchema") commonProps["style"] = _.merge(_.cloneDeep(isContainer?CONTAINER_EMPTY_STYLE:BOX_EMPTY_STYLE),currentNode.style);

        return (
            <div>
                <PropertyEditor value={{props:commonProps,binding:bindings}} onChange={ this.commonPropsChanged.bind(this) } />
                <PropertyEditor value={{props:props,binding:bindings}} settings={settings}
                                onChange={ this.widgetPropsChanged.bind(this) }/>
            </div>
        );
    }
};
