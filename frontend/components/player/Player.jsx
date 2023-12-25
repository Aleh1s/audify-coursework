import {
    Box,
    Grid,
    GridItem,
    Heading,
    HStack,
    Img,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text,
    Tooltip, useDisclosure,
    VStack
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {getSongById} from "../../services/client.js";
import {errorNotification} from "../../services/notification.js";
import {API_BASE_URL} from "../../constants/client.js";
import {formatTime} from "../../utils/utils.js";
import AddSongToPlaylistModal from "./AddSongToPlaylistModal.jsx";

const Player = () => {
    const currentSongId = useSelector(state => state.player.currentSongId)

    const {isOpen, onOpen, onClose} = useDisclosure()

    const [song, setSong] = useState({})
    const audioRef = useRef(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [isLiked, setIsLiked] = useState(false)

    const [currentTime, setCurrentTime] = useState(0)

    const MAX_VOLUME = 100

    useEffect(() => {
        if (currentSongId) {
            getSongById(currentSongId).then(res => {
                setSong(res.data)
            }).catch(err => {
                console.log(err)
                errorNotification(
                    err.code,
                    err.response.data.message
                )
            })
        }
    }, [currentSongId])

    const toggleAudio = () => {
        if (isPlaying) {
            audioRef.current?.pause()
            setIsPlaying(false)
        } else {
            audioRef.current?.play()
            setIsPlaying(true)
        }
    }

    const handleVolume = (value) => {
        if (audioRef.current) {
            audioRef.current.volume = Number(value) / MAX_VOLUME
        }
    }

    const handleTime = (value) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(value) / 100 * audioRef.current.duration
        }
    }

    useEffect(() => {
        if (audioRef.current) {
            const handleTimeUpdate = () => {
                setCurrentTime(audioRef.current.currentTime);
            };

            const handleCanPlay = () => {
                audioRef.current.play();
                setIsPlaying(true);
            };

            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.addEventListener('canplay', handleCanPlay);


            return () => {
                audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current.removeEventListener('canplay', handleCanPlay);
            };
        }
    }, [audioRef.current]);

    return (
        <>
            <AddSongToPlaylistModal song={song} isOpen={isOpen} onClose={onClose}/>
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
                                <Img src={`${API_BASE_URL}/images/${song.previewId}`} borderRadius={'5px'}/>
                            </GridItem>
                            <GridItem>
                                <Heading size={'md'} color={'white'}>{song.name}</Heading>
                                <Text color={'gray.200'}>{song.artist}</Text>
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
                                                onClick={toggleAudio}/>
                                        </Tooltip>
                                        :
                                        <Tooltip label={'Play'}>
                                            <Img
                                                src={'/player/play-btn.png'}
                                                h={'34px'}
                                                _hover={{cursor: 'pointer'}}
                                                onClick={toggleAudio}
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
                                <Text color={'gray.200'}
                                      fontSize={'12px'}>{currentTime ? formatTime(currentTime) : '0:00'}</Text>
                                <Slider
                                    aria-label='slider-ex-4'
                                    defaultValue={0}
                                    min={0}
                                    max={100}
                                    value={audioRef.current ? currentTime / audioRef.current?.duration * 100 : 0}
                                    onChange={handleTime}
                                >
                                    <SliderTrack bg='gray.700'>
                                        <SliderFilledTrack bg='gray.200'/>
                                    </SliderTrack>
                                    <SliderThumb boxSize={3}>
                                        <Box/>
                                    </SliderThumb>
                                </Slider>
                                <Text color={'gray.200'}
                                      fontSize={'12px'}>{audioRef.current ? formatTime(audioRef.current?.duration) : '0:00'}</Text>
                            </HStack>
                        </VStack>
                    </GridItem>
                    <GridItem>
                        <HStack
                            justifyContent={'end'}
                            spacing={'20px'}
                        >
                            <Tooltip label={'Add to playlist'}>
                                <Img
                                    src={'/player/add-to-playlist-btn.png'}
                                    h={'24px'}
                                    _hover={{cursor: 'pointer'}}
                                    onClick={onOpen}
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
                            <Slider
                                aria-label='slider-ex-4'
                                maxW={'150px'}
                                min={0}
                                max={MAX_VOLUME}
                                defaultValue={MAX_VOLUME / 2}
                                onChange={handleVolume}
                            >
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
                {
                    song.id
                        ? <audio ref={audioRef} src={`${API_BASE_URL}/audios/${song.audioId}`} loop/>
                        : null
                }

            </GridItem>
        </>
    )
}

export default Player