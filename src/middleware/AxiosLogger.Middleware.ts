import Logger from '../service/logger/logger.Service';
import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { container } from 'tsyringe';

export const setupAxiosLogger = () => {
    axios.interceptors.request.use(
        (config) => {
            const startRequestAt = Date.now();
            config.headers.startRequestAt = startRequestAt
            return config;
        },
        (error: AxiosError) => {
            console.error('Request error:', error);
            return Promise.reject(error);
        }
    );
    axios.interceptors.response.use(
        (response: AxiosResponse) => {
                const logger = container.resolve(Logger);
                logger.log(
                    response.config.method?.toLocaleUpperCase() ?? '',
                    response?.status ?? 500,
                    '',
                    response.config.url ?? '',
                    response.config.headers ?? {},
                    response.config.data ?? {},
                    response.data ?? {},
                );
                return response;
            },
            (error: AxiosError) => {
                const logger = container.resolve(Logger);
                if (error.response) {
                    logger.log(
                        error.response.config.method?.toLocaleUpperCase() ?? '',
                        error.response?.status ?? 500,
                        '',
                        error.response.config.url ?? '',
                        error.response.config.headers ?? {},
                        error.response.config.data ?? {},
                        error.response.data ?? {},
                    );
                } else {
                    console.log(`API call failed: ${error.message}`);
                }
                return Promise.reject(error);
            }
        );
};

export const customAxiosLogger = (axiosInstance:AxiosInstance) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const startRequestAt = Date.now();
            config.headers.startRequestAt = startRequestAt
            return config;
        },
        (error: AxiosError) => {
            console.error('Request error:', error);
            return Promise.reject(error);
        }
    );
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
                const logger = container.resolve(Logger);
                logger.log(
                    response.config.method?.toLocaleUpperCase() ?? '',
                    response?.status ?? 500,
                    '',
                    response.config.url ?? '',
                    response.config.headers ?? {},
                    response.config.data ?? {},
                    response.data ?? {},
                );
                return response;
            },
            (error: AxiosError) => {
                const logger = container.resolve(Logger);
                if (error.response) {
                    logger.log(
                        error.response.config.method?.toLocaleUpperCase() ?? '',
                        error.response?.status ?? 500,
                        '',
                        error.response.config.url ?? '',
                        error.response.config.headers ?? {},
                        error.response.config.data ?? {},
                        error.response.data ?? {},
                    );
                } else {
                    console.log(`API call failed: ${error.message}`);
                }
                return Promise.reject(error);
            }
        );
};
