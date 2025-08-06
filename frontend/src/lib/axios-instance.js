// create axios instace

import axios from "axios";
import { promise } from "zod";
const BASE_URL = ''
export const api = axios.create({
    baseURL: BASE_URL,
    timeout: '10000',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})

export const unauthenticatedApi = api
unauthenticatedApi.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            return config
        }
        (error) => promise.reject(error)
    }
)
unauthenticatedApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // ToDo add diffrent error responses.

        return Promise.reject(error)
    }
)