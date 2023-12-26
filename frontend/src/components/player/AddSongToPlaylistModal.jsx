import {
    Button, Grid,
    GridItem, Heading,
    Img,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay, Text
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {errorNotification, successNotification} from "../../services/notification.js";
import {addSongToPlaylist, getPlaylists, removeSongFromPlaylist} from "../../services/client.js";
import {API_BASE_URL} from "../../constants/client.js";

const AddSongToPlaylistModal = ({song, isOpen, onClose}) => {

    const [playlists, setPlaylists] = useState([])

    const fetchPlaylists = () => {
        getPlaylists(song.id).then(res => {
            setPlaylists(res.data)
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response.data.message
            )
        })
    }

    useEffect(() => {
        fetchPlaylists()
    }, [])

    const doAddSongToPlaylist = (playlistId) => {
        addSongToPlaylist(playlistId, song.id).then(() => {
            fetchPlaylists()
            successNotification(
                "Success",
                "Song added to playlist"
            )
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response.data.message
            )
        })
    }

    const doRemoveSongFromPlaylist = (playlistId) => {
        removeSongFromPlaylist(playlistId, song.id).then(() => {
            fetchPlaylists()
            successNotification(
                "Success",
                "Song removed from playlist"
            )
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response.data.message
            )
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent bg={'gray.700'} color={'white'}>
                <ModalHeader>Add song to playlists</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    {playlists.map((playlist, index) => (
                        <Grid
                            key={index}
                            display={'grid'}
                            p={'10px'}
                            w={'100%'}
                            h={'64px'}
                            templateRows={'1fr'}
                            templateColumns={'44px 1fr 44px'}
                            alignItems={'center'}
                            bg={'none'}
                            gap={'0 20px'}
                            borderRadius={'5px'}
                            _hover={{bg: 'none'}}
                            color={'white'}
                        >
                            <GridItem>
                                <Img src={playlist.isLikedSongsPlaylist ? '/playlist/liked-songs-playlist-preview.png' : `${API_BASE_URL}/images/${playlist.previewId}`} borderRadius={'5px'}/>
                            </GridItem>

                            <GridItem
                                display={'flex'}
                                flexDirection={'column'}
                                alignItems={'start'}
                            >
                                <Heading mb={'3px'} size={'sm'}>
                                    {playlist.name}
                                </Heading>
                                <Text fontSize={'12px'} color={'gray.400'}>
                                    {playlist.totalSongs} songs
                                </Text>
                            </GridItem>
                            <GridItem>
                                <Button
                                    colorScheme={playlist.containsRelatedSong ? 'red' : 'green'}
                                    color={'white'}
                                    onClick={() => playlist.containsRelatedSong
                                        ? doRemoveSongFromPlaylist(playlist.id)
                                        : doAddSongToPlaylist(playlist.id)
                                    }
                                >
                                    {playlist.containsRelatedSong ? '-' : '+'}
                                </Button>
                            </GridItem>
                        </Grid>
                    ))}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default AddSongToPlaylistModal