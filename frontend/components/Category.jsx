import {VStack} from "@chakra-ui/react";
import {css} from "../style/scroll.js";
import SongItem from "./SongItem.jsx";
import DelimiterWithText from "./DelimiterWithText.jsx";

const songs = [
    {
        name: 'Song 1',
        singer: 'Singer 1',
        category: 'Category 1',
        duration: '3:06',
        imageUrl: 'https://picsum.photos/300'
    },
    {
        name: 'Song 2',
        singer: 'Singer 2',
        category: 'Category 2',
        duration: '2:32',
        imageUrl: 'https://picsum.photos/400'
    },
    {
        name: 'Song 3',
        singer: 'Singer 3',
        category: 'Category 3',
        duration: '4:12',
        imageUrl: 'https://picsum.photos/500'
    },
    {
        name: 'Song 4',
        singer: 'Singer 4',
        category: 'Category 4',
        duration: '3:06',
        imageUrl: 'https://picsum.photos/600'
    },
    {
        name: 'Song 5',
        singer: 'Singer 5',
        category: 'Category 5',
        duration: '3:06',
        imageUrl: 'https://picsum.photos/700'
    }
]

const Category = () => {
    return (
        <>
            <DelimiterWithText
                text={'Category Name'}
                textBg={'gray.700'}
            />
            <VStack
                spacing={'20px'}
                overflowY={'auto'}
                maxH={'calc(100vh - 290px)'}
                paddingRight={'10px'}
                css={css}
            >
                {songs.map((song, index) => <SongItem key={index} song={song}/>)}
            </VStack>
        </>
    )
}

export default Category