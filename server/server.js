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
  let anomalies = []
  for (let i = 0; i < 100; i++) {
    var anomaly = {
      timestep: Math.random(),
      feature1: 'check'+i,
      feature2: 'f2_'+i
    }
    anomalies.push(anomaly)
  }

  console.log(anomalies)
  res.send(anomalies);
})

app.listen(9876);
