'use strict';

var fs = require('fs');
var path = require('path');

var express = require('express');
var app = express();

var compress = require('compression');
var express = require('express');
var exphbs  = require('express-handlebars');
var parseString = require('xml2js').parseString;

require("node-jsx").install({
  harmony: true,
  extension: ".jsx"
});

var React = require('react'),
    TvApp = React.createFactory(require('./client/components/TvApp/TvApp.jsx'));


var hbs = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        json: function (context) { return JSON.stringify(context); }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.get('/', function(req, res) {

    function sortByOrder(arrayToSort) {
        arrayToSort.sort(function(a, b) {
            if (a.order < b.order) {
                return -1;
            }
            return 1;
        });
    }

    var dataProcessor = (function() {

        function getDateObj(ukDate) {
            var splitDate = ukDate.split('/');
            return new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
        }

        function getHoursAndMinutes(timeStr) {
            return {
                hours: parseInt(timeStr.substring(0, 2), 10),
                minutes: parseInt(timeStr.substring(2, 4), 10)
            };
        }

        function addIntegerTimes(data) {

            var currentDate = getDateObj(data.channel.$.date);
            data.channel.programme.forEach(function(programme) {
                var startTime = new Date(currentDate);
                var startTimeHoursAndMinutes = getHoursAndMinutes(programme.start[0]);

                startTime.setHours(startTimeHoursAndMinutes.hours);
                startTime.setMinutes(startTimeHoursAndMinutes.minutes);

                var endTime = new Date(currentDate);
                var endTimeHoursAndMinutes = getHoursAndMinutes(programme.end[0]);
                endTime.setHours(endTimeHoursAndMinutes.hours);
                endTime.setMinutes(endTimeHoursAndMinutes.minutes);

                if (endTime.getHours() <= 6) {
                    endTime.setDate(endTime.getDate() + 1);
                }

                programme.timings = {
                    start: startTime,
                    end: endTime
                }

                var durationMilliseconds = endTime.getTime() - startTime.getTime();
                programme.duration = Math.round(durationMilliseconds / 60000);
            });
        }

        function processData(data) {
            addIntegerTimes(data);
            return data;
        }

        return {
            processData: processData
        }

    })();

    fs.readFile('Views/Home/home.html', 'utf-8', function(error, viewSource){

        var channelData = {
            channels: []
        };

        var filesToRead = [
            {name: 'BBC1', fileLocation: 'Data/BBC1.xml', order: 0},
            {name: 'BBC2', fileLocation: 'Data/BBC2.xml', order: 1},
            {name: 'Channel 4', fileLocation: 'Data/Channel4.xml', order: 2},
            {name: 'Channel 5', fileLocation: 'Data/Channel5.xml', order: 3},
            {name: 'CBBC', fileLocation: 'Data/CBBC.xml', order: 4},
        ];
        var promisesToWaitFor = [];

        filesToRead.forEach(function(file) {

            var readingFile = new Promise(function(resolve, reject) {
                fs.readFile(file.fileLocation, function(error, rawXML) {

                    var xmlPromise = parseString(rawXML, function(err, result) {

                        channelData.channels.push({name: file.name, data: dataProcessor.processData(result), order: file.order});
                        resolve('Promise resolved.');

                    });


                });
            });
            promisesToWaitFor.push(readingFile);
        });

        Promise.all(promisesToWaitFor).then(function() {

            sortByOrder(channelData.channels, 'order');

            var reactHtml = React.renderToString(TvApp({time: new Date(), channelData: channelData}));
            res.render('home', {reactHtml: reactHtml, channelData: channelData});
        });


    });

});

// app.use(compress());
// app.use(layouts);
app.use('/client', express.static(path.join(process.cwd(), '/client')));
//
// app.disable('x-powered-by');

var env = {
  production: process.env.NODE_ENV === 'production'
};

if (env.production) {
  Object.assign(env, {
    assets: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'assets.json')))
  });
}

// app.get('/*', function(req, res) {
//   res.render('index', {
//     env: env
//   });
// });

var port = Number(process.env.PORT || 3001);
app.listen(port, function () {
  console.log('server running at localhost:3001, go refresh and see magic');
});

if (env.production === false) {
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');

  var webpackDevConfig = require('./webpack.config.development');

  new WebpackDevServer(webpack(webpackDevConfig), {
    publicPath: '/client/',
    contentBase: './client/',
    inline: true,
    hot: true,
    stats: false,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Headers': 'X-Requested-With'
    }
  }).listen(3000, 'localhost', function (err) {
    if (err) {
      console.log(err);
    }

    console.log('webpack dev server listening on localhost:3000');
  });
}
