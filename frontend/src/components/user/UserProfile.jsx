import {useEffect, useState} from "react";
import {errorNotification, successNotification} from "../../services/notification.js";
import {changeMyName, changeMyPassword, getProfile} from "../../services/client.js";
import {
    Avatar,
    Button,
    ButtonGroup,
    Center,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    Grid,
    GridItem, Heading,
    HStack,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Stack,
    Text,
    useDisclosure,
    useEditableControls,
    VStack
} from "@chakra-ui/react";
import Header from "../shared/Header.jsx";
import Player from "../player/Player.jsx";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {MyInput} from "../shared/Inputs.jsx";
import {CheckIcon, CloseIcon, EditIcon} from "@chakra-ui/icons";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";

const UserProfile = () => {

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const {isOpen, onOpen, onClose} = useDisclosure()

    const navigate = useNavigate()
    const {logout} = useAuth()

    const fetchProfile = () => {
        setIsLoading(true)
        getProfile().then(res => {
            console.log(res.data)
            setUser(res.data)
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

    const doChangeName = () => {
        if (user && user.name.length >= 2 && user.name.length <= 255) {
            changeMyName(user.name).then(() => {
                fetchProfile()
                successNotification(
                    "Success",
                    "Name changed"
                )
            }).catch(err => {
                console.log(err)
                errorNotification(
                    err.code,
                    err.response?.data?.message
                )
            })
        } else {
            errorNotification(
                "Invalid name",
                "Name length must be between 2 and 255 characters"
            )
        }
    }

    useEffect(() => {
        fetchProfile()
    }, []);

    function EditableControls() {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls()

        return isEditing ? (
            <ButtonGroup justifyContent='center' size='sm'>
                <IconButton icon={<CheckIcon/>} {...getSubmitButtonProps()} onClick={doChangeName}/>
                <IconButton icon={<CloseIcon/>} {...getCancelButtonProps()} />
            </ButtonGroup>
        ) : (
            <Flex justifyContent='center'>
                <IconButton size='sm' icon={<EditIcon/>} {...getEditButtonProps()} />
            </Flex>
        )
    }

    const logOut = () => {
        logout()
        navigate('/login')
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent bg={'gray.700'} color={'white'}>
                    <ModalHeader>Change Password</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
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
                                changeMyPassword(data.password).then(() => {
                                    onClose()
                                    successNotification(
                                        "Success",
                                        "Password changed"
                                    )
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
                color={'white'}
                templateRows={'70px 1fr'}
                templateColumns={'1fr'}
                gap={'8px 0'}
                h={'100%'}
            >
                <Header/>
                <GridItem
                    borderRadius={'5px'}
                    p={'20px'}
                    bg={'gray.700'}
                >
                    {
                        isLoading
                            ? <Center
                                h={'100%'}
                                w={'100%'}
                            >
                                <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='blue.500'
                                    size='xl'
                                />
                            </Center>
                            :

                            <VStack
                                alignItems={'center'}
                            >
                                <Avatar size={'xl'}/>
                                {
                                    user?.authProvider === 'INTERNAL'
                                        ? <Editable
                                            textAlign='center'
                                            defaultValue={user?.name}
                                            fontSize='2xl'
                                            isPreviewFocusable={false}
                                            value={user?.name}
                                            onChange={val => setUser({...user, name: val})}
                                        >
                                            <HStack>
                                                <Input as={EditableInput}/>
                                                <EditablePreview/>
                                                <EditableControls/>
                                            </HStack>
                                        </Editable>
                                        : <Heading fontSize={'2xl'}>{user?.name}</Heading>
                                }

                                <Text>{user?.email}</Text>
                                {
                                    user?.authProvider === 'INTERNAL'
                                        ? <Button
                                            onClick={onOpen}
                                        >
                                            Change Password
                                        </Button>
                                        : null
                                }
                                <Button
                                    onClick={logOut}
                                    colorScheme={'red'}
                                >
                                    Log Out
                                </Button>
                            </VStack>
                    }
                </GridItem>
            </Grid>
        </>
    )
}

export default UserProfile