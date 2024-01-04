import {Box, Grid, GridItem, Heading, HStack, Img, Text} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {pauseSong, playSong, setCurrentSong} from "../../store/playerSlice.js";
import {API_BASE_URL} from "../../constants/client.js";

const SongItem = ({song, playlist}) => {

    const currentSong = useSelector(state => state.player.currentSong)
    const isSongPlaying = useSelector(state => state.player.isSongPlaying)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const getDurationFromSeconds = (durationInSeconds) => {
        return `${Math.floor(durationInSeconds / 60)}:${durationInSeconds % 60}`
    }

    const renderPlayButton = () => {
        if (currentSong?.song?.id === song.id) {
            if (isSongPlaying) {
                return <Img src={'/player/pause-btn.png'}
                            onClick={() => dispatch(pauseSong())}
                            cursor={'pointer'}
                />
            }
            return <Img src={'/player/play-btn.png'}
                        onClick={() => dispatch(playSong())}
                        cursor={'pointer'}
            />
        }
        return <Img src={'/player/play-btn.png'}
                    onClick={() => dispatch(setCurrentSong({song, playlist}))}
                    cursor={'pointer'}
        />
    }

    return (
        <Grid
            templateRows={'65px'}
            templateColumns={'100px 1fr 1fr 1fr'}
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
                        {renderPlayButton()}
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
        </Grid>
    )
}

export default SongItem