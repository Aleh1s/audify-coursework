import {
    Button,
    Grid,
    GridItem,
    Heading,
    HStack,
    Img,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text, useDisclosure,
    VStack
} from "@chakra-ui/react";
import {css} from "../style/scroll.js";
import DelimiterWithText from "./DelimiterWithText.jsx";
import SongItem from "./SongItem.jsx";

const songs = [
    {
        name: 'Song 1',
        singer: 'Singer 1',
        category: 'Category 1',
        duration: '3:06',
        imageUrl: 'https://picsum.photos/300'
    },
    {
        name: 'Song 2',
        singer: 'Singer 2',
        category: 'Category 2',
        duration: '2:32',
        imageUrl: 'https://picsum.photos/400'
    },
    {
        name: 'Song 3',
        singer: 'Singer 3',
        category: 'Category 3',
        duration: '4:12',
        imageUrl: 'https://picsum.photos/500'
    },
    {
        name: 'Song 4',
        singer: 'Singer 4',
        category: 'Category 4',
        duration: '3:06',
        imageUrl: 'https://picsum.photos/600'
    },
    {
        name: 'Song 5',
        singer: 'Singer 5',
        category: 'Category 5',
        duration: '3:06',
        imageUrl: 'https://picsum.photos/700'
    }
]

const PlaylistView = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent bg={'gray.700'} color={'white'}>
                    <ModalHeader>You sure you want to delete playlist?</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        Playlist will be deleted from your library and you won't be able to recover it.
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Delete
                        </Button>
                        <Button colorScheme='green'>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <VStack
                spacing={'20px'}
                overflowY={'auto'}
                maxH={'calc(100vh - 250px)'}
                paddingRight={'10px'}
                css={css}
            >
                <Grid
                    templateRows={'250px'}
                    templateColumns={'250px 1fr'}
                    w={'100%'}
                    gap={'0 30px'}
                >
                    <GridItem>
                        <Img src={'https://picsum.photos/250'} borderRadius={'5px'} h={'250px'}/>
                    </GridItem>
                    <GridItem>
                        <VStack
                            alignItems={'start'}
                            spacing={'10px'}
                        >
                            <HStack
                                justifyContent={'space-between'}
                                w={'100%'}
                            >
                                <Heading size={'xl'}>Liked songs</Heading>
                                <Menu>
                                    {({isOpen}) => (
                                        <>
                                            <MenuButton isActive={isOpen}>
                                                <Img
                                                    src={'/player/three-dots-btn.png'}
                                                    w={'25px'}
                                                    _hover={{cursor: 'pointer'}}
                                                />
                                            </MenuButton>
                                            <MenuList color={'black'}>
                                                <MenuItem>Edit</MenuItem>
                                                <MenuItem onClick={onOpen}>Delete</MenuItem>
                                            </MenuList>
                                        </>
                                    )}
                                </Menu>

                            </HStack>
                            <Text color={'gray.400'}>30 songs | 50m 30s</Text>
                        </VStack>
                    </GridItem>
                </Grid>
                <DelimiterWithText
                    w={'100%'}
                    color={'white'}
                    text={'Songs'}
                    textBg={'gray.700'}
                />
                <VStack
                    w={'100%'}
                    spacing={'20px'}
                >
                    {songs.map((song, index) => <SongItem key={index} song={song}/>)}
                </VStack>
            </VStack>
        </>
    )
}

export default PlaylistView