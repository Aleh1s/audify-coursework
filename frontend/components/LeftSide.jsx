import PlaylistList from "./playlist/PlaylistList.jsx";
import DelimiterWithText from "./DelimiterWithText.jsx";
import SectionList from "./SectionList.jsx";
import {GridItem} from "@chakra-ui/react";
import AddContentButton from "./shared/AddContentButton.jsx";
import '../src/App.css'
import AddSongModalContent from "./AddSongModalContent.jsx";
import CreatePlaylistModalContent from "./CreatePlaylistModalContent.jsx";

const userSections = [
    {
        name: 'Global Playlist',
        imageUrl: 'https://picsum.photos/100',
        onClick: '/'
    },
    {
        name: 'Categories',
        imageUrl: 'https://picsum.photos/200',
        onClick: '/categories'
    }
]

const adminSections = [
    {
        name: 'Content',
        imageUrl: 'https://picsum.photos/100',
        onClick: '/admin/content'
    },
    {
        name: 'Users',
        imageUrl: 'https://picsum.photos/200',
        onClick: '/admin/users'
    }
]

const LeftSide = () => {

    const isAdmin = false

    return (
        <GridItem borderRadius={'5px'} p={'20px'} bg={'gray.700'}>
            {
                isAdmin
                    ? (
                        <>
                            <SectionList
                                mb={'20px'}
                                sections={adminSections}
                            />
                            <DelimiterWithText
                                color={'white'}
                                textBg={'gray.700'}
                                text={'Control'}
                            />
                            <AddContentButton title={'Add Song'}>
                                <AddSongModalContent/>
                            </AddContentButton>
                        </>
                    )
                    : (
                        <>
                            <SectionList
                                mb={'20px'}
                                sections={userSections}
                            />
                            <DelimiterWithText
                                color={'white'}
                                text={'Playlists'}
                                textBg={'gray.700'}
                            />
                            <AddContentButton title={'Create Playlist'}>
                                <CreatePlaylistModalContent/>
                            </AddContentButton>
                            <PlaylistList/>
                        </>
                    )
            }
        </GridItem>
    )
}

export default LeftSide