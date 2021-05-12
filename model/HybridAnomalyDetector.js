const util = require('../model/anomaly_util')
const simple_anomaly = require('./SimpleAnomalyDetector')
const enclosingCircle = require('smallest-enclosing-circle')
let cf = []
let cf_simple = []

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

function learnHelperSimple(train_file, p, f1, f2, ps) {
    if (p > 0.9) {
        var len = train_file[Object.keys(train_file)[0]].length - 1;
        var line = util.linear_reg(ps, len);
        var t = simple_anomaly.findThreshold(ps, len, line) * 1.1;
        var c = { feature1: f1, feature2: f2, correlation: p, lin_reg: line, threshold: t };
        cf_simple.push(c);
    }
    return cf_simple;
}

function learnHelper(file, p, f1, f2, ps) {
    cf = learnHelperSimple(file, p, f1, f2, ps);
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
            radius: cl.r,
            threshold: t
        };
        cf.push(c);
    }
}

function detect(anomaly_file) {
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
              if (c.correlation >= 0.9) {
                var ano = { reason: 'Linear Regression', timestep: j + 1, feature1: c.feature1, feature2: c.feature2, description:'y = '+c.lin_reg.a.toFixed(2)+'x + '+c.lin_reg.b.toFixed(2) }
                anomaly_report.push(ano);
              } else {
                var ano = { reason: 'Minimum Enclosing Circle ', timestep: j + 1, feature1: c.feature1, feature2: c.feature2, descirption:'Radius =  '+c.radius }
                anomaly_report.push(ano);
              }
            }
        }
    }
    cf = []
    cf_simple = []
    return anomaly_report;
}

function isAnomalous(x, y, c) {
    var regCheck = false
    var circleCheck = false
    var p1 = { x: c.cx, y: c.cy };
    var p2 = { x: x, y: y };
    if (c.correlation >= 0.9) {
        regCheck = Boolean(simple_anomaly.isAnomalous(x, y, c))
    } else {
        if (c.correlation > 0.5) {
            var d = dist(p1, p2)
            if (d > c.threshold) {
                circleCheck = true
            }

        }
    }
    return regCheck || circleCheck
}

function dist(a, b) {
    var x2 = (a.x - b.x) * (a.x - b.x);
    var y2 = (a.y - b.y) * (a.y - b.y);
    return Math.sqrt(x2 + y2);
}

module.exports.learn = learn
module.exports.detect = detect
