var falcorExpress = require('falcor-express');
var Router = require('falcor-router');
var falcor = require('falcor');
var _ = require('lodash');

var express = require('express');
var app = express();

var request = require('request');
var Converter = require('csvtojson').Converter;
var csvToJson = new Converter({constructResult:true,delimiter:';'});
var normalize = require('normalize-object');
var removeDiacritics = require('diacritics').remove;

var counter = 0;
var yearInvoices = {
    invoicesById: {},
    invoices: [],
    suppliersById:{},
    suppliers:[]
};
var groupKey = 'kodPartnera';
var idKey = 'cisloFaktury';

csvToJson.on("record_parsed",function(input){
    input  = normalize( _.object(_.map(input,function(val,key){return [removeDiacritics(key),val]})),'camel');
    //if (counter === 0) console.log(input);
    counter++;
    var keyValue =input[idKey];
    yearInvoices.invoicesById[keyValue] = input;
    yearInvoices.invoices.push({$type: "ref", value: ['invoicesById', keyValue]});
});
var mfcrDataSource;
csvToJson.on("end_parsed",function(jsonArray){
    //console.log(JSON.stringify(cache,null,2));
    //console.log(mfcr.invoices);
    var newB = _(yearInvoices.invoicesById)
        .groupBy(groupKey)
        .map(function(b) {return b.reduce(sumInvoices, {groupBy:b[0][groupKey], qt:0, price:0,invoices:[]})})
        .sortBy(function(c){return -1* c.price})
        .take(50)
        .map(function(item){ return item})
        .valueOf();

    //console.log(newB);
    _.each(newB,function(item){
        //console.log(item);
        var keyValue =item['groupBy'];
        yearInvoices.suppliersById[keyValue] = item;
        yearInvoices.suppliers.push({$type: "ref", value: ['suppliersById', keyValue]});
    });

    //cache.invoices.push({$type: "ref", value: ['invoicesById', keyValue]});
    //mfcr.summary.year2015 = newB;
    //console.log(JSON.stringify(yearInvoices.suppliersById, null, 2));
//    mfcr.invoices = jsonArray;
    mfcrDataSource = new falcor.Model({cache:yearInvoices}).asDataSource();
    console.log("DONE");
});

function sumInvoices(p, c) {
    var result = _.extend(p, {qt:1 + p.qt, price:parseInt(c['castka'].toString().replace(',','.'),10) + p.price});
    result.invoices.push( {$type: "ref", value: ['invoicesById', c[idKey]]});
    return result
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

    //res.setEncoding('utf8');
    // Pass to next layer of middleware
    next();
});
var fieldKeys = ['dodavatel'];
//app.use('/mfcr.json', falcorExpress.dataSourceRoute(function (req, res) {
//    //res.header("Content-Type", "application/json; charset=utf-8");
//    res.set({ 'content-type': 'application/json; charset=utf-8' });
//    // create a Virtual JSON resource with single key ("greeting")
//    return new Router([
//        {
//            // match a request for the key "greeting"
//            route: "summary.year2015.length",
//            // respond with a PathValue with the value of "Hello World."
//            get: function() {
//                return {
//                    path: ['summary', 'year2015','length'],
//                    value: 5//mfcr.summary.year2015.length
//                }
//            }
//        },
//        {
//            // match a request for the key "greeting"
//            route: 'summary.year2015[{integers:nameIndexes}][{keys:fields}]',
//
//            // respond with a PathValue with the value of "Hello World."
//            get: function(pathSet) {
//                var results = [];
//                _.map(pathSet.nameIndexes,function(nameIndex) {
//                    if (mfcr.summary.year2015.length > nameIndex) {
//                        _.map(pathSet.fields,function(field) {
//                            results.push({
//                                path: ['summary','year2015', nameIndex, field],
//                                value: mfcr.summary.year2015[nameIndex][field]
//                            })
//                        });
//                    };
//                });
//                console.log(results);
//                return results
//            }
//        },
//        {
//            // match a request for the key "greeting"
//            route: "invoices.length",
//            // respond with a PathValue with the value of "Hello World."
//            get: function() {
//                return {
//                    path: ['invoices', 'length'],
//                    value: 20 //mfcr.invoices.length
//                }
//            }
//        },
//        {
//            // match a request for the key "greeting"
//            route: 'invoices[{integers:nameIndexes}][{keys:fields}]',
//
//            // respond with a PathValue with the value of "Hello World."
//            get: function(pathSet) {
//                var results = [];
//                _.map(pathSet.nameIndexes,function(nameIndex) {
//                    if (mfcr.invoices.length > nameIndex) {
//                        _.map(pathSet.fields,function(field) {
//                            console.log(mfcr.invoices[nameIndex]);
//                            results.push({
//                                path: ['invoices', nameIndex, field],
//                                value: mfcr.invoices[nameIndex][field]
//                            })
//                        });
//                    };
//                });
//
//                return results
//            }
//        }
//    ]);
//}));

//console.log(JSON.stringify(yearInvoices.invoicesById,null,2));
app.use('/mfcr.json',falcorExpress.dataSourceRoute(function (req, res) {
    return mfcrDataSource;
}));


var dataSource =
    new falcor.Model({
        cache: {
            todos: [
                { $type: "ref", value: ['todosById', 1450000365] },
                { $type: "ref", value: ['todosById', 54] },
                { $type: "ref", value: ['todosById', 97] },
                { $type: "ref", value: ['todosById', 197] }
            ],
            todosById: {
                "1450000365": {
                    name: 'get milk from corner store',
                    done: false,
                    prerequisites: [
                        { $type: "ref", value: ['todosById', 54] },
                        { $type: "ref", value: ['todosById', 97] }
                    ]
                },
                "54": {
                    name: 'withdraw money from ATM',
                    done: false,
                    prerequisites: [
                        { $type: "ref", value: ['todosById', 97] }
                    ]
                },
                "97": { name: 'pick car up from shop', done: false },
                "197": { name: 'clean up car', done: false },
            }
        }
    }).asDataSource();

app.use('/tasks.json',falcorExpress.dataSourceRoute(function (req, res) {
    return dataSource;
}));

// serve static files from current directory
app.use(express.static(__dirname + '/'));


var port = 3000;
var server = app.listen(port, function(){
    console.log('%s: Node server started on %s:%d ...',
        Date(Date.now() ), 'localhost', port);
});