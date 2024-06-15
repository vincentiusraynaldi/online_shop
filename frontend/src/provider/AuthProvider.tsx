import { createContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToast, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import invariant from 'tiny-invariant';
import axios from "axios";
import React from "react";

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
        register: (data: RegisterData) => void;
    }
}

const AuthContext = createContext<AuthContext | null>(null)

export type AuthProviderProps = {
    children: React.ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useLocalStorage<User | null>("user", null);
    const [token, setToken] = useLocalStorage<string | null>("token", null);
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
        const res = await axios.post('', {
            email: values.email,
            password: values.password
        }, {
        headers: { "Content-Type": "application/json"}
        });
        const data = await res.data;
        console.log(data);
    }

    // const register = async (values: RegisterData) => {
    //     const res = await axios.post('http://localhost:4000/users/register',{
    //         email: values.email,
    //         password: values.password,
    //         firstName: values.firstName,
    //         lastName: values.lastName
    //     }, {
    //         headers: { "Content-Type": "application/json"}
    //     })
    //     const data = await res.data;
    //     console.log(data);
    // }

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


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoggedIn :!!user,
                actions:{
                    login,
                    register
                }
            }}
            >
                {children}
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