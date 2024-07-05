import * as Yup from 'yup';
import { LoginData, useAuth } from '../provider/AuthProvider';
import { Box, Button, Heading, Link, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { InputControl } from 'formik-chakra-ui';
import { Link as RouterLink } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { GoogleLogin } from '@react-oauth/google';

// TODO: add google oauth

const LoginSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
})

export function LoginPage() {
    const {
        actions: { 
            login,
            loginWithGoogleOauth
         },
    } = useAuth();

    return (
        <Box bg={"gray.200"}>
            <AuthCard>
                <Heading>Login</Heading>
                <VStack>
                    <Formik<LoginData>
                        validationSchema={LoginSchema}
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        onSubmit={login}
                        >
                        <VStack spacing={4} align="stretch" as={Form}>
                            <InputControl name={"email"} label={"email"} />
                            <InputControl name={"password"} label={"password"} inputProps={{ type: "password" }} />
                            <Button type="submit">Login</Button>
                            <Box>
                                <Link as={RouterLink} to="/auth/register">Don't have an account?</Link>
                            </Box>
                        
                        </VStack>
                    </Formik>
                    <GoogleLogin logo_alignment='center'
                            onSuccess={credentialResponse => {
                                console.log(credentialResponse);
                              }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            />;
                </VStack>
            </AuthCard>
        </Box>
        )
}

export default LoginPage;