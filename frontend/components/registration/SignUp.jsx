import {Flex, Heading, Stack, Text, useColorModeValue,} from '@chakra-ui/react'
import SignUpForm from "./SignUpForm.jsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";

const SignUp = () => {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/")
        }
    })

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={'gray.800'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'} color={'white'}>
                        Sign up
                    </Heading>
                    <Text fontSize={'lg'} color={'white'}>
                        to enjoy all of our cool features ✌️
                    </Text>
                </Stack>
                <SignUpForm/>
            </Stack>
        </Flex>
    )
}

export default SignUp