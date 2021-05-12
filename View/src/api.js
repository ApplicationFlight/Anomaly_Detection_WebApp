import axios from 'axios';
//import {APIRootPath} from '@anomaly_detection_web_app/config';

const root_path = 'http://localhost:9876/';

export type Anomaly = {
  timestep: number,
  feature1: string,
  feature2: string
}

export type ApiClient = {
    postData: () => Promise<Anomaly[]>;
}

export const createApiClient = (): ApiClient => {
    return {
        postData: (train_object, anomaly_object, algorithm) => {
          let url = root_path+'detect/?model_type='+algorithm
          let object = {object: [train_object, anomaly_object]}
          return axios.post(url, object).then((res) => res.data);
        }
    }
}
