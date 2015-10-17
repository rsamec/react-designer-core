var falcorExpress = require('falcor-express');
var Router = require('falcor-router');
var _ = require('lodash');

var express = require('express');
var app = express();


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
app.use('/model.json', falcorExpress.dataSourceRoute(function (req, res) {
    // create a Virtual JSON resource with single key ("greeting")
    return new Router([
        {
            // match a request for the key "greeting"
            route: "greeting",
            // respond with a PathValue with the value of "Hello World."
            get: function() {
                console.log("hello world");
                return {path:["greeting"], value: "Hello World"};
            }
        },
        {
            // match a request for the key "greeting"
            route: 'names[{integers:nameIndexes}]["name"]',
            // respond with a PathValue with the value of "Hello World."
            get: function(pathSet) {
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