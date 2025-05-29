import { createContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToast, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import invariant from 'tiny-invariant';
import React from "react";
import { useSearchParams } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
}

export type LoginData = {
    email: string;
    password: string;
}

export type RegisterData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type AuthContext = {
    user?: User;
    token?: string;
    isLoggedIn: boolean;
    actions: {
        login: (data: LoginData) => void;
        loginWithGoogleOauth: (credential: string) => void;
        register: (data: RegisterData) => void;
        logout: () => void;
    }
}

const AuthContext = createContext<AuthContext | null>(null)

export type AuthProviderProps = {
    children: React.ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useLocalStorage<User | null>("user", null);
    const [token, setToken] = useLocalStorage<string | null>("token", null);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const toast = useToast();
    const navigate = useNavigate();
    const errorToast = (errors: string[]) => {
        toast({
            title: "Error",
            description: 
                (
                    <>
                        {errors?.map((e) => (
                        <Text>{e}</Text>
                        ))}{" "}
                    </>
                ),
            status: "error",
            duration: 9000,
            isClosable: true,
        })
    }

    const login = async (values: LoginData) => {
        //fetch post request using axios
        const res = await fetch ("http://localhost:4000/users/login", {
            method: "POST",
            body: JSON.stringify(values),
            headers: {"content-type": "application/json"}, 
        });
        const data = await res.json();
        if (res.ok) {
            toast({
                title: "Login",
                description: "Successfully logged in",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            setToken(data.accessToken);
            setUser(JSON.parse(atob(data.accessToken.split(".")[1])));
            navigate("/", {replace: true});
        } else if (res.status === 401) {
            toast({
                title: "Error",
                description: "Incorrect password",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } else if (res.status === 400) {
            toast({ 
                title: "Error",
                description: "Email not found",
                status: "error",
                duration: 9000,
                isClosable: true });
        }
        console.log(data);
    }

    // const loginWithGoogleOauth = async () => {
    const loginWithGoogleOauth = async (credential : string) => {
        const res = await fetch("http://localhost:4000/users/google/verify", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({credential}),
        });

        if(res.ok){
            const data = await res.json();
            toast({
                title: "Login",
                description: "Successfully logged in",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            setToken(data.accessToken);
            setUser(JSON.parse(atob(data.accessToken.split(".")[1])));
            navigate("/", {replace: true});
        }else{
            toast({
                title: "Error",
                description: "Login failed",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    const register = async (values: RegisterData) => {
        const res = await fetch("http://localhost:4000/users/register", {
            method: "POST",
            body: JSON.stringify(values),
            headers: {"content-type": "application/json"},  
        });

        const resBody = await res.json();
        if (res.status === 201){
            toast({
                title: "Account created",
                description: "Successfully registered",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            navigate("/home", {replace: true});
        } else if (resBody.errors) {
            errorToast(resBody.errors);
        }
        if (res.status === 400){
            toast({
                title: "Error",
                description: "Email already exists",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    };


    //logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        toast({
            title: "Account logged out",
            description: "Successfully logged out",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoggedIn :!!user,
                actions:{
                    login,
                    loginWithGoogleOauth,
                    register,
                    logout
                }
            }}
            >
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    {children}
                </GoogleOAuthProvider>
            </AuthContext.Provider>        
    )
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if( !context ){
        invariant(context, "useAuth must be used within AuthProvider");
    }
    return context;
}

export default AuthProvider;