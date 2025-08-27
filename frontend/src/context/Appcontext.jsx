import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Appcontext = createContext()

export const Appprovider = ({children}) => {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null)

    // Set axios Authorization header whenever token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
            delete axios.defaults.headers.common['Authorization']
        }
    }, [token])

    const value = {axios, token, setToken}
    return (
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(Appcontext)
}