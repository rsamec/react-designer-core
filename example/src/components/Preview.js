import React from 'react';
import BindToMixin from 'react-binding';
import _ from 'lodash';
import falcor from 'falcor';
import falcorDataSource from 'falcor-http-datasource';


import {HtmlPagesRenderer,BootstrapPublisher,BindingUtil} from 'react-page-renderer';

var iterate = function (current,fce) {
    var children = current.containers;

    //iterate through containers
    var containers = [];
    for (var i = 0, len = children.length; i < len; i++) {
        fce.apply(this,[children[i]]);
        iterate(children[i],fce);
    }
};
var Preview = React.createClass({
    mixins: [BindToMixin],
    getInitialState:function() {

        var dataSources = _.reduce(this.props.schema.props.dataSources,function(memo,value,key){
            memo[key] = new falcor.Model({source: new falcorDataSource(value)});
            return memo;
        },{});
        return {data:_.extend({dataSources:dataSources}, _.cloneDeep(this.props.schema.props.defaultData))};
    },
    bindToRepeater(schema,dataSources){

        const CONTAINER_NAME = "Container";
        const REPEATER_CONTAINER_NAME = "Repeater";


        var dataBinder = this.bindToState('data');
        if (dataBinder === undefined) return;

        if (dataSources == undefined) return;

        var self = this;

        //step -> set repeatable sections (containers) -
        iterate(schema,function (x) {
            if (!!x && x.elementName === REPEATER_CONTAINER_NAME) {
                var bindingProps = x.props && x.props.binding;


                var binding = self.bindTo(dataBinder, bindingProps.path);


                var pos = bindingProps.path.indexOf('.');
                if (pos === -1) return;

                //grab pathes
                var modelPath = bindingProps.path.substr(0, pos);
                var falcorPath = bindingProps.path.substr(pos + 1);

                if (dataSources[modelPath] === undefined) return;
                //var rangeFromPath = getArrayRange(falcorPath);
                //if (rangeFromPath === undefined) {

                if (falcorPath.indexOf('[') === -1){
                    dataSources[modelPath].getValue(falcorPath + '.length').then(function (response) {
                        //console.log(falcorPath + " = " + response);
                        if (response !== undefined) binding.value = new Array(response);
                    });
                }

            }
        });
    },
    componentDidMount(){
        this.bindToRepeater(this.props.schema,this.state.data.dataSources)
    },
    //
    //	const CONTAINER_NAME = "Container";
    //	const REPEATER_CONTAINER_NAME = "Repeater";
    //
    //
    //	var dataBinder = this.bindToState('data');
    //	if (dataBinder === undefined) return;
    //	var dataSources = this.bindTo(dataBinder, "dataSources").value;
    //	if (dataSources == undefined) return;
    //
    //	var self = this;
    //
    //	//step -> set repeatable sections (containers) -
    //	traverse(this.props.schema).forEach(function (x) {
    //		if (!!x && x.elementName === REPEATER_CONTAINER_NAME) {
    //			var bindingProps = x.props && x.props.binding;
    //
    //
    //			var binding = self.bindTo(dataBinder, bindingProps.path);
    //
    //
    //			var pos = bindingProps.path.indexOf('.');
    //			if (pos === -1) return;
    //
    //			//grab pathes
    //			var modelPath = bindingProps.path.substr(0, pos);
    //			var falcorPath = bindingProps.path.substr(pos + 1);
    //
    //			if (dataSources[modelPath] === undefined) return;
    //			//var rangeFromPath =getArrayRange(falcorPath);
    //			//if (rangeFromPath=== undefined) {
    //            if (falcorPath.indexOf('[') === -1){
    //				dataSources[modelPath].getValue(falcorPath + '.length').then(function (response) {
    //					binding.value = new Array(response);
    //				});
    //			}
    //
    //		}
    //	});
    //},
    render: function () {
        var schema = BindingUtil.bindToSchema(_.cloneDeep(this.props.schema),this.state.data); //_.cloneDeep(this.props.schema);
        var dataContext = this.bindToState('data');

        if (schema.input) {
            var rules = schema.businessRules || {};
            var style = {height: '90vh', width: '90vw'};

            return (
                <div style={style}>
                    <BootstrapPublisher widgets={this.props.widgets} schema={schema} rules={rules}
                                        dataContext={dataContext}/>
                </div>
            )
        }
        else {
            return (
                <div>
                    <HtmlPagesRenderer widgets={this.props.widgets} schema={schema} data={this.state.data}
                                       intlData={schema.intlData} dataContext={dataContext}/>
                </div>
            );
        }
    }
});

export default Preview;
