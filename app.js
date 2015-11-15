var React = require('react');

var HtmlPagesRenderer = require('react-page-renderer').HtmlPagesRenderer;
var BindToMixin = require('react-binding');
var _ = require('lodash');
var falcor = require('falcor');
var falcorDataSource = require('falcor-http-datasource');

//get print widgets
var widgets = require('./example/src/components/WidgetFactory');

var App = React.createClass({
    mixins: [BindToMixin],
    getInitialState: function () {
        return {data: this.props.data || this.props.schema.props.defaultData};

    },
    render: function () {
        var style = {margin: 0, padding: 0};
        var pageOptions = this.props.pageOptions || {};
        pageOptions.border = 'none';
        //var pageOptions = {width:300,height:1000,margin:{top:-31,left:-31,right:31,bottom:31},border:'none'};
        var schema = this.props.schema;
        var data = this.props.data || schema.data;

        var dataContext = this.bindToState('data');


        var url = 'http://react-documets.rhcloud.com/';
        var bootstrapHref = url + "assets/less/custom-bootstrap.css";

        return (React.createElement("html", null,
            React.createElement("head", null,
                React.DOM.link({
                    href: 'https://fonts.googleapis.com/css?family=Courgette|Great+Vibes|Patrick+Hand|Indie+Flower|Lobster|Poiret+One|Press+Start+2P|Open+Sans:400,700,700italic,400italic|Roboto:400,400italic,700,700italic|Lato:400,700italic,400italic,700|Oswald:400,700|Slabo+27px',
                    rel: 'stylesheet',
                    type: 'text/css'
                }),
                React.createElement("title", null, "ReactDoc"),
                React.createElement("meta", {name: "viewport", content: "width=device-width, initial-scale=1"}),
                React.createElement("link", {rel: "stylesheet", href: bootstrapHref})
            ),
            React.createElement("body", {style: style},
                React.createElement("div", {id: "preview"},
                    React.createElement(HtmlPagesRenderer, {
                        widgets: widgets,
                        schema: schema,
                        data: data,
                        dataContext: dataContext,
                        intlData: schema.intlData,
                        errorFlag: false,
                        pageOptions: pageOptions
                    })
                )
            )
        ));
    }
});


module.exports = App;
