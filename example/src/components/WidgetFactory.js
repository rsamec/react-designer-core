var _ = require('lodash');

var Core = require('react-designer-widgets');
var Shapes = require('react-shapes');
var Chart = require('react-pathjs-chart');

//external widgets with more controls
var ReactBootstrap = require('react-bootstrap');
//var ChartistGraph = require('react-chartist');

var Widgets = {

    'Core.TextBoxInput': Core.TextBoxInput,
    'Core.CheckBoxInput': Core.CheckBoxInput,
    'Core.SelectBoxInput': Core.SelectBoxInput,
    'Core.JSXBox': Core.JSXBox,
    'Core.TextBox': Core.TextBox,
    'Core.ValueBox': Core.ValueBox,
    'Core.HtmlBox': Core.HtmlBox,
    'Core.ImageBox': Core.ImageBox,
    'Core.ImagePanel': Core.ImagePanel,
    'Core.ImageCarousel': Core.ImageCarousel,
    'Core.Flipper': Core.Flipper,
    'Core.TangleNumberText': Core.TangleNumberText,
    'Core.TangleBoolText': Core.TangleBoolText,
    'Core.PivotTable':Core.Pivot,


    'Shapes.Rectangle': Shapes.Rectangle,
    'Shapes.Ellipse': Shapes.Ellipse,
    'Shapes.Circle': Shapes.Circle,
    'Shapes.Line': Shapes.Line,
    'Shapes.Polyline': Shapes.Polyline,
    'Shapes.CornerBox': Shapes.CornerBox,
    'Shapes.Triangle':Shapes.Triangle,
    'Shapes.Dimension':Shapes.Dimension,

    'Chart.Pie': Chart.Pie,
    'Chart.Bar': Chart.Bar,
    'Chart.SmoothLine': Chart.SmoothLine,
    'Chart.StockLine': Chart.StockLine,
    'Chart.Scatterplot': Chart.Scatterplot,
    'Chart.Radar': Chart.Radar,
    'Chart.Tree': Chart.Tree,

    //'ChartistGraph':require('../widgets/ChartistGraph'),
    //
    'react-griddle':require('griddle-react'),
    'react-inlinesvg':require('react-inlinesvg'),
    //'react-3d-carousel':require('react-3d-carousel'),
    //'MovieSelect': require('react-movie-select')


    //'SnapSvgBox':require('../widgets/SnapSvgBox')
    //'Reacticon':require('../../../node_modules/reacticons/src/scripts/components/reacticon')
};

var bootstrapWidgets = ['Input', 'Button', 'Panel', 'Glyphicon', 'Tooltip', 'Alert', 'Label'];
_.each(bootstrapWidgets, function (widgetName) {
    var name = 'react-bootstrap.' + widgetName;
    Widgets[name] = ReactBootstrap[widgetName];
});

var bootstrapSettings = {
    fields:{
        //content:{type:'string'},
        bsSize:{type:'select',settings: {
            options: _.map(['large','medium','small','xsmall'], function (key, value) {
                return {value: key, label: key};
            })
        }},
        bsStyle:{type:'select',settings: {
            options: _.map(['default','primary','success','info','warning','danger','link'], function (key, value) {
                return {value: key, label: key};
            })
        }}
    }
};

_.extend(Widgets['react-bootstrap.Button'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});
_.extend(Widgets['react-bootstrap.Label'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Panel'], {
    metaData: {
        props: {
            header:"Header",bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Glyphicon'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', glyph: 'star'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Alert'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Well'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Input'], {
    metaData: {
        props: {
            type: 'text',placeholder:'type your text', label:'label', help:'',value:''
        },
        settings:bootstrapSettings
    }
});
_.extend(Widgets['react-griddle'], {
    metaData: {
        props: {
            results: undefined,
            columns:undefined,
            columnMetadata:undefined,
            noDataMessage:undefined,
            resultsPerPage:undefined,
            showSettings:false,
            showFilter:false,
            showPager:true,
            showTableHeading:true

        },
        settings: {
            fields:{
                //content:{type:'string'},
                results:{type:'bindingEditor'},
                showSettings:{type:'boolean'},
                showFilter:{type:'boolean'},
                showTableHeading:{type:'boolean'},
                showPager:{type:'boolean'},
                columnMetadata:{type:'plainJsonEditor'},
                columns:{type:'jsonEditor'},
                resultsPerPage:{type:'number'}

            }
        }
    }
});

_.extend(Widgets['react-inlinesvg'], {
    metaData: {
        props: {
            src: undefined
        },
        settings: {
            fields:{}
        }
    }
});

//_.each(['FormattedDate', 'FormattedTime', 'FormattedRelative', 'FormattedNumber', 'FormattedMessage', 'FormattedHTMLMessage'], function (name) {
//    Widgets['react-intl.' + name] = ReactIntl[name];
//});
//
//_.extend(Widgets['react-intl.FormattedNumber'], {
//    metaData: {
//        props: {
//            value: {},
//            format: undefined
//        },
//        settings:{
//            value:{type:'bindingValueEditor'}
//        }
//    }
//});

//return {
//    'ObjectSchema':[{name:'name'},{name:'data',editor:JsonEditor},{name:'businessRules',editor:JsonEditor},{name:'title'},{name:'input',editor:BoolEditor }, {name:'intlData', editor:JsonEditor}],
//    'Container':commonPropsSizes.concat([bindEditorFce('Visibility'), {name: 'startOnNewPage', editor:BoolEditor},{name: 'unbreakable', editor:BoolEditor}]),
//    'Repeater':commonPropsSizes.concat([bindEditorFce('Binding')], {name: 'startOnNewPage', editor:BoolEditor},{name: 'unbreakable', editor:BoolEditor}),
//    'react-pivot':commonProps.concat([bindEditorFce('rows'),bindEditorFce('dimensions'),{name:'reduce',editor: codeMirrorEditor},{name:'calculations',editor: codeMirrorEditor},{name:'nPaginateRows',editor: numEditor,args:{defaultValue:10}}]),
//    'MovieSelect':commonProps.concat([{name:'apiKey'},{name:'searchText'},numEditorFce('maxCount',10),bindEditorFce('selectedItems',true)]),
//    'ReactIntl.FormattedNumber':formattedProps,
//    'ReactIntl.FormattedDate':formattedProps,
//    'ReactIntl.FormattedTime':formattedProps,
//    'ReactIntl.FormattedRelative':formattedProps,
//    'ReactIntl.FormattedMessage':commonProps.concat([bindEditorFce('message')]),
//    'ReactIntl.FormattedHTMLMessage':commonProps.concat([bindEditorFce('message')]),
//}
//


module.exports = Widgets;
