import {Box, Flex, Heading, Stack, Text} from '@chakra-ui/react'
import SignInForm from "./SignInForm.jsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";

const SignIn = () => {

    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/')
        }
    }, [])

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={'gray.800'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} color={'white'}>Sign in to your account</Heading>
                    <Text fontSize={'lg'} color={'white'}>
                        to enjoy all of our cool <Text color={'blue.400'}>features</Text> ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={'gray.600'}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <SignInForm/>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}

export default SignIn