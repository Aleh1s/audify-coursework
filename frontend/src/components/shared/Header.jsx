import {Avatar, GridItem, Heading, HStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

const Header = () => {

    const navigate = useNavigate()

    return (
        <GridItem borderRadius={'5px'} px={'20px'} bg={'gray.700'} colSpan={2}>
            <HStack
                h={'100%'}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                <Heading
                    bgGradient={'linear(to-l, white, gray.500)'}
                    bgClip='text'
                    fontSize='4xl'
                    fontWeight='extrabold'
                    cursor={'pointer'}
                    onClick={() => navigate('/')}
                >
                    Audify
                </Heading>
                <Avatar
                    cursor={'pointer'}
                    onClick={() => navigate('/profile')}
                />
            </HStack>
        </GridItem>
    )
}

export default Header