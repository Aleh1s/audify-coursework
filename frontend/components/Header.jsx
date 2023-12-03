import {Avatar, GridItem, Heading, HStack} from "@chakra-ui/react";

const Header = () => {
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
                >
                    Audify
                </Heading>
                <Avatar/>
            </HStack>
        </GridItem>
    )
}

export default Header