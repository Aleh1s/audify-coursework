import {Box, Button, Link, Stack} from "@chakra-ui/react";
import {Form, Formik} from "formik";
import {register} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";
import {MyInput} from "../shared/Inputs.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";

const SignUpForm = () => {

    const {loginUsingToken} = useAuth();
    const navigate = useNavigate()

    return (
        <Box
            rounded={'lg'}
            bg={'gray.600'}
            boxShadow={'lg'}
            p={8}
            w={'400px'}
            color={'white'}
        >
            <Formik
                validateOnMount={true}
                initialValues={{
                    name: '',
                    email: '',
                    password: '',
                }}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .required()
                        .min(2, 'Must be at least 2 characters')
                        .max(255, 'Must be 255 characters or less'),
                    email: Yup.string()
                        .required('Email is required')
                        .email('Invalid email address'),
                    password: Yup.string()
                        .required('Password is required')
                        .min(8, 'Password must be at least 8 characters')
                        .max(64, 'Password must not exceed 64 characters')
                        .matches(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]+$/,
                            'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!, @, #, $, %, ^, &)'
                        ),
                })}
                onSubmit={(user, {setSubmitting}) => {
                    setSubmitting(true)
                    register(user).then((res) => {
                        const token = res.headers['authorization']
                        loginUsingToken(token).then(() => {
                            navigate("/")
                            successNotification(
                                "SignUp Success",
                                `${user.name} was registered`
                            )
                        })
                    }).catch(err => {
                        console.log(err)
                        errorNotification(
                            err.code,
                            err.response?.data?.message
                        )
                    }).finally(() => {
                        setSubmitting(false)
                    })
                }}
            >
                {({isValid, isSubmitting}) => (
                    <Form>
                        <Stack spacing={4}>
                            <MyInput
                                label="Name"
                                name="name"
                                type="text"
                                placeholder="Jane"
                            />

                            <MyInput
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="jane@formik.com"
                            />

                            <MyInput
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="********"
                            />

                            <Button
                                type={"submit"}
                                isDisabled={!isValid || isSubmitting}
                            >
                                Sign up
                            </Button>
                            <Link href={'/login'} color={'blue.500'}>
                                Have an account?
                            </Link>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}

export default SignUpForm