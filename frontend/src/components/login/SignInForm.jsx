import {Form, Formik} from "formik";
import {Button, Link, Stack} from "@chakra-ui/react";
import {MyInput} from "../shared/Inputs.jsx";
import {errorNotification} from "../../services/notification.js";
import {useAuth} from "../../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import OAuth2ButtonGroup from "../oauth2/OAuth2ButtonGroup.jsx";
import * as Yup from "yup";

const SignInForm = () => {

    const { login } = useAuth()
    const navigate = useNavigate()

    return (
        <Formik
            validateOnMount={true}
            initialValues={{username: '', password: ''}}
            validationSchema={Yup.object({
                username: Yup.string()
                    .required('Email is required')
                    .email('Invalid email address'),
                password: Yup.string()
                    .min(6, 'Must be at least 6 characters')
                    .max(20, 'Must be 20 characters or less')
                    .required('Password is required')
            })}
            onSubmit={(values, {setSubmitting}) => {
                setSubmitting(true)
                login(values).then(() => {
                    navigate('/')
                }).catch(err => {
                    errorNotification(
                        err.code,
                        err.response?.data?.message
                    )
                }).finally(() => {
                    setSubmitting(false)
                })
            }}>

            {({isValid, isSubmitting}) => {
                return (
                    <Form>
                        <Stack spacing={4}>
                            <MyInput
                                label={'Email'}
                                name={'username'}
                                type={'email'}
                                placeholder={'example@example.com'}
                            />
                            <MyInput
                                label={'Password'}
                                name={'password'}
                                type={'password'}
                                placeholder={'********'}
                            />
                            <Button
                                type={'submit'}
                                isDisabled={!isValid || isSubmitting}
                            >
                                Sign in
                            </Button>
                            <Link href={'/registration'} color={'blue.500'}>
                                Have no account?
                            </Link>
                            <OAuth2ButtonGroup/>
                        </Stack>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default SignInForm