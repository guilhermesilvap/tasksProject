import axios from "axios";

export const api = axios.create({
    baseURL: "https://mytasks-api.onrender.com"
})