var falcorExpress = require('falcor-express');
var Router = require('falcor-router');
var _ = require('lodash');

var express = require('express');
var app = express();

var request = require('request');
var Converter = require('csvtojson').Converter;
var csvToJson = new Converter({constructResult:true,delimiter:';'});
var normalize = require('normalize-object');

var mfcr = {
    invoices:[],
    summary:{}
};

csvToJson.on("record_parsed",function(input){
    mfcr.invoices.push(normalize(input, 'camel'));
});

csvToJson.on("end_parsed",function(jsonArray){
    //console.log(mfcr.invoices);
    var newB = _(mfcr.invoices)
        .groupBy('dodavatel')
        .map(function(b) {return b.reduce(sumInvoices, {dodavatel:b[0].dodavatel, qt:0, price:0})})
        .sortBy(function(c){return -1* c.price})
        .take(50)
        .map(function(item){ return _.extend(item,{cena:item.price / 1000000})})
        .valueOf();

    mfcr.summary.year2015 = newB;
    console.log(newB);
//    mfcr.invoices = jsonArray;
});

function sumInvoices(p, c) {
    return _.extend(p, {qt:1 + p.qt, price:parseInt(c['částka'].toString().replace(',','.'),10) + p.price});
};



request.get("http://data.mfcr.cz/cs/node/171/download").pipe(csvToJson);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
var data = {
    names: [
        {name: 'Karel'},
        {name: 'Pepa'},
        {name: 'Ondra'},
        {name: 'Tonda'},
        {name: 'Petr'}
    ]
};
var fieldKeys = ['dodavatel'];
app.use('/mfcr.json', falcorExpress.dataSourceRoute(function (req, res) {
    // create a Virtual JSON resource with single key ("greeting")
    return new Router([
        {
            // match a request for the key "greeting"
            route: "summary.year2015.length",
            // respond with a PathValue with the value of "Hello World."
            get: function() {
                return {
                    path: ['summary', 'year2015','length'],
                    value: mfcr.summary.year2015.length
                }
            }
        },
        {
            // match a request for the key "greeting"
            route: 'summary.year2015[{integers:nameIndexes}][{keys:fields}]',

            // respond with a PathValue with the value of "Hello World."
            get: function(pathSet) {
                var results = [];
                _.map(pathSet.nameIndexes,function(nameIndex) {
                    if (mfcr.summary.year2015.length > nameIndex) {
                        _.map(pathSet.fields,function(field) {
                            results.push({
                                path: ['summary','year2015', nameIndex, field],
                                value: mfcr.summary.year2015[nameIndex][field]
                            })
                        });
                    };
                });
                console.log(results);
                return results
            }
        },
        {
            // match a request for the key "greeting"
            route: "invoices.length",
            // respond with a PathValue with the value of "Hello World."
            get: function() {
                return {
                    path: ['invoices', 'length'],
                    value: 20 //mfcr.invoices.length
                }
            }
        },
        {
            // match a request for the key "greeting"
            route: 'invoices[{integers:nameIndexes}][{keys:fields}]',

            // respond with a PathValue with the value of "Hello World."
            get: function(pathSet) {
                var results = [];
                _.map(pathSet.nameIndexes,function(nameIndex) {
                    if (mfcr.invoices.length > nameIndex) {
                        _.map(pathSet.fields,function(field) {
                            results.push({
                                path: ['invoices', nameIndex, field],
                                value: mfcr.invoices[nameIndex][field]
                            })
                        });
                    };
                });

                return results
            }
        }
    ]);
}));
app.use('/model.json', falcorExpress.dataSourceRoute(function (req, res) {
    // create a Virtual JSON resource with single key ("greeting")
    return new Router([
        {
            // match a request for the key "greeting"
            route: "greeting",
            // respond with a PathValue with the value of "Hello World."
            get: function() {
                //console.log("hello world");
                return {path:["greeting"], value: "Hello World"};
            }
        },
        {
            // match a request for the key "greeting"
            route: "names.length",
            // respond with a PathValue with the value of "Hello World."
            get: function() {
                //console.log("names");
                return {
                    path: ['names', 'length'],
                    value: data.names.length
                };
            }
        },
        {
            // match a request for the key "greeting"
            route: 'names[{integers:nameIndexes}]["name"]',

            // respond with a PathValue with the value of "Hello World."
            get: function(pathSet) {
                //console.log("indexed names");
                var results = [];
                _.map(pathSet.nameIndexes,function(nameIndex) {
                    if (data.names.length > nameIndex) {
                        results.push({
                            path: ['names', nameIndex, 'name'],
                            value: data.names[nameIndex].name
                        })
                    }
                })
                return results
            }
        }
    ]);
}));

// serve static files from current directory
app.use(express.static(__dirname + '/'));


var port = 3000;
var server = app.listen(port, function(){
    console.log('%s: Node server started on %s:%d ...',
        Date(Date.now() ), 'localhost', port);
});