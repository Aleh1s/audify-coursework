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
import {blockUser, unblockUser} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";
import {useState} from "react";

const UserItem = ({user, fetchUser}) => {

    const {onOpen: onBlockUserModalOpen, isOpen: isBlockUserModalOpen, onClose: onBlockUserModalClose} = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)

    const doBlockUser = () => {
        setIsLoading(true)
        blockUser(user.email).then(() => {
            fetchUser()
            onBlockUserModalClose()
            successNotification(
                "Success",
                `User with email ${user.email} blocked`
            )
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response?.data?.message
            )
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const doUnblockUser = () => {
        setIsLoading(true)
        unblockUser(user.email).then(() => {
            fetchUser()
            successNotification(
                "Success",
                `User with email ${user.email} unblocked`
            )
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response?.data?.message
            )
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <>
            <Modal isOpen={isBlockUserModalOpen} onClose={onBlockUserModalClose}>
                <ModalOverlay/>
                <ModalContent bg={'gray.700'} color={'white'}>
                    <ModalHeader>Block user</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Text>You sure you want to block user with email {user.email}?</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={onBlockUserModalClose}>
                            Cancel
                        </Button>
                        <Button colorScheme={'red'} onClick={doBlockUser}>
                            Block
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Grid
                templateRows={'min-content)'}
                templateColumns={'1fr 1fr 1fr 1fr'}
                w={'100%'}
                alignItems={'center'}
                gap={'0 15px'}
                borderRadius={'5px'}
                _hover={{bg: '#4A5568'}}
                transition={'background-color 0.2s ease-in-out'}
                p={'10px'}
            >
                <GridItem>
                    <Heading size={'md'}>{user.name}</Heading>
                    <Text color={'gray.400'} textAlign={'start'}>{user.email}</Text>
                </GridItem>

                <GridItem>
                    <Text textAlign={'center'}>{user.isBlocked ? 'Blocked' : 'Non blocked'}</Text>
                </GridItem>

                <GridItem>
                    <Text textAlign={'center'}>{user.authProvider}</Text>
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
                            <Button
                                isDisabled={isLoading}
                                onClick={user.isBlocked ? doUnblockUser : onBlockUserModalOpen}
                                colorScheme={user.isBlocked ? 'green' : 'red'}
                            >
                                {user.isBlocked ? <UnlockIcon/> : <LockIcon/>}
                            </Button>
                        </Tag>
                    </HStack>
                </GridItem>
            </Grid>
        </>

    )
}


export default UserItem