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
    Stack,
    Tag,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import {LockIcon, UnlockIcon} from "@chakra-ui/icons";
import {blockUser, changePassword, unblockUser} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";
import {useState} from "react";
import * as Yup from "yup";
import {Form, Formik} from "formik";
import {MyInput} from "../shared/Inputs.jsx";

const UserItem = ({user, fetchUser}) => {

    const {onOpen: onBlockUserModalOpen, isOpen: isBlockUserModalOpen, onClose: onBlockUserModalClose} = useDisclosure()
    const {
        onOpen: onChangePasswordModalOpen,
        isOpen: isChangePasswordModalOpen,
        onClose: onChangePasswordModalClose
    } = useDisclosure()
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
                err.response.data.message
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
                err.response.data.message
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
            <Modal isOpen={isChangePasswordModalOpen} onClose={onChangePasswordModalClose}>
                <ModalOverlay/>
                <ModalContent bg={'gray.700'} color={'white'}>
                    <ModalHeader>Change User Password</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Text mb={5}>Write new password for {user.email}</Text>

                        <Formik
                            validateOnMount={true}
                            initialValues={{
                                password: '',
                            }}
                            validationSchema={Yup.object({
                                password: Yup.string()
                                    .required('Password is required')
                                    .min(8, 'Password must be at least 8 characters')
                                    .max(64, 'Password must not exceed 64 characters')
                                    .matches(
                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]+$/,
                                        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!, @, #, $, %, ^, &)'
                                    ),
                            })}
                            onSubmit={(data, {setSubmitting}) => {
                                setSubmitting(true)
                                changePassword(user.email, data.password).then(() => {
                                    onChangePasswordModalClose()
                                    fetchUser()
                                    successNotification(
                                        "Success",
                                        "Password changed"
                                    )
                                }).catch(err => {
                                    console.log(err)
                                    errorNotification(
                                        err.code,
                                        err.response.data.message
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
                                            label="Password"
                                            name="password"
                                            type="password"
                                            placeholder="********"
                                        />

                                        <Button
                                            type={"submit"}
                                            isDisabled={!isValid || isSubmitting}
                                            colorScheme={'green'}
                                        >
                                            Change Password
                                        </Button>
                                    </Stack>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Grid
                templateRows={'min-content)'}
                templateColumns={'1fr 1fr 1fr 1fr 1fr'}
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
                    {
                        <Button
                            isDisabled={user.authProvider !== 'INTERNAL' || isLoading}
                            onClick={onChangePasswordModalOpen}
                        >
                            Change password
                        </Button>
                    }
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