import axios from "axios";

const user = localStorage.getItem('userData');

//for local devlopment --> http://localhost:3000

export const registerloginapi = axios.create({
    baseURL: "https://taskninja-6nvm.onrender.com",
    headers:{
        "Content-Type":'application/json'
    }
})

export const api = axios.create({
    baseURL: "https://taskninja-6nvm.onrender.com",
    headers: {
        "Content-Type": 'application/json',
        Authorization: `Bearer ${user ? JSON.parse(user).token : ''}`
    }
});