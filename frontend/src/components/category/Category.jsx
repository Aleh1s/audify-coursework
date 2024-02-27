import {VStack} from "@chakra-ui/react";
import {css} from "../../style/scroll.js";
import SongItem from "../song/SongItem.jsx";
import DelimiterWithText from "../shared/DelimiterWithText.jsx";
import {useEffect, useState} from "react";
import {getCategories, getSongs} from "../../services/client.js";
import {useParams} from "react-router-dom";
import SearchInput from "../shared/SearchInput.jsx";
import {errorNotification} from "../../services/notification.js";

const Category = () => {

    const params = useParams()
    const limit = 10
    const [songs, setSongs] = useState([])
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [totalCount, setTotalCount] = useState(0)
    const [category, setCategory] = useState({})

    const fetchCategory = () => {
        getCategories().then(res => {
            setCategory(res.data.filter(category => category.id === parseInt(params.categoryId))[0])
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response?.data?.message
            )
        })
    }

    const fetchSongs = () => {
        if (params.categoryId) {
            setIsLoading(true)
            getSongs(query, page, limit, params.categoryId).then(res => {
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
        fetchCategory()
    }, []);

    useEffect(() => {
        if (isLoading) {
            fetchSongs()
        }
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
                text={category?.name}
                textBg={'gray.700'}
            />
            <VStack
                spacing={'20px'}
                overflowY={'auto'}
                maxH={'calc(100vh - 350px)'}
                paddingRight={'10px'}
                css={css}
                onScroll={handleScroll}
            >
                {songs.map((song, index) => <SongItem
                    key={index}
                    song={song}
                />)}
            </VStack>
        </>
    )
}

export default Category