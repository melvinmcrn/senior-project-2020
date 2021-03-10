import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://asia-southeast2-poc-innovation-iot.cloudfunctions.net",
  timeout: 10000,
});

export default httpClient;
