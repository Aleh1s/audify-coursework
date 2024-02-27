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
    Tooltip,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    addSongToPlaylist,
    getNextSong,
    getPlaylists, getPreviousSong,
    getSongById,
    removeSongFromPlaylist
} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";
import {API_BASE_URL} from "../../constants/client.js";
import {formatTime} from "../../utils/utils.js";
import AddSongToPlaylistModal from "./AddSongToPlaylistModal.jsx";
import {setPlaylists} from "../../store/userSlice.js";
import {pauseSong, playSong, setCurrentSong} from "../../store/playerSlice.js";

const Player = () => {
    const currentSong = useSelector(state => state.player.currentSong)
    const isSongPlaying = useSelector(state => state.player.isSongPlaying)
    const likedSongsPlaylistId = useSelector(state => state.user.likedSongsPlaylistId)

    const dispatch = useDispatch()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [song, setSong] = useState(null)
    const audioRef = useRef(null)

    const [currentTime, setCurrentTime] = useState(0)

    const MAX_VOLUME = 100

    useEffect(() => {
        if (currentSong?.song) {
            pause()
            getSongById(currentSong.song.id).then(res => {
                setSong(res.data)
            }).catch(err => {
                console.log(err)
                errorNotification(
                    err.code,
                    err.response?.data?.message
                )
            })
        }
    }, [currentSong])

    const play = () => {
        audioRef.current?.play()
    }

    const pause = () => {
        audioRef.current?.pause()
    }

    useEffect(() => {
        isSongPlaying ? play() : pause()
    }, [isSongPlaying])

    const toggleAudio = () => {
        isSongPlaying ? dispatch(pauseSong()) : dispatch(playSong())
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

    const fetchNextSong = () => {
        getNextSong(song.id, currentSong?.playlist?.id).then(res => {
            const song = res.data
            if (song?.id !== currentSong?.song?.id) {
                pause()
                setSong(res.data)
                dispatch(setCurrentSong({...currentSong, song: res.data}))
            }
        }).catch(err => {
            console.error(err)
            errorNotification(
                err.code,
                err.response?.data?.message
            )
        })
    }

    const fetchPreviousSong = () => {
        getPreviousSong(song.id, currentSong?.playlist?.id).then(res => {
            const song = res.data
            if (song?.id !== currentSong?.song?.id) {
                pause()
                setSong(res.data)
                dispatch(setCurrentSong({...currentSong, song: res.data}))
            }
        }).catch(err => {
            console.error(err)
            errorNotification(
                err.code,
                err.response?.data?.message
            )
        })
    }

    useEffect(() => {
        if (audioRef.current) {
            const handleTimeUpdate = () => {
                setCurrentTime(audioRef.current.currentTime);
            };

            const handleCanPlay = () => {
                play()
            };

            const handleEnded = () => {
                fetchNextSong()
            }

            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.addEventListener('canplay', handleCanPlay);
            audioRef.current.addEventListener('ended', handleEnded)

            return () => {
                audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current?.removeEventListener('canplay', handleCanPlay);
                audioRef.current?.removeEventListener('ended', handleEnded)
            };
        }
    }, [song]);

    const fetchPlaylists = () => {
        getPlaylists().then(res => {
            dispatch(setPlaylists(res.data))
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response?.data?.message
            )
        })
    }

    const likeSong = () => {
        if (likedSongsPlaylistId && song) {
            addSongToPlaylist(likedSongsPlaylistId, song.id).then(() => {
                setSong({...song, isLiked: true})
                fetchPlaylists()
                successNotification(
                    "Success",
                    `Song was added to liked songs playlist`
                )
            }).catch(err => {
                console.log(err)
                errorNotification(
                    err.code,
                    err.response?.data?.message
                )
            })
        }
    }

    const unlikeSong = () => {
        if (likedSongsPlaylistId && song) {
            removeSongFromPlaylist(likedSongsPlaylistId, song.id).then(() => {
                setSong({...song, isLiked: false})
                fetchPlaylists()
                successNotification(
                    "Success",
                    `Song was removed from liked songs playlist`
                )
            }).catch(err => {
                console.log(err)
                errorNotification(
                    err.code,
                    err.response?.data?.message
                )
            })
        }
    }

    return (
        <>
            {
                song?.id
                    ? <AddSongToPlaylistModal song={song} isOpen={isOpen} onClose={onClose}/>
                    : null
            }
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
                                {
                                    song
                                        ? <Img src={`${API_BASE_URL}/images/${song.previewId}`} borderRadius={'5px'}/>
                                        : null
                                }
                            </GridItem>
                            <GridItem>
                                <Heading size={'md'} color={'white'}>{song?.name}</Heading>
                                <Text color={'gray.200'}>{song?.artist}</Text>
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
                                        onClick={fetchPreviousSong}
                                    />
                                </Tooltip>
                                {
                                    isSongPlaying
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
                                        onClick={fetchNextSong}
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
                                    onClick={() => {
                                        if (song) {
                                            onOpen()
                                        }
                                    }}
                                />
                            </Tooltip>
                            {
                                song?.isLiked
                                    ? <Tooltip label={'Unlike'}>
                                        <Img
                                            src={'/player/unlike-btn.png'}
                                            h={'24px'}
                                            _hover={{cursor: 'pointer'}}
                                            onClick={unlikeSong}
                                        />
                                    </Tooltip>
                                    : <Tooltip label={'Like'}>
                                        <Img
                                            src={'/player/like-btn.png'}
                                            h={'24px'}
                                            _hover={{cursor: 'pointer'}}
                                            onClick={likeSong}
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
                    song
                        ? <audio ref={audioRef} src={`${API_BASE_URL}/audios/${song.audioId}`}/>
                        : null
                }
            </GridItem>
        </>
    )
}

export default Player