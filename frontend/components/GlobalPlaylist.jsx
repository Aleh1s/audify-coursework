import {Center, Spinner, VStack} from "@chakra-ui/react";
import DelimiterWithText from "./DelimiterWithText.jsx";
import {css} from "../style/scroll.js";
import SongItem from "./SongItem.jsx";
import SearchInput from "./shared/SearchInput.jsx";
import {useEffect, useState} from "react";
import {getSongs} from "../services/client.js";

const GlobalPlaylist = () => {

    const limit = 10

    const [songs, setSongs] = useState([])
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [totalCount, setTotalCount] = useState(0)

    const fetchSongs = () => {
        if (isLoading) {
            getSongs(query, page, limit).then(res => {
                setSongs([...songs, ...res.data.content])
                setPage(page + 1)
                setTotalCount(res.data.totalPages)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    useEffect(() => {
        fetchSongs()
    }, [isLoading]);

    const handleScroll = ({target}) => {
        if (target.scrollHeight - (target.scrollTop + target.clientHeight) <= 100
            && songs.length < totalCount) {
            setIsLoading(true)
        }
    }

    const onSearch = () => {
        setSongs([])
        setPage(0)
        setIsLoading(true)
    }

    return (
        <>
            <SearchInput setQuery={setQuery} onSearch={onSearch}/>

            <DelimiterWithText
                text={'Songs'}
                textBg={'gray.700'}
            />
            {
                isLoading && songs.length === 0
                    ? <Center
                        h={'calc(100vh - 350px)'}
                        w={'100%'}
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
                        spacing={'20px'}
                        overflowY={'auto'}
                        maxH={'calc(100vh - 350px)'}
                        paddingRight={'10px'}
                        css={css}
                        onScroll={handleScroll}
                    >
                        {songs.map((song, index) => <SongItem key={index} song={song}/>)}
                    </VStack>
            }
        </>
    )
}

export default GlobalPlaylist