import {
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
    ModalFooter,
    ModalHeader,
    Select,
    Tag,
    Text,
    Textarea,
    VStack
} from "@chakra-ui/react";
import {useState} from "react";
import {CloseIcon} from "@chakra-ui/icons";

const AddSongModalContent = () => {

    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')
    const [tagAddErrorMessage, setTagAddErrorMessage] = useState('')

    const handleTagInput = (value) => {
        setTagAddErrorMessage('')
        if (value.length <= 20) {
            setTagInput(value)
        } else {
            setTagAddErrorMessage('Tag length must be less than 20 characters')
        }
        if (value[value.length - 1] === ' ') {
            value = value.trim()
            if (value.length === 0) {
                setTagInput('')
                setTagAddErrorMessage('Tag cannot be empty')
            } else if (tags.length >= 20) {
                setTagAddErrorMessage('Maximum 20 tags allowed')
                setTagInput(value)
            } else if (tags.includes(value)) {
                setTagAddErrorMessage('Tag already exists')
                setTagInput(value)
            } else if (value.length < 3) {
                setTagAddErrorMessage('Tag length must be greater than 2 characters')
                setTagInput(value)
            } else {
                setTags([...tags, value])
                setTagInput('')
            }
        }
    }

    return (
        <ModalContent bg={'gray.700'} color={'white'}>
            <ModalHeader>Add Song</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    h={'200px'}
                >
                    <Img
                        src={'https://via.placeholder.com/200'}
                    />
                </Box>

                <VStack spacing={'20px'}>
                    <FormControl isRequired>
                        <FormLabel>Image</FormLabel>
                        <Input placeholder='Image' type={'file'}/>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input placeholder='Name'/>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Singer</FormLabel>
                        <Input placeholder='Singer'/>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Category</FormLabel>
                        <Select placeholder='Category'>
                            <option value='option1'>Option 1</option>
                            <option value='option2'>Option 2</option>
                            <option value='option3'>Option 3</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Tags</FormLabel>
                        <Input
                            placeholder='Tags'
                            onChange={e => handleTagInput(e.target.value)}
                            value={tagInput}
                        />
                        {tagAddErrorMessage
                            ? <Text color={'red.500'}>{tagAddErrorMessage}</Text>
                            : null
                        }
                        <HStack mt={'10px'} wrap={'wrap'}>
                            {tags.map((tag, index) => (
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
                                        onClick={() => setTags(tags.filter(t => t !== tag))}
                                        cursor={'pointer'}
                                    />
                                </Tag>
                            ))}
                        </HStack>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Text</FormLabel>
                        <Textarea
                            placeholder={'Text'}
                            size='md'
                        />
                    </FormControl>


                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='green' w={'100%'}>Add</Button>
            </ModalFooter>
        </ModalContent>
    )
}

export default AddSongModalContent