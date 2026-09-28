import API_URL from "../api.js";
import userContext from "../context/Context.jsx";
import { useContext } from "react";
export const login = async (username,password) => {
    try{
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message || "Login failed");
        }
        localStorage.setItem("token", data.token);
        return data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const register = async (username,password) =>{
    try{
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message || "Registration failed");
        }
        console.log(data);
        return data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const logout = () =>{
    try{
        localStorage.removeItem("token");

    }
    catch(err){
        console.log(err);
    }
}

export const getMe = async(token) =>{
    try{
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message || "Failed to fetch user data");
        }
        return data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}