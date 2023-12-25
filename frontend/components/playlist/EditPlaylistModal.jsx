import {
    Box,
    Button,
    Img,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    VStack
} from "@chakra-ui/react";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {updatePlaylistById} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";
import {FileInput, MyInput} from "../shared/Inputs.jsx";
import {useState} from "react";
import {API_BASE_URL} from "../../constants/client.js";

const EditPlaylistModal = ({ playlist, isOpen, onClose, onSuccess }) => {

    const [preview, setPreview] = useState(null)

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
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
                            src={preview ? preview : `${API_BASE_URL}/images/${playlist.previewId}`}
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
                        name: playlist.name,
                    }} validationSchema={Yup.object({
                        preview: Yup.mixed()
                            .nullable()
                            .test('fileSize', 'File size must be less than 10MB', (value) => {
                                if (!value) {
                                    return true
                                }
                                return value.size <= 10 * 1024 * 1024
                            }),
                        name: Yup.string()
                            .required('Name is required')
                            .min(2, 'Name must be at least 2 characters')
                            .max(50, 'Name must be less than 50 characters')
                    })} onSubmit={(data, {setSubmitting}) => {
                        const updatedPlaylist = {
                            name: data.name,
                        }
                        setSubmitting(true)
                        updatePlaylistById(playlist.id, updatedPlaylist, data.preview).then(() => {
                            onSuccess()
                            successNotification(
                                "Success",
                                `Playlist was updated successfully`
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
                                        Edit
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

export default EditPlaylistModal