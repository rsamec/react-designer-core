var React = require('react');

var HtmlPagesRenderer = require('react-page-renderer').HtmlPagesRenderer;
var BindToMixin = require('react-binding');

//get print widgets
var widgets = require('./example/src/WidgetFactory');

var App = React.createClass({displayName: "App",
    mixins:[BindToMixin],
    getInitialState:function () {
        return {
            data: this.props.data || this.props.schema.data
        }
    },
    render: function () {
        var style = {margin: 0, padding: 0};
        var pageOptions = {margin:{top:31,bottom:31}};
        var schema = this.props.schema;
        var data = this.props.data || schema.data;

        var dataContext = this.bindToState('data');


        var url = 'http://react-documets.rhcloud.com/';
        var bootstrapHref = url + "assets/less/custom-bootstrap.css";

        return (
            React.createElement("html", null, 
                React.createElement("head", null, 
                    React.createElement("title", null, "ReactDoc"), 
                    React.createElement("meta", {name: "viewport", content: "width=device-width, initial-scale=1"}), 
                    React.createElement("link", {rel: "stylesheet", href: bootstrapHref})
                ), 
                React.createElement("body", {style: style}, 
                    React.createElement("div", {id: "preview"}, 
                        React.createElement(HtmlPagesRenderer, {widgets: widgets, schema: schema, data: data, dataContext:dataContext, intlData:schema.intlData, errorFlag: false, pageOptions: pageOptions})
                    )
                )
            )
        )
    }
});

module.exports = App;
