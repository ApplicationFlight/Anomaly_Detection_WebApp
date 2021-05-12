const util = require('../model/anomaly_util')
const simple_anomaly = require('./SimpleAnomalyDetector')
const enclosingCircle = require('smallest-enclosing-circle')
let cf = []
var pointVector = []

function learn(file) {
    var atts = Object.keys(file);
    var atts_size = atts.length
    var len = file[Object.keys(file)[0]].length;
    let vals = [];
    for (let i = 0; i < atts_size; i++) {
        for (let j = 0; j < len; j++) {
            vals[i] = [];
        }
    }
    for (var i = 0; i < atts_size; i++) {
        var x = file[Object.keys(file)[i]]
        for (var j = 0; j < len; j++) {
            vals[i][j] = x[j]
        }
    }

    for (var i = 0; i < atts_size; i++) {
        var f1 = atts[i];
        var max = 0;
        var jmax = 0;
        for (var j = i + 1; j < atts_size; j++) {
            var p = Math.abs(util.pearson(vals[i], vals[j], len));
            if (p > max) {
                max = p;
                jmax = j;
            }
        }
        var f2 = atts[jmax];
        let ps = toPoints(file[f1], file[f2]);
        learnHelper(file, max, f1, f2, ps);
    }
}

function toPoints(x, y) {
    var ps = []
    for (var i = 0; i < x.length; i++) {
        var p = { x: x[i], y: y[i] };
        ps[i] = p;
    }
    return ps;
}

function learnHelper(file, p, f1, f2, ps) {
    cf = simple_anomaly.learnHelper(file, p, f1, f2, ps);
    var len = file[Object.keys(file)[0]].length - 1
    if (p > 0.5 && p < 0.9) {
        var R = []
        var cl = enclosingCircle(ps)
        var t = cl.r * 1.1;
        var c = {
            feature1: f1,
            feature2: f2,
            correlation: p,
            cx: cl.x,
            cy: cl.y,
            threshold: t
        };
        cf.push(c);
    }
}

function detect(anomaly_file) {
    console.log("DETECT ANOMALIES")
    let anomaly_report = [];
    var size = cf.length;
    var i = 0;
    for (i; i < size; i++) {
        var x = anomaly_file[cf[i].feature1]
        var y = anomaly_file[cf[i].feature2]
        var len = x.length - 1

        var j = 0;
        for (j; j < len; j++) {
            var c = cf[i]

            var anomchek = Boolean(isAnomalous(x[j], y[j], c))
            if (anomchek === true) {
                console.log("anomaly detected")
                var d = c.feature1 + "-" + c.feature2;
                var ano = { description: d, time_step: j + 1 }
                console.log(JSON.parse(JSON.stringify(ano)))
                anomaly_report.push(ano);
            }
        }
    }
    console.log("ANOMALY REPORT:")
    console.log(JSON.parse(JSON.stringify(anomaly_report)))
    return anomaly_report;
}

function isAnomalous(x, y, c) {
    var regCheck = false
    var circleCheck = false
    var p1 = { x: c.cx, y: c.cy };
    var p2 = { x: x, y: y };
    if (c.correlation >= 0.9) {
        console.log("FOUND CF")
        regCheck = Boolean(simple_anomaly.isAnomalous(x, y, c))
        console.log("regcheck " + regCheck)
    } else {
        if (c.correlation > 0.5) {
            var d = dist(p1, p2)
            if (d > c.threshold) {
                circleCheck = true
            }

        }
    }
    console.log("circlecheck " + circleCheck)
    return regCheck || circleCheck
}

function dist(a, b) {
    var x2 = (a.x - b.x) * (a.x - b.x);
    var y2 = (a.y - b.y) * (a.y - b.y);
    return Math.sqrt(x2 + y2);
}

module.exports.learn = learn
module.exports.detect = detect
