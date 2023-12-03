import {
    Box,
    Button, FormControl, FormLabel, Img, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";

const CreatePlaylistPopup = ({isOpen, onClose}) => {
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
                            src={'https://via.placeholder.com/200'}
                        />
                    </Box>

                    <FormControl mb={'20px'}>
                        <FormLabel>Image</FormLabel>
                        <Input placeholder='Image' type={'file'}/>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input placeholder='Name' />
                    </FormControl>

                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='green' w={'100%'}>Create</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CreatePlaylistPopup