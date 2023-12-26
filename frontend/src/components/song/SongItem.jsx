import {Box, Grid, GridItem, Heading, HStack, Img, Text} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setCurrentSongId} from "../../store/playerSlice.js";
import {API_BASE_URL} from "../../constants/client.js";

const SongItem = ({song}) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const getDurationFromSeconds = (durationInSeconds) => {
        return `${Math.floor(durationInSeconds / 60)}:${durationInSeconds % 60}`
    }

    return (
        <Grid
            templateRows={'65px'}
            templateColumns={'100px 1fr 1fr 1fr'}
            w={'100%'}
            alignItems={'center'}
            gap={'0 15px'}
            borderRadius={'5px'}
            _hover={{bg: '#4A5568'}}
            transition={'background-color 0.2s ease-in-out'}
            p={'10px'}
        >
            <GridItem>
                <HStack>
                    <Box w={'40px'}>
                        <Img src={'/player/play-btn.png'}
                             onClick={() => dispatch(setCurrentSongId(song.id))}
                             cursor={'pointer'}
                        />
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