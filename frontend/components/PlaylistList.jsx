import {Button, GridItem, Heading, Img, Text, VStack} from "@chakra-ui/react";
import {css} from "../style/scroll.js";

const playlists = [
    {
        name: 'Playlist 1',
        imageUrl: 'https://picsum.photos/300',
        totalSongs: 10
    },
    {
        name: 'Playlist 2',
        imageUrl: 'https://picsum.photos/400',
        totalSongs: 11
    },
    {
        name: 'Playlist 3',
        imageUrl: 'https://picsum.photos/500',
        totalSongs: 12
    },
    {
        name: 'Playlist 4',
        imageUrl: 'https://picsum.photos/600',
        totalSongs: 13
    },
    {
        name: 'Playlist 5',
        imageUrl: 'https://picsum.photos/700',
        totalSongs: 14
    }
]

const Playlist = ({playlist}) => {
    return (
        <Button
            display={'grid'}
            p={'10px'}
            w={'100%'}
            h={'64px'}
            gridTemplateRows={'1fr'}
            gridTemplateColumns={'44px 1fr'}
            bg={'none'}
            gap={'0 20px'}
            borderRadius={'5px'}
            _hover={{bg: '#4A5568'}}
            transition={'background-color 0.2s ease-in-out'}
            color={'white'}
        >
            <GridItem>
                <Img src={playlist.imageUrl} borderRadius={'5px'}/>
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
        </Button>
    )
}

const PlaylistList = () => {
    return (
        <VStack
            overflowY={'auto'}
            maxH={'calc(100vh - 520px)'}
            paddingRight={'5px'}
            css={css}
        >
            {playlists.map((playlist, index) => <Playlist key={index} playlist={playlist}/>)}
        </VStack>
    )
}

export default PlaylistList