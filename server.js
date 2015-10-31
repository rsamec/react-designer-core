#!/bin/env node
//  OpenShift sample Node application

//only required for react-pivot - becaouse package.json main:index.jsx - requires using node-jsx
require('node-jsx').install({extension: '.jsx'});

var express = require('express');
var fs      = require('fs');

var compression = require('compression');
var path = require('path');
var morgan = require('morgan');

var bodyParser = require('body-parser');

var React = require("react");
var pdf = require('html-pdf');
var Transmit = require('react-transmit');
var BindingUtil = require('react-page-renderer').BindingUtil;

Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
//var areIntlLocalesSupported = require('intl-locales-supported');
//
//var localesMyAppSupports = [
//    'en-US','cz-CS','de-DE'
//];
//
//if (global.Intl) {
//    // Determine if the built-in `Intl` has the locale data we need.
//    if (!areIntlLocalesSupported(localesMyAppSupports)) {
//        // `Intl` exists, but it doesn't have the data we need, so load the
//        // polyfill and replace the constructors with need with the polyfill's.
//        require('intl');
//        Intl.NumberFormat   = IntlPolyfill.NumberFormat;
//        Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
//    }
//} else {
//    // No `Intl`, so use and load the polyfill.
//    global.Intl = require('intl');
//}

var App = require('./app.js');
//var pdfRenderer = require('./lib/pdf-renderer');

/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
        self.dataDir = process.env.OPENSHIFT_DATA_DIR;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
            self.dataDir = path.join(__dirname,"data");
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };


    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();

        self.app = express();
        self.app.use(bodyParser.json());
        self.app.use(function (req, res, next) {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');

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

        //self.app.use(compression);
        self.app.use(morgan('combined'));
        self.app.use(express.static(path.join(__dirname, 'sites')));
        self.app.use('/data', express.static(self.dataDir));
        self.app.use('/assets', express.static('assets'));
        self.app.use('/designer', express.static('designer'));
        self.app.use('/publisher', express.static('publisher'));
        //self.app.use(express.static(path.join(__dirname, 'dist')));


        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }

        self.app.post('/generationjobs', function (req, res) {

            console.log("generation started");
            var pdfDoc = pdfRenderer.transformToPdf(req.body);


            var chunks = [];
            var result;

            pdfDoc.on('data', function (chunk) {
                chunks.push(chunk);
            });
            pdfDoc.on('end', function () {

                result = Buffer.concat(chunks);

                res.contentType('application/pdf');
                res.send(result.toString('base64'));
                console.log(result);
                console.log("generation finished");
            });

            pdfDoc.end();

        });

        self.app.post('/publish', function (req, res) {
            console.log("publish started");

            var schema = req.body.schema;

            var outputFilename = path.join(self.dataDir, 'schemas/' + schema.name + '.json');
            var imageFilename = path.join(self.dataDir, 'images/' + schema.name + '.png');
            var listFilename = path.join(self.dataDir, 'schemas/list.json');

            //0. create dirs if not exists
            var dir = path.join(self.dataDir, 'schemas');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            //1. save schema
            fs.writeFile(outputFilename, JSON.stringify(schema), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.contentType('application/json');
                    res.send({saveLocation: schema.name});
                    console.log("JSON saved to " + outputFilename);
                }
            });

            //2. update list
            fs.readFile(listFilename, 'utf8', function (err, data) {
                if (err) console.log(err);

                var list = err ? [] : JSON.parse(data);
                var findByName = function (arr, name) {
                    for (var i = 0; i != arr.length; i++) {
                        if (arr[i].name === name) return arr[i];
                    }
                };
                var newItem = {
                    name: schema.name,
                    label: schema.title || schema.name,
                    input: schema.input ? true : false
                };


                var item = findByName(list, schema.name);
                if (item !== undefined) {
                    //item.name = newItem.name;
                    item.label = newItem.label;
                    item.input = newItem.input;
                }
                else {
                    list.push(newItem);
                }

                fs.writeFile(listFilename, JSON.stringify(list), function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("JSON saved to " + listFilename);
                    }
                });
            });

            //3. save thumbail
            var savePrintScreen = function (schema, saveLocation) {
                var html = React.renderToStaticMarkup(React.createElement(App, {schema: schema}));
                pdf.create(html).toFile(saveLocation, function (err, resFile) {
                    console.log(resFile.filename);
                });
            }
            try {
                savePrintScreen(schema, imageFilename);
            } catch (e) {
                console.log(e.message);
            }



        });

        self.app.post('/publish/list', function (req, res) {
            console.log("publish list started");

            var list = req.body.list;

            var listFilename = path.join(self.dataDir, 'schemas/list.json');

            //0. create dirs if not exists
            var dir = path.join(self.dataDir, 'schemas');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            fs.writeFile(listFilename, JSON.stringify(list), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send('OK');
                    console.log("JSON saved to " + listFilename);
                }
            });
        });
        self.app.get('/print/:schema', function(req, res) {
            var fileName = path.join(self.dataDir,'schemas/' + req.params.schema + '.json');

            res.format({
                'text/plain': function(){
                    res.send('hey');
                },
                'text/html': function(){
                    fs.readFile(fileName, 'utf8', function (err, data) {
                        if (err) console.log(err);


                        var html = React.renderToStaticMarkup(React.createElement(App,{schema:JSON.parse(data)}));

                        res.send(html);
                    });
                },
                'application/json': function(){
                    fs.readFile(fileName, 'utf8', function (err, data) {
                        if (err) console.log(err);

                        res.contentType("application/json");
                        res.send(JSON.parse(data));
                    });
                },
                'application/pdf': function(){
                    fs.readFile(fileName, 'utf8', function (err, data) {
                        if (err) console.log(err);


                        var html = React.renderToStaticMarkup(React.createElement(App,{schema:JSON.parse(data)}));

                        var options = {  format: 'A4', zoomFactor:1.4 };

                        pdf.create(html,options).toStream(function(err, stream){
                            res.contentType("application/pdf");
                            stream.pipe(res);
                        });
                    });

                },
                'default': function() {
                    // log the request and respond with 406
                    res.status(406).send('Not Acceptable');
                }
            });

        });

        self.app.post('/print/:schema', function(req, res) {
            console.log("print generation started " + req.params.schema);

            var fileName = path.join(self.dataDir,'schemas/' + req.params.schema + '.json');

            fs.readFile(fileName, 'utf8', function (err, data) {
                if (err) console.log(err);

                var html = React.renderToStaticMarkup(React.createElement(App,{schema:JSON.parse(data), data:req.body}));

                var options = {  type:'pdf', format: 'A4', zoomFactor:1.4 };
                pdf.create(html,options).toBuffer(function(err, buffer){
                    res.contentType("application/pdf");
                    res.send(buffer);
                    console.log("print generation finished");
                });
            });
        });

        var generateBinary = function(req,res,type){
            console.log('Generate: ' + type);

            //var html = React.renderToStaticMarkup(React.createElement(App, {schema: req.body}));
            //console.log(html);

            BindingUtil.bindToSchemaAsync(req.body,{}).then(function(response){

                //console.log(JSON.stringify(response,null,2));
                var html = React.renderToStaticMarkup(React.createElement(App, {schema: response}));
                console.log("Generated");

                var options = type === "pdf"?{type:type, format: 'A4', zoomFactor: 1.40}:{type:type,zoomFactor: 1.0};
                pdf.create(html, options).toBuffer(function (err, buffer) {
                    res.contentType(type == 'pdf'?"application/pdf":"image/" + type);
                    res.send(buffer);
                    console.log("print generation finished");
                });
            }, function(error){console.log(error)})
        };

        self.app.post('/pdf', function(req, res) {
           generateBinary(req,res,'pdf');
        });
        self.app.post('/png', function(req, res) {
            generateBinary(req,res,'png');
        });
        self.app.post('/jpeg', function(req, res) {
            generateBinary(req,res,'jpeg');
        });
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

