const util = require('../model/anomaly_util')
let correlatedFeatures = []

function findThreshold(ps, len, rl) {
    max = 0;
    for (var i = 0; i < len; i++) {
        var f = rl.a * ps[i].x + rl.b
        var d = Math.abs(ps[i].y - f);
        if (d > max)
            max = d;
    }
    return max;
}

function learnHelper(train_file, p, f1, f2, ps) {
    if (p > 0.9) {
        var len = train_file[Object.keys(train_file)[0]].length - 1;
        var line = util.linear_reg(ps, len);
        var t = findThreshold(ps, len, line) * 1.1; // 10% increase
        var c = { feature1: f1, feature2: f2, correlation: p, lin_reg: line, threshold: t };
        correlatedFeatures.push(c);
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

function learn(train_file) {
    var atts = Object.keys(train_file);
    var atts_size = atts.length
    var len = train_file[Object.keys(train_file)[0]].length;
    let vals = [];
    for (let i = 0; i < atts_size; i++) {
        for (let j = 0; j < len; j++) {
            vals[i] = [];
        }
    }
    for (var i = 0; i < atts_size; i++) {
        var x = train_file[Object.keys(train_file)[i]]
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
        let ps = toPoints(train_file[f1], train_file[f2]);
        learnHelper(train_file, max, f1, f2, ps);
    }
}


function detect(anomaly_file) {
    let anomaly_report = [];
    var size = correlatedFeatures.length;
    var i = 0;
    for (i; i < size; i++) {
        var x = anomaly_file[correlatedFeatures[i].feature1]
        var y = anomaly_file[correlatedFeatures[i].feature2]
        var len = x.length - 1
        var j = 0;
        for (j; j < len; j++) {
            var c = correlatedFeatures[i]
            if (isAnomalous(x[j], y[j], c)) {
                var ano = { reason: 'Linear Regression', timestep: j + 1, feature1: c.feature1, feature2: c.feature2, description:'y = '+c.lin_reg.a.toFixed(2)+'x + '+c.lin_reg.b.toFixed(2) }
                anomaly_report.push(ano);
            }
        }
    }
    correlatedFeatures = []
    return anomaly_report;
}

function isAnomalous(x, y, c) {
    var f = (c.lin_reg.a * x) + c.lin_reg.b
    return Boolean(Math.abs(y - f) > c.threshold);
}

module.exports.learn = learn
module.exports.detect = detect
module.exports.isAnomalous = isAnomalous
module.exports.findThreshold = findThreshold
