import {Center, Grid, GridItem, Heading, Img, Spinner, VStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {getPlaylists} from "../../services/client.js";
import {errorNotification} from "../../services/notification.js";
import {API_BASE_URL} from "../../constants/client.js";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setLikedSongsPlaylistId, setPlaylists} from "../../store/userSlice.js";

const Playlist = ({playlist}) => {

    const navigate = useNavigate()

    return (
        <Grid
            p={'10px'}
            w={'100%'}
            h={'64px'}
            templateRows={'1fr'}
            templateColumns={'44px 1fr'}
            bg={'none'}
            gap={'0 20px'}
            borderRadius={'5px'}
            _hover={{bg: '#4A5568'}}
            transition={'background-color 0.2s ease-in-out'}
            color={'white'}
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            cursor={'pointer'}
        >
            <GridItem>
                <Img src={playlist.isLikedSongsPlaylist ? '/playlist/liked-songs-playlist-preview.png' : `${API_BASE_URL}/images/${playlist.previewId}`} borderRadius={'5px'}/>
            </GridItem>

            <GridItem
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
            >
                <Heading mb={'3px'} size={'sm'}>
                    {playlist.name}
                </Heading>
            </GridItem>
        </Grid>
    )
}

const PlaylistList = () => {

    const [isLoading, setIsLoading] = useState(false)
    const playlists = useSelector(state => state.user.playlists)
    const dispatch = useDispatch()

    useEffect(() => {
        setIsLoading(true)
        getPlaylists().then(res => {
            dispatch(setPlaylists(res.data))
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response?.data?.message
            )
        }).finally(() => {
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        playlists.filter(playlist => playlist.isLikedSongsPlaylist)
            .forEach(playlist => dispatch(setLikedSongsPlaylistId(playlist.id)))
    }, [playlists]);

    return (
        <>
            {
                isLoading
                    ? <Center
                        w={'100%'}
                        h={'calc(100vh - 520px)'}
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
                    >
                        {playlists.map((playlist, index) => <Playlist key={index} playlist={playlist}/>)}
                    </VStack>
            }
        </>
    )
}

export default PlaylistList