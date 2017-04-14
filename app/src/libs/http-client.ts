import Axios, { AxiosRequestConfig } from 'axios';

namespace HttpClient {
  const axios = Axios.create({});

  export const request = (config: AxiosRequestConfig) => {
    return axios.request(config);
  };

  export const get = (url: string, config?: AxiosRequestConfig) => {
    return axios.get(url, config);
  };

  export const del = (url: string, config?: AxiosRequestConfig) => {
    return axios.delete(url, config);
  };

  export const post = (url: string, data?: any, config?: AxiosRequestConfig) => {
    return axios.post(url, data, config);
  };

  export const put = (url: string, data?: any, config?: AxiosRequestConfig) => {
    return axios.put(url, {data}, config);
  };
}

export default HttpClient;
