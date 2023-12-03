import {Grid, GridItem, Heading, Img, Text} from "@chakra-ui/react";

const SongItem = ({song}) => {
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
        >
            <GridItem>
                <Img src={song.imageUrl} borderRadius={'5px'}/>
            </GridItem>
            <GridItem>
                <Heading size={'md'} >{song.name}</Heading>
                <Text color={'gray.400'} textAlign={'start'}>Singer</Text>
            </GridItem>

            <GridItem>
                <Text textAlign={'center'}>{song.singer}</Text>
            </GridItem>
            <GridItem>
                <Text textAlign={'end'}>{song.duration}</Text>
            </GridItem>
        </Grid>
    )
}

export default SongItem