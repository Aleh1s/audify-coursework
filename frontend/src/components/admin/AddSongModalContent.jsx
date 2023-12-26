import {
    Alert,
    AlertIcon,
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    Img,
    Input,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    Tag,
    Text,
    VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {CloseIcon} from "@chakra-ui/icons";
import {FieldArray, Form, Formik} from "formik";
import * as Yup from "yup";
import {getCategories, saveSong} from "../../services/client.js";
import {FileInput, MyInput, MySelect, MyTextarea} from "../shared/Inputs.jsx";
import {errorNotification, successNotification} from "../../services/notification.js";

Yup.addMethod(Yup.array, 'unique', function (message, mapper = a => a) {
    return this.test('unique', message, function (list) {
        return list.length === new Set(list.map(mapper)).size;
    });
});

const AddSongModalContent = () => {

    const [tagInput, setTagInput] = useState('')
    const [tagErrorMessage, setTagErrorMessage] = useState('')

    const [categories, setCategories] = useState([])
    const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false)

    const [preview, setPreview] = useState(null)

    const fetchCategories = () => {
        getCategories().then(res => {
            setCategories(res.data)
            setIsCategoriesLoaded(true)
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <ModalContent bg={'gray.700'} color={'white'}>
            <ModalHeader>Add Song</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDirection={'column'}
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
                    audio: null,
                    name: '',
                    artist: '',
                    category: '',
                    text: '',
                    tags: []
                }} validationSchema={Yup.object({
                    preview: Yup.mixed()
                        .required('Preview is required')
                        .test('fileSize', 'File size must be less than 10MB', (value) => {
                            return value && value.size <= 10 * 1024 * 1024
                        }),
                    audio: Yup.mixed()
                        .required('Audio is required')
                        .test('fileSize', 'File size must be less than 10MB', (value) => {
                            return value && value.size <= 10 * 1024 * 1024
                        }),
                    name: Yup.string()
                        .required('Name is required')
                        .min(2, 'Name must be at least 2 characters')
                        .max(50, 'Name must be less than 50 characters'),
                    artist: Yup.string()
                        .required('Artist is required')
                        .min(2, 'Artist must be at least 2 characters')
                        .max(50, 'Artist must be less than 50 characters'),
                    category: Yup.number()
                        .required('Category is required'),
                    text: Yup.string()
                        .required('Text is required')
                        .min(2, 'Text must be at least 2 characters')
                        .max(100_000, 'Text must be less than 100000 characters'),
                    tags: Yup.array().of(
                        Yup.string()
                            .trim()
                            .required('Tag is required')
                            .min(3, 'Tag must be at least 3 characters')
                            .max(20, 'Tag must be less than 20 characters'))
                        .max(20, 'Tags number must be less than 20')
                        .unique('Tag must be unique')

                })} onSubmit={(data, {setSubmitting}) => {
                    const song = {
                        name: data.name,
                        artist: data.artist,
                        categoryId: data.category,
                        tags: data.tags,
                        text: data.text
                    }
                    setSubmitting(true)
                    saveSong(song, data.preview, data.audio)
                        .then(() => successNotification(
                            'Success',
                            `New song was added successfully`
                        ))
                        .catch(err => {
                            console.log(err)
                            errorNotification(
                                err.code,
                                err.response.data.message
                            )
                        })
                        .finally(() => setSubmitting(false))
                }}>
                    {({isValid, isSubmitting, values, errors}) => (
                        <Form>
                            <VStack spacing={'20px'}>
                                <FileInput
                                    label="Preview"
                                    name="preview"
                                    setFile={setPreview}
                                    accept={'.png, .jpg, .jpeg'}
                                    info={'Max file size: 10MB, accepted size: 500x500'}
                                />

                                <FileInput
                                    label="Audio"
                                    name="audio"
                                    accept=".mp3"
                                    info="Max file size: 10MB"
                                />

                                <MyInput
                                    label="Name"
                                    name="name"
                                    type="text"
                                    placeholder="Song name"
                                />

                                <MyInput
                                    label="Artist"
                                    name="artist"
                                    type="text"
                                    placeholder="Artist name"
                                />

                                <MySelect
                                    label="Category"
                                    name="category"
                                    options={categories}
                                />

                                <FieldArray
                                    name={'tags'}
                                    render={(arrayHelpers) => (
                                        <FormControl>
                                            <FormLabel>Tags</FormLabel>
                                            <HStack>
                                                <Input
                                                    placeholder='Tag'
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    value={tagInput}
                                                />
                                                <Button
                                                    colorScheme={'blue'}
                                                    onClick={() => {
                                                        const input = tagInput ? tagInput.trim() : ''
                                                        if (!input || input.length < 3 || input.length > 20) {
                                                            setTagErrorMessage('Tag length must be between 3 and 20 characters')
                                                        } else if (values.tags && values.tags.includes(input)) {
                                                            setTagErrorMessage('Tag already exists')
                                                        } else if (input.includes(' ')) {
                                                            setTagErrorMessage('Tag cannot contain spaces')
                                                        } else {
                                                            arrayHelpers.push(input)
                                                            setTagInput('')
                                                            setTagErrorMessage('')
                                                        }
                                                    }}
                                                >
                                                    +
                                                </Button>
                                            </HStack>
                                            {
                                                tagErrorMessage || errors.tags
                                                    ? <Alert className="error" status={"error"} mt={2}>
                                                        <AlertIcon/>
                                                        {tagErrorMessage || errors.tags}
                                                    </Alert>
                                                    : null
                                            }
                                            <HStack mt={'10px'} wrap={'wrap'}>
                                                {values.tags.map((tag, index) => (
                                                    <Tag key={index}
                                                         display={'flex'}
                                                         alignItems={'center'}
                                                    >
                                                        <Text lineHeight={0}>
                                                            {tag}
                                                        </Text>
                                                        <CloseIcon
                                                            ml={'5px'}
                                                            h={'10px'}
                                                            onClick={() => arrayHelpers.remove(index)}
                                                            cursor={'pointer'}
                                                        />
                                                    </Tag>
                                                ))}
                                            </HStack>
                                        </FormControl>
                                    )}
                                />

                                <MyTextarea
                                    label="Text"
                                    name="text"
                                    type="text"
                                    placeholder="Song's text"
                                />

                                <Button
                                    colorScheme='green'
                                    w={'100%'}
                                    isDisabled={!isCategoriesLoaded || !isValid || isSubmitting}
                                    type={'submit'}
                                >
                                    Add
                                </Button>
                            </VStack>
                        </Form>
                    )}
                </Formik>
            </ModalBody>
        </ModalContent>
    )
}

export default AddSongModalContent