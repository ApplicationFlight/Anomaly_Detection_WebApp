const express = require('express');
const bodyParser = require('body-parser');
const model = require('../model/SimpleAnomalyDetector')

const serverPATH = '/api/detect'

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.post(serverPATH, (req, res)=> {
  let object = req.body.object;
  let algorithm = req.query.model_type
  console.log(object[0]);
  console.log(object[1]);
  console.log(algorithm);
  console.log(object[0].A);
  var got = model.get_anomalies(object[0], object[1], algorithm)
  console.log()
  var anomaly1 = {
    timestep: 400,
    feature1: 'f1_anomaly1',
    feature2: 'f2_anomaly1'
  };
  var anomaly2 = {
    timestep: 500,
    feature1: 'f1_anomaly2',
    feature2: 'f2_anomaly2'
  };
  var anomaly3 = {
    timestep: 600,
    feature1: 'f1_anomaly3',
    feature2: 'f2_anomaly3'
  };
  var final = [anomaly1, anomaly2, anomaly3];
  console.log(final)
  res.send(final);
})

app.listen(9876);
