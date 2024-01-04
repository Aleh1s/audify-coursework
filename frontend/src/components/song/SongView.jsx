import {
    Grid,
    GridItem,
    Heading,
    Img,
    VStack,
    Text,
    HStack,
    Badge,
    Box,
    Button,
    useDisclosure,
    ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Modal, Center, Spinner
} from "@chakra-ui/react";
import {css} from "../../style/scroll.js";
import DelimiterWithText from "../shared/DelimiterWithText.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteSongById, getSongById} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";
import {API_BASE_URL} from "../../constants/client.js";
import {pauseSong, playSong, setCurrentSong} from "../../store/playerSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {DeleteIcon} from "@chakra-ui/icons";
import {useAuth} from "../../context/AuthContext.jsx";

const SongView = () => {

    const params = useParams()
    const [song, setSong] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const currentSong = useSelector(state => state.player.currentSong)
    const isSongPlaying = useSelector(state => state.player.isSongPlaying)
    const {user} = useAuth()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isDeleting, setIsDeleting] = useState(false)
    const {isOpen, onOpen, onClose} = useDisclosure()

    useEffect(() => {
        if (params.songId) {
            setIsLoading(true)
            getSongById(params.songId)
                .then(res => setSong(res.data))
                .catch(err => {
                    console.log(err)
                    errorNotification(
                        err.code,
                        err.response?.data?.message
                    )
                }).finally(() => setIsLoading(false))
        }
    }, [])

    const doDeleteSongById = () => {
        setIsDeleting(true)
        deleteSongById(song.id).then(() => {
            onClose()
            navigate('/')
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

    const renderPlayButton = () => {
        if (currentSong?.song?.id === song.id) {
            if (isSongPlaying) {
                return <Img
                    w={'40px'}
                    src={'/player/pause-btn-1.png'}
                    onClick={() => dispatch(pauseSong())}
                    cursor={'pointer'}
                />
            }
            return <Img
                w={'40px'}
                src={'/player/play-btn-1.png'}
                onClick={() => dispatch(playSong())}
                cursor={'pointer'}
            />
        }
        return <Img
            w={'40px'}
            src={'/player/play-btn-1.png'}
            onClick={() => dispatch(setCurrentSong({song}))}
            cursor={'pointer'}
        />
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
            {
                !song
                    ? <Center
                        h={'100%'}
                    >
                        {
                            isLoading
                                ? <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='blue.500'
                                    size='xl'
                                />
                                : <Text
                                    fontSize={'2xl'}
                                >
                                    Song Not Found
                                </Text>
                        }

                    </Center>
                    : <VStack
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
                                <Img src={`${API_BASE_URL}/images/${song.previewId}`} borderRadius={'5px'} h={'250px'}/>
                            </GridItem>
                            <GridItem>
                                <VStack
                                    alignItems={'start'}
                                    spacing={'10px'}
                                    h={'100%'}
                                >
                                    <HStack
                                        w={'100%'}
                                        justifyContent={'space-between'}
                                    >
                                        <HStack
                                            spacing={'20px'}
                                        >
                                            <Heading size={'xl'}>{song.name}</Heading>
                                            {renderPlayButton()}
                                            {
                                                user?.roles?.includes('ROLE_ADMIN')
                                                    ? <GridItem>
                                                        <Button colorScheme={'red'} onClick={onOpen} isDisabled={isDeleting}>
                                                            <DeleteIcon/>
                                                        </Button>
                                                    </GridItem>
                                                    : null
                                            }
                                        </HStack>
                                        <Button
                                            variant={'outline'}
                                            color={'white'}
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href).then(res => {
                                                    successNotification(
                                                        'Link copied',
                                                        'Link to this song was copied to clipboard'
                                                    )
                                                }).catch(err => {
                                                    console.log(err)
                                                    errorNotification(
                                                        'Error',
                                                        'Failed to copy link to this song'
                                                    )
                                                })
                                            }}
                                        >
                                            Share
                                        </Button>
                                    </HStack>
                                    <Text color={'gray.400'}>{song.category?.name} | {song.artist}</Text>
                                    <HStack wrap={'wrap'}>
                                        {song.tags?.map((value, index) => (<Badge key={index}>{value}</Badge>))}
                                    </HStack>
                                </VStack>
                            </GridItem>
                        </Grid>
                        <DelimiterWithText
                            w={'100%'}
                            color={'white'}
                            text={'Text'}
                            textBg={'gray.700'}
                        />
                        <Box
                            w={'60%'}
                            h={'fit-content'}
                            borderRadius={'10px'}
                            bg={'gray.800'}
                            p={'20px'}
                        >
                            <Text fontSize={'lg'}>{song.text}</Text>
                        </Box>
                    </VStack>
            }

        </>
    )
}

export default SongView