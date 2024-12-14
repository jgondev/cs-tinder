import axios, { AxiosRequestConfig, AxiosStatic } from 'axios';
import { Identity } from '../types';

//axios.defaults.baseURL = 'https://cstinder-api.fly.dev/api';
axios.defaults.baseURL = 'http://localhost:8080/api';

export class BaseApiService {
    public axios: AxiosStatic = axios;

    headers = () => {
        return {
            'x-access-token': (JSON.parse(localStorage.getItem('id') ?? '{}') as Identity).token,
            'Content-Type': 'application/json'
        }
    }

    async post<T>(uri: string, body?: any): Promise<T> {
        return axios.post<ISingleResult<T>>(uri, body, { headers: this.headers() })
            .then((response) => {
                return response?.data?.result;
            });
    }

    async getSingle<T>(uri: string): Promise<T> {
        return axios.get<ISingleResult<T>>(uri, { headers: this.headers() }).then((response) => {
            return response.data.result;
        });
    }

    async getMany<T>(uri: string, query?: any): Promise<T[]> {
        return axios.get<IListResult<T>>(uri, { params: query, headers: this.headers() } as AxiosRequestConfig<any>).then((response) => {
            return response.data.result;
        });
    }

    async put<T>(uri: string, body?: any): Promise<T> {
        return axios.put<ISingleResult<T>>(uri, body, { headers: this.headers() }).then((response) => {
            return response.data.result;
        });
    }

    async putMany<T>(uri: string, body?: any): Promise<T[]> {
        return axios.post<IListResult<T>>(uri, body, { headers: this.headers() }).then((response) => {
            return response.data.result;
        });
    }

    async delete<T>(uri: string): Promise<T> {
        return axios.delete(uri, { headers: this.headers() })
            .then((response) => {
                return response.data.result;
            });
    }
}

export interface IListResult<T> {
    result: T[];
}

export interface ISingleResult<T> {
    result: T;
}

export default new BaseApiService();
