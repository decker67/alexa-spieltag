'use strict';

var Alexa = require('alexa-sdk');
var http = require('http');
var cheerio = require('cheerio');


var APP_ID = 'amzn1.ask.skill.44a2854c-09d5-4dc1-b223-71b82737201b';

var languageStrings = {
    'de-DE': {
        'translation': {
            'SKILL_NAME' : 'Aktuelle Spielergebnisse der Fussballbundesliga',
            'RESULTS_MESSAGE' : 'Die Ergebnisse vom aktuellen Spieltag lauten '
        }
    }
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetResults');
    },
    'GetResults': function () {
        var self = this;
        getResults( function (results) {
            var parsedResults = parseResults(results);
            var speechOutput = self.t('RESULTS_MESSAGE') + parsedResults;
            self.emit(':tellWithCard', speechOutput, self.t('SKILL_NAME'), parsedResults);
        });
    }
};



var requestUrl = 'http://www.bundesliga.de/de/bundesliga/spieltag/';

function getResults(callback) {
    http.get(requestUrl, function(res) {
        var statusCode = res.statusCode;
        var contentType = res.headers['content-type'];

        var error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' + 'Status Code: ${statusCode}');
        }
        if (error) {
            console.log(error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        var rawData = '';
        res.on('data', function(chunk) { rawData += chunk});
        res.on('end', function() { callback(rawData); });
    }).on('error', function(e) {
        console.log('Got error: ${e.message}');
    });
}

function parseResults(results) {
    console.log(results);
    var $ = cheerio.load(results);
    var gameInfoLinks = $('.spieltage');
    console.log(index, link);

    /*gameInfoLinks.each(function(index, link) {
        console.log(index, link);
        $ = cheerio.load(link);
        var time = $('.time')[0];
        var teamnames = $('.teamnames');
        var score = $('.score');
        console.log(time, teamnames, score);
    });*/
    return 'test';
}