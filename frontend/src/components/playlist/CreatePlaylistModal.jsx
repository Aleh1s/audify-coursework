import {
    Box,
    Button,
    Img,
    Modal,
    ModalBody,
    ModalCloseButton, ModalContent,
    ModalHeader,
    ModalOverlay,
    VStack
} from "@chakra-ui/react";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {createPlaylist} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";
import {FileInput, MyInput} from "../shared/Inputs.jsx";
import {useState} from "react";

const CreatePlaylistModal = ({ isOpen, onClose, onSuccess }) => {

    const [preview, setPreview] = useState()

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg={'gray.700'} color={'white'}>
                <ModalHeader>Create Playlist</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        h={'200px'}
                    >
                        <Img
                            src={preview}
                            border={'3px dashed gray'}
                            borderRadius={'10px'}
                            minH={'200px'}
                            minW={'200px'}
                            maxH={'200px'}
                            maxW={'200px'}
                        />
                    </Box>

                    <Formik initialValues={{
                        preview: null,
                        name: '',
                    }} validationSchema={Yup.object({
                        preview: Yup.mixed()
                            .required('Preview is required')
                            .test('fileSize', 'File size must be less than 10MB', (value) => {
                                return value && value.size <= 10 * 1024 * 1024
                            }),
                        name: Yup.string()
                            .required('Name is required')
                            .min(2, 'Name must be at least 2 characters')
                            .max(50, 'Name must be less than 50 characters')
                    })} onSubmit={(data, {setSubmitting}) => {
                        const playlist = {
                            name: data.name,
                        }
                        setSubmitting(true)
                        createPlaylist(playlist, data.preview).then(() => {
                            onSuccess()
                            setPreview(null)
                            successNotification(
                                "Success",
                                `${playlist.name} was created successfully`
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
                    }}>
                        {({isValid, isSubmitting}) => (
                            <Form>
                                <VStack spacing={'20px'}>
                                    <FileInput
                                        label="Preview"
                                        name="preview"
                                        setFile={setPreview}
                                        accept={'.png, .jpg, .jpeg'}
                                        info={'Max file size: 10MB, accepted size: 500x500'}
                                    />

                                    <MyInput
                                        label="Name"
                                        name="name"
                                        type="text"
                                        placeholder="Song name"
                                    />

                                    <Button
                                        colorScheme='green'
                                        w={'100%'}
                                        isDisabled={!isValid || isSubmitting}
                                        type={'submit'}
                                    >
                                        Create
                                    </Button>
                                </VStack>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default CreatePlaylistModal