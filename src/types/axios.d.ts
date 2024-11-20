// src/types/axios.d.ts
import 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        ignoreLogging?: boolean;
    }
}
