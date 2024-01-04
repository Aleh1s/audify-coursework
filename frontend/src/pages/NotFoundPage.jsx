import {Button, Center, Heading, Text, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

const NotFoundPage = () => {

    const navigate = useNavigate()

    return (
        <Center
            h={'100%'}
            color={'white'}
        >
            <VStack>
                <Heading
                    as={'b'}
                    fontSize={'8xl'}
                >
                    404
                </Heading>
                <Text
                    fontSize={'2xl'}
                >
                    Not Found
                </Text>
                <Text>
                    The page you are looking for does not exist
                </Text>
                <Button
                    colorScheme={'blue'}
                    onClick={() => navigate('/')}
                >
                    Go Home
                </Button>
            </VStack>
        </Center>
    )
}

export default NotFoundPage