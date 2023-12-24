import PlaylistList from "./PlaylistList.jsx";
import DelimiterWithText from "./DelimiterWithText.jsx";
import SectionList from "./SectionList.jsx";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    GridItem,
    Img,
    Input,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    VStack
} from "@chakra-ui/react";
import AddContentButton from "./shared/AddContentButton.jsx";
import '../src/App.css'
import AddSongModalContent from "./AddSongModalContent.jsx";

const userSections = [
    {
        name: 'Global Playlist',
        imageUrl: 'https://picsum.photos/100',
        onClick: '/'
    },
    {
        name: 'Categories',
        imageUrl: 'https://picsum.photos/200',
        onClick: '/categories'
    }
]

const adminSections = [
    {
        name: 'Content',
        imageUrl: 'https://picsum.photos/100',
        onClick: '/admin/content'
    },
    {
        name: 'Users',
        imageUrl: 'https://picsum.photos/200',
        onClick: '/admin/users'
    }
]

const LeftSide = () => {

    const isAdmin = true

    return (
        <GridItem borderRadius={'5px'} p={'20px'} bg={'gray.700'}>
            {
                isAdmin
                    ? (
                        <>
                            <SectionList
                                mb={'20px'}
                                sections={adminSections}
                            />
                            <DelimiterWithText
                                color={'white'}
                                textBg={'gray.700'}
                                text={'Control'}
                            />
                            <AddContentButton title={'Add Song'}>
                                <AddSongModalContent/>
                            </AddContentButton>
                        </>
                    )
                    : (
                        <>
                            <SectionList
                                mb={'20px'}
                                sections={userSections}
                            />
                            <DelimiterWithText
                                color={'white'}
                                text={'Playlists'}
                                textBg={'gray.700'}
                            />
                            <AddContentButton title={'Create Playlist'}>
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

                                        <VStack spacing={'20px'}>
                                            <FormControl isRequired>
                                                <FormLabel>Image</FormLabel>
                                                <Input placeholder='Image' type={'file'}/>
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Name</FormLabel>
                                                <Input placeholder='Name'/>
                                            </FormControl>
                                        </VStack>

                                    </ModalBody>

                                    <ModalFooter>
                                        <Button colorScheme='green' w={'100%'}>Create</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </AddContentButton>
                            <PlaylistList/>
                        </>
                    )
            }
        </GridItem>
    )
}

export default LeftSide