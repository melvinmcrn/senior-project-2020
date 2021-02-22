import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://asia-southeast2-poc-innovation-iot.cloudfunctions.net",
  timeout: 2500,
});

export default httpClient;
