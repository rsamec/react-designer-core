import React from 'react';
import _ from 'lodash';
import PropertyEditor from 'react-property-editor';

import ComponentMetaData from '../util/ComponentMetaData.js';
import clearObject from '../util/clearObject.js';
//import WidgetStyleEditor  from '../editors/WidgetStyleEditor';

//PropertyEditor.registerType('widgetStyleEditor',WidgetStyleEditor);
var boxEmptyStyle = ComponentMetaData["BoxStyle"].metaData;
var containerEmptyStyle = ComponentMetaData["ContainerStyle"].metaData;

export default class ObjectPropertyGrid extends React.Component
{
    widgetPropsChanged(updatedValue) {
        var current = this.props.current.node;
        var updated = current.set("props", updatedValue);
        this.props.currentChanged(updated);
    }
    commonPropsChanged(updatedValue){
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
        var metaData = isContainer? ComponentMetaData[elementName].metaData:this.props.widgets[elementName].metaData;

        //props
        var props = _.merge(clearObject(metaData.props),currentNode.toJS().props);
        var settings = metaData && metaData.settings || {};

        var commonProps = { name:currentNode.name};
        if (elementName !== "ObjectSchema") commonProps["style"] = _.merge(_.cloneDeep(isContainer?containerEmptyStyle.props:boxEmptyStyle.props),currentNode.style);


        return (
            <div>
                <PropertyEditor value={commonProps} onChange={ this.commonPropsChanged.bind(this) } />
                <PropertyEditor value={props} settings={settings}
                                onChange={ this.widgetPropsChanged.bind(this) }/>
            </div>
        );
    }
};
