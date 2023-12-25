import {
    Center,
    Grid,
    GridItem,
    Heading,
    HStack,
    Img,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {css} from "../../style/scroll.js";
import DelimiterWithText from "../DelimiterWithText.jsx";
import SongItem from "../SongItem.jsx";
import {useEffect, useState} from "react";
import {getPlaylistById, getPlaylists, getSongsByPlaylistId} from "../../services/client.js";
import {useNavigate, useParams} from "react-router-dom";
import {errorNotification} from "../../services/notification.js";
import {API_BASE_URL} from "../../constants/client.js";
import EditPlaylistModal from "./EditPlaylistModal.jsx";
import DeletePlaylistModal from "./DeletePlaylistModal.jsx";
import {setPlaylists} from "../../store/userSlice.js";
import {useDispatch} from "react-redux";

const PlaylistView = () => {

    const limit = 10
    const params = useParams()
    const [playlist, setPlaylist] = useState({})
    const [songs, setSongs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const {isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose} = useDisclosure()
    const {isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose} = useDisclosure()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const fetchSongs = () => {
        if (isLoading && params.playlistId) {
            getSongsByPlaylistId(params.playlistId, page, limit).then(res => {
                setSongs([...songs, ...res.data.content])
                setPage(page + 1)
                setTotalCount(res.data.totalPages)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    const fetchPlaylist = () => {
        if (params.playlistId) {
            getPlaylistById(params.playlistId).then(res => {
                setPlaylist(res.data)
            }).catch(err => {
                console.log(err)
                errorNotification(
                    err.code,
                    err.response.data.message
                )
            })
        }
    }

    useEffect(() => {
        setSongs([])
        setPage(0)
        setTotalCount(0)
        setIsLoading(true)
        fetchPlaylist()
    }, [params.playlistId])

    useEffect(() => {
        fetchSongs()
    }, [isLoading]);

    const handleScroll = ({target}) => {
        console.log('scroll')
        if (target.scrollHeight - (target.scrollTop + target.clientHeight) <= 100
            && songs.length < totalCount) {
            setIsLoading(true)
        }
    }

    const formatDuration = (seconds) => {
        if (seconds) {
            return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
        }
        return '0m 0s'
    }

    const onDeleteSuccess = () => {
        fetchPlaylists()
        navigate('/')
    }

    const fetchPlaylists = () => {
        getPlaylists().then(res => {
            dispatch(setPlaylists(res.data))
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response.data.message
            )
        })
    }

    const onEditSuccess = () => {
        fetchPlaylist()
        fetchPlaylists()
        onEditClose()
    }

    return (
        <>
            <DeletePlaylistModal
                playlist={playlist}
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onSuccess={onDeleteSuccess}
            />
            <EditPlaylistModal
                playlist={playlist}
                onClose={onEditClose}
                isOpen={isEditOpen}
                onSuccess={onEditSuccess}
            />
            <VStack
                spacing={'20px'}
                overflowY={'scroll'}
                maxH={'calc(100vh - 250px)'}
                paddingRight={'10px'}
                css={css}
                onScroll={handleScroll}
            >
                <Grid
                    templateRows={'250px'}
                    templateColumns={'250px 1fr'}
                    w={'100%'}
                    gap={'0 30px'}
                >
                    <GridItem>
                        <Img
                            src={playlist.isLikedSongsPlaylist ? '/playlist/liked-songs-playlist-preview.png' : `${API_BASE_URL}/images/${playlist.previewId}`}
                            borderRadius={'5px'} h={'250px'}/>
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
                                <Heading size={'xl'}>{playlist.name}</Heading>
                                {
                                    !playlist.isLikedSongsPlaylist
                                        ? <Menu>
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
                                                        <MenuItem onClick={onEditOpen}>Edit</MenuItem>
                                                        <MenuItem onClick={onDeleteOpen}>Delete</MenuItem>
                                                    </MenuList>
                                                </>
                                            )}
                                        </Menu>
                                        : null
                                }

                            </HStack>
                            <Text color={'gray.400'}>{playlist.totalSongs} songs
                                | {formatDuration(playlist.totalDurationInSeconds)}</Text>
                        </VStack>
                    </GridItem>
                </Grid>
                <DelimiterWithText
                    w={'100%'}
                    color={'white'}
                    text={'Songs'}
                    textBg={'gray.700'}
                />
                {
                    isLoading && songs.length === 0
                        ? <Center
                            h={'calc(100vh - 350px)'}
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
                        : <VStack
                            w={'100%'}
                            spacing={'20px'}
                        >
                            {songs.map((song, index) => <SongItem key={index} song={song}/>)}
                        </VStack>
                }
            </VStack>
        </>
    )
}

export default PlaylistView