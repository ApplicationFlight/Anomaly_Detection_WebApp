const RegressionDetector = require('../model/SimpleAnomalyDetector')
const HybridDetector = require('../model/HybridAnomalyDetector')



function get_anomalies(train_file, anomaly_file, algorithm) {

    if (algorithm === 'regression') {
        threshold = 0.9
        RegressionDetector.learn(train_file)
        RegressionDetector.detect(anomaly_file)

    } else { 
        console.log('this is hybrid algo')
        HybridDetector.learn(train_file)
        HybridDetector.detect(anomaly_file)
    }
    return
}

module.exports.get_anomalies = get_anomalies
