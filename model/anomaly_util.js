function avg(x) {
    var u = 0;
    var i = 0;
    var size = x.length;
    for (i; i < size; i++) {
        u = Number(u) + Number(x[i]);
    }
    u = Number(u) / size;
    return u;
}

function variance(x) {
    var varianc = 0;
    var size = x.length;
    var i = 0;
    for (i; i < size; i++) {
        varianc = varianc + Math.pow(x[i], 2);
    }
    varianc = varianc / size;
    var av = avg(x);
    varianc = varianc - Math.pow(av, 2);
    return varianc;
}

function cov(x, y, size) {
    var cov = 0;
    var i = 0;
    var avgX = avg(x, size);
    var avgY = avg(y, size);
    for (i; i < size; i++) {
        cov = cov + (x[i] - avgX) * (y[i] - avgY);
    }
    cov = cov / size;
    return cov;
}

function pearson(x, y, size) {
    return cov(x, y, size) / (Math.sqrt(variance(x, size)) * Math.sqrt(variance(y, size)));
}


function linear_reg(points, size) {
    var x = [];
    var y = [];
    var i = 0;
    for (i; i < size; i++) {
        x[i] = points[i].x;
        y[i] = points[i].y;
    }
    var c = cov(x, y, size)
    var v = variance(x, size)
    var value_a = (c / v) ;
    var avgX = avg(x, size);
    var avgY = avg(y, size);
    var value_b = avgY - (value_a * avgX);
    var line = { a: value_a, b: value_b };
    return line;
}

function dev(p, points, size) {
    var l = linear_reg(points, size);
    return deviation(p, l);
}

function deviation(p, l) {
    var f = (l.x * p.x) + l.y;
    var dist = Math.abs(p.y - f);
    return dist;
}

module.exports.avg = avg
module.exports.variance = variance
module.exports.cov = cov
module.exports.pearson = pearson
module.exports.linear_reg = linear_reg
module.exports.dev = dev
module.exports.deviation = deviation
