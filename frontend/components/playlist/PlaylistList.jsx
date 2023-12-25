import {Button, Center, GridItem, Heading, Img, Spinner, Text, VStack} from "@chakra-ui/react";
import {css} from "../../style/scroll.js";
import {useEffect, useState} from "react";
import {getPlaylists} from "../../services/client.js";
import {errorNotification} from "../../services/notification.js";
import {API_BASE_URL} from "../../constants/client.js";
import {useNavigate} from "react-router-dom";

const Playlist = ({playlist}) => {

    const navigate = useNavigate()

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
            onClick={() => navigate(`/playlist/${playlist.id}`)}
        >
            <GridItem>
                <Img src={`${API_BASE_URL}/images/${playlist.previewId}`} borderRadius={'5px'}/>
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

    const [playlists, setPlaylists] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        getPlaylists().then(res => {
            console.log(res.data)
            setPlaylists(res.data)
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response.data.message
            )
        }).finally(() => {
            setIsLoading(false)
        })
    }, [])

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
                        overflowY={'auto'}
                        maxH={'calc(100vh - 520px)'}
                        paddingRight={'5px'}
                        css={css}
                    >
                        {playlists.map((playlist, index) => <Playlist key={index} playlist={playlist}/>)}
                    </VStack>
            }
        </>
    )
}

export default PlaylistList