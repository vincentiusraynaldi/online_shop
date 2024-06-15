import { useAuth, RegisterData } from "../provider/AuthProvider";
import { Formik, Form } from "formik";
import { InputControl } from "formik-chakra-ui";
import { Button, VStack, Heading, Grid } from "@chakra-ui/react";
import * as Yup from "yup";
import { AuthCard } from "../components/AuthCard";

const registerSchema = Yup.object({
    firstName: Yup.string().required(),
    lastName: Yup.string().required("Last name is required"),
    password: Yup.string().required(),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), ''], "Passwords must match").required(),
    email: Yup.string().email().required(),
})

export function RegisterPage() {
    const {
      actions: { register }
    } = useAuth();

    return (
        <Grid
        height="100vh"
        backgroundAttachment={"fixed"}
        backgroundPosition={"center"}
        backgroundSize={"cover"}
        backgroundRepeat={"no-repeat"}
        margin={0}
        backgroundImage={"url(/hda_gebaude.jpg)"}
        >
            <AuthCard>   
                <Formik<RegisterData>
                    validationSchema={registerSchema}
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                    }}
                    onSubmit={ register }
                    >

                    <VStack spacing={4} align="stretch" as={Form}>
                        <Heading>Register</Heading>
                        <InputControl name={"firstName"} label={"First Name"} />
                        <InputControl name={"lastName"} label={"Last Name"} />
                        <InputControl name={"email"} label={"email"} />
                        <InputControl name={"password"} label={"password"} inputProps={{ type: "password"}}/>
                        <InputControl name={"confirmPassword"} label={"confirm password"} inputProps={{ type: "password"}}/>
                        <Button type="submit">Register</Button>
                    </VStack>
                </Formik>
            </AuthCard>
        </Grid>
        )
}

export default RegisterPage;
