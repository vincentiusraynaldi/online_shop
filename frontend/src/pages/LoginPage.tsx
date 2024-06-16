// import * as Yup from "yup";
// import { LoginData, useAuth, isLogInSuccessful } from "../provider/AuthProvider";
// import {
//   Box,
//   Button,
//   Link,
//   VStack,
//   Modal,
//   ModalOverlay,
//   ModalProps,
//   ModalContent,
//   ModalCloseButton,
//   ModalHeader
// } from "@chakra-ui/react";
// import { Form, Formik } from "formik";
// import { InputControl } from "formik-chakra-ui";
// import { Link as RouterLink } from "react-router-dom";
// import { AuthCard } from "../components/AuthCard";

// const LoginSchema = Yup.object({
//   email: Yup.string().email().required(),
//   password: Yup.string().required(),
// });

// export type LoginModalProps = Omit<ModalProps, "children">;

// export const LoginPage = ({ ...restProps }: LoginModalProps) => {
//   const {
//     actions: { login },
//   } = useAuth();

//   const handleSubmit = async (values: LoginData) => {
//     await login(values);

//     if (isLogInSuccessful) {
//       restProps.onClose();
//     } else {
//       console.log("Login unsuccessful.");
//     }
//   };

//   return (
//     <Modal {...restProps}>
//       <ModalOverlay />
//       <ModalContent>
//         <AuthCard>
//           <ModalHeader>Login</ModalHeader>
//           <ModalCloseButton />
//           <Formik<LoginData>
//             validationSchema={LoginSchema}
//             initialValues={{
//               email: "",
//               password: "",
//             }}
//             // onSubmit={login}
//             onSubmit={handleSubmit}
//           >
//             <VStack spacing={4} align="stretch" as={Form}>
//               <InputControl name={"email"} label={"email"} />
//               <InputControl
//                 name={"password"}
//                 label={"password"}
//                 inputProps={{ type: "password" }}
//               />
//               <Button type="submit">Login</Button>
//               <Box>
//                 <Link as={RouterLink} to="/auth/register" onClick={restProps.onClose}>
//                   Don't have an account?
//                 </Link>
//               </Box>
//             </VStack>
//           </Formik>
//         </AuthCard>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default LoginPage;


import * as Yup from 'yup';
import { LoginData, useAuth } from '../provider/AuthProvider';
import { Box, Button, Heading, Link, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { InputControl } from 'formik-chakra-ui';
import { Link as RouterLink } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';


const LoginSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
})

export function LoginPage() {
    const {
        actions: { login },
    } = useAuth();

    return (
        <Box bg={"gray.200"}>
            <AuthCard>
                <Heading>Login</Heading>
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
            </AuthCard>
        </Box>
        )
}

export default LoginPage;