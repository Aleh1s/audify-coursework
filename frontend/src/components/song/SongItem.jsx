import {
    Box,
    Button,
    Grid,
    GridItem,
    Heading,
    HStack,
    Img,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentSong} from "../../store/playerSlice.js";
import {API_BASE_URL} from "../../constants/client.js";
import {useAuth} from "../../context/AuthContext.jsx";
import {DeleteIcon} from "@chakra-ui/icons";
import {deleteSongById} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";
import {useState} from "react";

const SongItem = ({song, fetchSongs, playlist}) => {

    const currentSong = useSelector(state => state.player.currentSong)
    const {user} = useAuth()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [isDeleting, setIsDeleting] = useState(false)

    const getDurationFromSeconds = (durationInSeconds) => {
        return `${Math.floor(durationInSeconds / 60)}:${durationInSeconds % 60}`
    }

    const doDeleteSongById = () => {
        setIsDeleting(true)
        deleteSongById(song.id).then(() => {
            onClose()
            fetchSongs()
            successNotification(
                "Success",
                "Song deleted"
            )
        }).catch(err => {
            console.error(err)
            errorNotification(
                err.code,
                err.response?.data?.message
            )
        }).finally(() => {
            setIsDeleting(false)
        })
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent bg={'gray.700'} color={'white'}>
                    <ModalHeader>Delete this song?</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Text>You sure you want to delete this song?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme={'red'}
                            mr={3}
                            onClick={doDeleteSongById}
                            isDisabled={isDeleting}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="green"
                            onClick={onClose}
                            isDisabled={isDeleting}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Grid
                templateRows={'65px'}
                templateColumns={`100px 1fr 1fr 1fr ${user?.roles?.includes('ROLE_ADMIN') ? '50px' : ''}`}
                w={'100%'}
                alignItems={'center'}
                gap={'0 15px'}
                borderRadius={'5px'}
                bg={currentSong?.song?.id === song.id ? '#4A5568' : ''}
                _hover={{bg: '#4A5568'}}
                transition={'background-color 0.2s ease-in-out'}
                p={'10px'}
            >
                <GridItem>
                    <HStack>
                        <Box w={'40px'}>
                            {
                                currentSong?.song?.id === song.id
                                    ? <Text textAlign={'center'}>-</Text>
                                    : <Img src={'/player/play-btn.png'}
                                           onClick={() => dispatch(setCurrentSong({song, playlist}))}
                                           cursor={'pointer'}
                                    />
                            }

                        </Box>
                        <Box w={'60px'} h={'60px'}>
                            <Img src={`${API_BASE_URL}/images/${song.previewId}`} borderRadius={'5px'}/>
                        </Box>
                    </HStack>
                </GridItem>
                <GridItem>
                    <Heading
                        size={'md'}
                        onClick={() => navigate(`/song/${song.id}`)}
                        cursor={'pointer'}
                        _hover={{textDecoration: 'underline'}}
                    >

                        {song.name}
                    </Heading>
                    <Text color={'gray.400'} textAlign={'start'}>{song.artist}</Text>
                </GridItem>

                <GridItem>
                    <Text textAlign={'center'}>{song.category.name}</Text>
                </GridItem>
                <GridItem>
                    <Text textAlign={'end'}>{getDurationFromSeconds(song.durationInSeconds)}</Text>
                </GridItem>

                {
                    user?.roles?.includes('ROLE_ADMIN')
                        ? <GridItem>
                            <Button colorScheme={'red'} onClick={onOpen} isDisabled={isDeleting}>
                                <DeleteIcon/>
                            </Button>
                        </GridItem>
                        : null
                }
            </Grid>
        </>
    )
}

export default SongItem