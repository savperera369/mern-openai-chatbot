import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { checkAuthStatus, loginUser, logoutUser, signUpUser } from '../helpers/api-communicator';

type User = {
    name: string,
    email: string
}

type UserAuth = {
    isLoggedIn: boolean,
    user: User | null,
    login: (email: string, password: string) => Promise<void>,
    signup: (name: string, email: string, password: string) => Promise<void>,
    logout: () => Promise<void>
}

const AuthContext = createContext<UserAuth | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        // fetch if users cookies are valid and skip login
        async function checkStatus() {
            const data = await checkAuthStatus();
            if (data) {
                setUser({ email: data.email, name: data.name });
                setIsLoggedIn(true);
            }
        }

        checkStatus();
    }, []);

    const login = async (email: string, password: string) => {
        const data = await loginUser(email, password);
        if (data) {
            setUser({ email: data.email, name: data.name });
            setIsLoggedIn(true);
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        const data = await signUpUser(name, email, password);
        if (data) {
            setUser({ email: data.email, name: data.name });
            setIsLoggedIn(true);
        }
    };

    const logout = async () => {
        const data = await logoutUser();
        if (data) {
            setUser(null);
            setIsLoggedIn(false);
            window.location.reload();
        }
    };

    const value = {
        user,
        isLoggedIn,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// create context that should be used by the children, above is just the provider

export const useAuth = () => useContext(AuthContext);