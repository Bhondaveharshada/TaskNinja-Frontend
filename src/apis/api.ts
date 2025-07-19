import axios from "axios";

const user = localStorage.getItem('userData');

export const registerloginapi = axios.create({
    baseURL: "http://localhost:3000",
    headers:{
        "Content-Type":'application/json'
    }
})

export const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": 'application/json',
        Authorization: `Bearer ${user ? JSON.parse(user).token : ''}`
    }
});