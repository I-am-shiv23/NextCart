import React from "react";
import { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userInfo");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const login = (userData)=>{
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
    };  
    const logout = () =>{
        setUser(null);
        localStorage.removeItem("userInfo");
    };
    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
