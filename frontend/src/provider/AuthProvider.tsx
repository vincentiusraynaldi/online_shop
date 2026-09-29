import { createContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToast, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import invariant from 'tiny-invariant';
import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';

import { useEffect } from "react";

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    isGoogle: boolean;
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


//todo need to brainstorm bcs the register data is the same with edit user data
export type EditUserData = {
    firstName: string;
    lastName: string;
    email: string;
}

export type changePasswordData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export type changeEmailData = {
    newEmail: string;
    currentPassword: string;
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
        // getProfile: () => void;
        editProfile: (data: EditUserData) => void;
        changePassword: (data: changePasswordData) => void;
        changeEmail: (data: changeEmailData) => void;
        deleteAccount: () => void;
    }
}

const AuthContext = createContext<AuthContext | null>(null)

export type AuthProviderProps = {
    children: React.ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useLocalStorage<User | null>("user", null);
    const [token, setToken] = useLocalStorage<string | null>("token", null);
    // const [ searchParams, setSearchParams ] = useSearchParams();
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

    useEffect(() => {
    console.log("user updated:", user);
}, [user]);

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
            setToken(data.token);
            console.log("token: ", token);
            // setUser(JSON.parse(atob(data.accessToken.split(".")[1])));
            setUser(data.user);
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
                description: "False credential",
                status: "error",
                duration: 9000,
                isClosable: true });
        }
        // console.log("data :", data);
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
            setToken(data.token);
            // setUser(JSON.parse(atob(data.accessToken.split(".")[1])));
            setUser(data.user);
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
    
    // const getProfile = async () => {
    //     const res = await fetch("http://localhost:4000/users/profile", {
    //         method: "GET",  // Changed from POST
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${token}`  // Add your bearer token
    //         }
    //     });

    //     // const data
    // }

    // const editProfile = async (values: EditUserData) => {
    //     const res = await fetch("http://localhost:4000/users/editprofile",{
    //         method: "PUT",
    //         headers: {
    //             "content-type": "application/json",
    //             "Authorization": `Bearer ${token}`
    //         },
    //         body: JSON.stringify(values)
    //     })

    //     // const resBody = res.json;
    //     if (res.status === 200){
    //         toast({
    //             title: "Edit account profile",
    //             description: "Successfully edit user profile",
    //             status: "success",
    //             duration: 9000,
    //             isClosable: true,
    //         })
    //     } else {
    //         toast({
    //             title: "Error",
    //             description: "Edit profile failed",
    //             status: "error",
    //             duration: 9000,
    //             isClosable: true,
    //         });
    //     }
    // }

    const editProfile = async (values: EditUserData) => {
        const res = await fetch("http://localhost:4000/users/editprofile",{
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(values)
        })
 
        const resBody = await res.json();
 
        if (res.status === 200){
            // keep local user state in sync so the UI reflects the change immediately
            setUser((prev : User) => prev ? { ...prev, ...resBody } : resBody);
            toast({
                title: "Edit account profile",
                description: "Successfully edit user profile",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            return { success: true as const };
        } else {
            toast({
                title: "Error",
                description: "Edit profile failed",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return { success: false as const, message: resBody?.message ?? "Edit profile failed" };
        }
    }

    // const changePassword = async (values: changePasswordData) => {
    //     const res = await fetch("http://localhost:4000/users/password",{
    //         method: "PUT",
    //         headers: {
    //             "content-type": "application/json",
    //             "Authorization": `Bearer ${token}`
    //         },
    //         body: JSON.stringify(values)
    //     })

    //     if(res.status == 200){
    //         toast({
    //             title: "Change Password",
    //             description: "Successfully change user password",
    //             status: "success",
    //             duration: 9000,
    //             isClosable: true,
    //         })
    //     }else{
    //         toast({
    //             title: "Error",
    //             description: "Change password failed",
    //             status: "error",
    //             duration: 9000,
    //             isClosable: true,
    //         });
    //     }
    // }

    const changePassword = async (values: changePasswordData) => {
        const res = await fetch("http://localhost:4000/users/password",{
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(values)
        })
 
        const resBody = await res.json();
 
        if(res.status == 200){
            toast({
                title: "Change Password",
                description: "Successfully change user password",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            return { success: true as const };
        }else{
            toast({
                title: "Error",
                description: "Change password failed",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return { success: false as const, message: resBody?.message ?? "Change password failed" };
        }
    }

    // const changeEmail = async (values: changeEmailData) => {
    //     const res = await fetch("http://localhost:4000/users/email",{
    //         method: "PUT",
    //         headers: {
    //             "content-type": "application/json",
    //             "Authorization": `Bearer ${token}`
    //         },
    //         body: JSON.stringify(values)
    //     })

    //     if(res.status == 200){
    //         toast({
    //             title: "Change Email",
    //             description: "Successfully change email",
    //             status: "success",
    //             duration: 9000,
    //             isClosable: true,
    //         })
    //     }else{
    //         toast({
    //             title: "Error",
    //             description: "Change email failed",
    //             status: "error",
    //             duration: 9000,
    //             isClosable: true,
    //         });
    //     }
    // }

    const changeEmail = async (values: changeEmailData) => {
        const res = await fetch("http://localhost:4000/users/email",{
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(values)
        })
 
        const resBody = await res.json();
 
        if(res.status == 200){
            setUser((prev: User) => prev ? { ...prev, email: values.newEmail } : prev);
            toast({
                title: "Change Email",
                description: "Successfully change email",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            return { success: true as const };
        }else{
            toast({
                title: "Error",
                description: "Change email failed",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return { success: false as const, message: resBody?.message ?? "Change email failed" };
        }
    }

    const deleteAccount = async () => {
        const res = await fetch("http://localhost:4000/users/delete", {
            method: "DELETE",  // Changed from POST
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  // Add your bearer token
            }
        });

        setToken(null);
        setUser(null);

        if(res.status == 200){
            toast({
                title: "Delete Account",
                description: "Successfully delete user",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
        }else{
            toast({
                title: "Error",
                description: "Delete Account failed",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
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
                    logout,
                    // getProfile,
                    editProfile,
                    changePassword,
                    changeEmail,
                    deleteAccount
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