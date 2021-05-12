const RegressionDetector = require('../Model/SimpleAnomalyDetector')
const HybridDetector = require('../Model/HybridAnomalyDetector')



function get_anomalies(train_file, anomaly_file, algorithm) {

    if (algorithm === 'regression') {
        threshold = 0.9
        RegressionDetector.learn(train_file)
        return RegressionDetector.detect(anomaly_file)
    } else {
        HybridDetector.learn(train_file)
        return HybridDetector.detect(anomaly_file)
    }
}

module.exports.get_anomalies = get_anomalies
