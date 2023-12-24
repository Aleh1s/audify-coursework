import {Grid, GridItem, Heading, Img, Text} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

const SongItem = ({song}) => {

    const navigate = useNavigate()

    const getDurationFromSeconds = (durationInSeconds) => {
        return `${Math.floor(durationInSeconds / 60)}:${durationInSeconds % 60}`
    }

    return (
        <Grid
            templateRows={'65px'}
            templateColumns={'60px 1fr 1fr 1fr'}
            w={'100%'}
            alignItems={'center'}
            gap={'0 15px'}
            borderRadius={'5px'}
            _hover={{bg: '#4A5568'}}
            transition={'background-color 0.2s ease-in-out'}
            p={'10px'}
            cursor={'pointer'}
            onClick={() => navigate(`/song/${song.id}`)}
        >
            <GridItem>
                <Img src={`http://localhost:8080/api/v1/images/${song.previewId}`} borderRadius={'5px'}/>
            </GridItem>
            <GridItem>
                <Heading size={'md'} >{song.name}</Heading>
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