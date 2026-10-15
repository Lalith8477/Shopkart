import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    useEffect(() => {

        axiosInstance.get("/customers/me")
            .then((response) => {
                setUser(response.data.customerProfile);
            })
            .catch(() => {
                setUser(null)
            });

    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);