import React from 'react';
import _ from 'lodash';
import BindToMixin from 'react-binding';

var WidgetRenderer = React.createClass({
    mixins:[BindToMixin],
    shouldComponentUpdate(nextProps){
        return this.props.node !== nextProps.node;
    },
    //componentDidMount(){
    //	var box = this.props.node;
    //	var dataBinder = this.props.dataBinder;
    //	if (dataBinder === undefined) return;
    //	var dataSources = this.bindTo(this.props.dataBinder, "dataSources").value;
    //	if (dataSources == undefined) return;
    //
    //	for (var propName in box.props) {
    //		var bindingProps = box.props[propName];
    //
    //		if (!(_.isObject(bindingProps) && !!bindingProps.path)) continue;
    //
    //
    //		//apply binding
    //		//var converter;
    //		//if (!!bindingProps.converter && !!bindingProps.converter.compiled) {
    //		//	converter = eval(bindingProps.converter.compiled);
    //		//}
    //		var binding = this.bindTo(dataBinder, bindingProps.path);
    //
    //
    //		var pos = bindingProps.path.indexOf('.');
    //		if (pos === -1) continue;
    //
    //		//grab pathes
    //		var modelPath = bindingProps.path.substr(0, pos);
    //		var falcorPath = bindingProps.path.substr(pos + 1);
    //
    //		if (dataSources[modelPath] === undefined) continue;
    //
    //	   	dataSources[modelPath].get(falcorPath).then(function(response){
    //			var pathSet =falcorPath.indexOf('..') !== -1;
    //			if (pathSet) {
    //				console.log(binding.path);
    //				console.log(response.json);
    //			}
    //			var val = _.get(response.json,pathSet?falcorPath.substr(0,falcorPath.indexOf('[')):falcorPath);
    //			binding.value =val;//converter!==undefined? converter.format(val):val;
    //		});
    //	}
    //},
    hasBinding(propName){
        //TODO: find better way how to detect binding
        var widget = this.props.widget;
        var field = widget.metaData && widget.metaData.settings && widget.metaData.settings.fields && widget.metaData.settings.fields[propName];
        return field !== undefined && (field.type === 'bindingEditor' || field.type === 'bindingValueEditor');
    },
    applyBinding(box,dataBinder,dataSources){

        var fragments = {};
        //go through all properties
        for (var propName in box) {
            var prop = box[propName];

            var isBinding = this.hasBinding(propName);

            //if binding -> replace binding props
            if (isBinding) {

                if (prop === undefined) continue;

                //bind to const value
                if (prop.value !== undefined) {
                    box[propName] = prop.value;
                    continue;
                }


                var bindingProps = prop; //field.type === 'bindingEditor'?prop:prop.binding;
                if (_.isObject(bindingProps) && !!bindingProps.path) {


                    //apply binding
                    var converter;
                    if (!!prop.converter && !!bindingProps.converter.compiled) {
                        converter = eval(bindingProps.converter.compiled);
                    }
                    var binding = this.bindTo(dataBinder, bindingProps.path, converter,bindingProps.converterArgs);

                    //if (dataSources !==undefined){
                    //    var pos = bindingProps.path.indexOf('.');
                    //    if (pos !== -1) {
                    //
                    //        //grab pathes
                    //        var modelPath = bindingProps.path.substr(0, pos);
                    //        var falcorPath = bindingProps.path.substr(pos + 1);
                    //
                    //        if (dataSources[modelPath] !== undefined) {
                    //            fragments[propName] = function () {
                    //                return dataSources[modelPath].get(falcorPath).then(function(response){
                    //                    var pathSet =falcorPath.indexOf('..') !== -1;
                    //                    var val = _.get(response.json,pathSet?falcorPath.substr(0,falcorPath.indexOf('[')):falcorPath);
                    //                    return converter!==undefined?converter.format(val):val;
                    //                });
                    //            };
                    //            //remove
                    //            delete box[propName];
                    //            continue;
                    //        }
                    //    }
                    //}

                    if (prop.mode === 'TwoWay') {
                        //two-way binding
                        //if (this.props.designer!== true) box.valueLink = this.bindTo(dataBinder, bindingProps.path, converter);
                        box[propName] = undefined;
                    }
                    else {
                        //one-way binding
                        //box[propName] = dataBinder.value[prop.Path];
                        //if (!!dataSources) console.log(dataSources.mfcr && dataSources.mfcr.toJSON());
                        box[propName] = binding.value;

                    }
                }
                else {
                    //binding is not correctly set - do not apply binding
                    box[propName] = undefined;
                }
            }
        }
        return fragments;
    },
    render(){
        const {designer} = this.props;
        var box = this.props.node;
        var widget  = this.props.widget;
        if (widget === undefined) {
            return React.DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');
        }

        var customStyle= this.props.customStyle;

        //apply property resolution strategy -> default style -> custom style -> local style
        var widgetStyle = _.cloneDeep(widget.metaData && widget.metaData.props || {});
        if (customStyle !== undefined) widgetStyle = _.merge(widgetStyle,customStyle);
        var props = _.merge(widgetStyle,box.props);
        if (this.props.customCode !== undefined) props.customCode = this.props.customCode;

        var fragments;
        if (this.props.dataBinder !== undefined) fragments=this.applyBinding(props,this.props.dataBinder,this.bindTo(this.props.dataBinder, "dataSources").value);

        //if (designer !==true && _.keys(fragments).length !==0) widget = Transmit.createContainer(widget,{fragments: fragments});
        return React.createElement(widget, props, props.content !== undefined ? React.DOM.div({dangerouslySetInnerHTML: {__html: props.content}}) : null);


        //return React.createElement(widget, props, props.content !== undefined ? React.DOM.div({dangerouslySetInnerHTML: {__html: props.content}}) : null);

    }
});
export default  WidgetRenderer;
//WidgetRenderer.propTypes = { widget:  React.PropTypes.node, value:React.PropTypes.object,dataBinder:React.PropTypes.object };
