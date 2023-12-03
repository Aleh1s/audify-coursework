import {
    Button,
    Grid,
    GridItem,
    Heading,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tag,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import {LockIcon, UnlockIcon} from "@chakra-ui/icons";

const UserItem = ({user}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Grid
            templateRows={'65px'}
            templateColumns={'1fr 1fr 1fr'}
            w={'100%'}
            alignItems={'center'}
            gap={'0 15px'}
            borderRadius={'5px'}
            _hover={{bg: '#4A5568'}}
            transition={'background-color 0.2s ease-in-out'}
            p={'10px'}
        >
            <GridItem>
                <Heading size={'md'}>{user.firstName} {user.lastName}</Heading>
                <Text color={'gray.400'} textAlign={'start'}>{user.email}</Text>
            </GridItem>

            <GridItem>
                <Text textAlign={'center'}>{user.isBlocked ? 'Blocked' : 'Non blocked'}</Text>
            </GridItem>

            <GridItem>
                <HStack justifyContent={'end'}>
                    <Tag
                        w={'20px'}
                        h={'20px'}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        {
                            user.isBlocked
                                ? <UnlockIcon onClick={() => user.isBlocked = false}/>
                                : <>
                                    <LockIcon onClick={onOpen}/>

                                    <Modal isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent bg={'gray.700'} color={'white'}>
                                            <ModalHeader>Block user</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <Text>You sure you want to block user with email: {user.email}?</Text>
                                            </ModalBody>

                                            <ModalFooter>
                                                <Button colorScheme='green' mr={3} onClick={onClose}>
                                                    Close
                                                </Button>
                                                <Button colorScheme={'red'} onClick={() => {
                                                    user.isBlocked = true
                                                    onClose()
                                                }}>Block</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </>
                        }
                    </Tag>
                </HStack>
            </GridItem>
        </Grid>
    )
}

export default UserItem