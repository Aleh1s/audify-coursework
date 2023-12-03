import {
    Box,
    Grid,
    GridItem,
    Heading,
    HStack,
    Img,
    Slider,
    SliderFilledTrack, SliderThumb,
    SliderTrack,
    Text,
    Tooltip,
    VStack
} from "@chakra-ui/react";
import {useState} from "react";

const Player = () => {

    const [isPlaying, setIsPlaying] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [volume, setVolume] = useState(50)

    return (
        <GridItem colSpan={2} bg={'gray.800'} p={'8px'}>
            <Grid
                w={'100%'}
                h={'100%'}
                templateRows={'1fr'}
                templateColumns={'1fr 1fr 1fr'}
                alignItems={'center'}
            >
                <GridItem>
                    <Grid
                        templateRows={'1fr'}
                        templateColumns={'70px 1fr'}
                        gap={'0 20px'}
                        alignItems={'center'}
                    >
                        <GridItem>
                            <Img src={'https://picsum.photos/100'} borderRadius={'5px'}/>
                        </GridItem>
                        <GridItem>
                            <Heading size={'md'} color={'white'}>Song name</Heading>
                            <Text color={'gray.200'}>Singer</Text>
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem>
                    <VStack
                        spacing={'10px'}
                    >
                        <HStack>
                            <Tooltip label={'Skip backward'}>
                                <Img
                                    src={'/player/skip-forward-btn.png'}
                                    h={'34px'}
                                    transform={'scale(-1, 1)'}
                                    _hover={{cursor: 'pointer'}}
                                />
                            </Tooltip>
                            {
                                isPlaying
                                    ?
                                    <Tooltip label={'Pause'}>
                                        <Img
                                            src={'/player/pause-btn.png'}
                                            h={'34px'}
                                            _hover={{cursor: 'pointer'}}
                                            onClick={() => setIsPlaying(false)}/>
                                    </Tooltip>
                                    :
                                    <Tooltip label={'Play'}>
                                        <Img
                                            src={'/player/play-btn.png'}
                                            h={'34px'}
                                            _hover={{cursor: 'pointer'}}
                                            onClick={() => setIsPlaying(true)}
                                        />
                                    </Tooltip>
                            }
                            <Tooltip label={'Skip forward'}>
                                <Img
                                    src={'/player/skip-forward-btn.png'}
                                    h={'34px'}
                                    _hover={{cursor: 'pointer'}}
                                />
                            </Tooltip>
                        </HStack>
                        <HStack
                            w={'100%'}
                            spacing={'10px'}
                        >
                            <Text color={'gray.200'} fontSize={'12px'}>1:33</Text>
                            <Slider aria-label='slider-ex-4' defaultValue={0}>
                                <SliderTrack bg='gray.700'>
                                    <SliderFilledTrack bg='gray.200'/>
                                </SliderTrack>
                                <SliderThumb boxSize={3}>
                                    <Box/>
                                </SliderThumb>
                            </Slider>
                            <Text color={'gray.200'} fontSize={'12px'}>3:06</Text>
                        </HStack>
                    </VStack>
                </GridItem>
                <GridItem>
                    <HStack
                        justifyContent={'end'}
                        spacing={'20px'}
                    >
                        <Tooltip label={'Sound'}>
                            <Img
                                src={'/player/add-to-playlist-btn.png'}
                                h={'24px'}
                                _hover={{cursor: 'pointer'}}
                            />
                        </Tooltip>
                        {
                            isLiked
                                ? <Tooltip label={'Unlike'}>
                                    <Img
                                        src={'/player/unlike-btn.png'}
                                        h={'24px'}
                                        _hover={{cursor: 'pointer'}}
                                        onClick={() => setIsLiked(false)}
                                    />
                                </Tooltip>
                                : <Tooltip label={'Like'}>
                                    <Img
                                        src={'/player/like-btn.png'}
                                        h={'24px'}
                                        _hover={{cursor: 'pointer'}}
                                        onClick={() => setIsLiked(true)}
                                    />
                                </Tooltip>
                        }

                        <Tooltip label={'Sound'}>
                            <Img
                                src={'/player/sound-btn.png'}
                                h={'24px'}
                            />
                        </Tooltip>
                        <Slider aria-label='slider-ex-4' maxW={'150px'} value={volume} onChange={val => setVolume(val)}>
                            <SliderTrack bg='gray.700'>
                                <SliderFilledTrack bg='gray.200'/>
                            </SliderTrack>
                            <SliderThumb boxSize={3}>
                                <Box/>
                            </SliderThumb>
                        </Slider>
                    </HStack>
                </GridItem>
            </Grid>
        </GridItem>
    )
}

export default Player