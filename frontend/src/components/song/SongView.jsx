import {Grid, GridItem, Heading, Img, VStack, Text, HStack, Badge, Box} from "@chakra-ui/react";
import {css} from "../../style/scroll.js";
import DelimiterWithText from "../shared/DelimiterWithText.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getSongById} from "../../services/client.js";
import {errorNotification} from "../../services/notification.js";
import {API_BASE_URL} from "../../constants/client.js";

const SongView = () => {

    const params = useParams()
    const [song, setSong] = useState({})

    useEffect(() => {
        if (params.songId) {
            getSongById(params.songId)
                .then(res => setSong(res.data))
                .catch(err => {
                    console.log(err)
                    errorNotification(
                        err.code,
                        err.response?.data?.message
                    )
                })
        }
    }, [])

    return (
        <VStack
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
                    >
                        <Heading size={'xl'}>{song.name}</Heading>
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
    )
}

export default SongView