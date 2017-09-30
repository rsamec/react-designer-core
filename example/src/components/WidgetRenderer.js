import React from 'react';
import _ from 'lodash';

export default (properties) => {

    let {node,widget,selected, current, currentChanged} = properties;
    if (widget === undefined) return React.DOM.span(null, 'Component ' + node.elementName + ' is not register among widgets.');

    var props = node.props || {};

    //propaget specific additional properties for inline editor
    var isInlineEdit = selected && node.elementName === 'Core.RichTextContent';
    if (isInlineEdit) props = _.extend(props,{designer:true,current:current,currentChanged:currentChanged,node:node});

    return  React.createElement(widget,props,props.content !== undefined ? React.createElement("div",{ dangerouslySetInnerHTML: {__html: props.content } }) : null);

};
