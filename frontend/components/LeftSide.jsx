import PlaylistList from "./playlist/PlaylistList.jsx";
import DelimiterWithText from "./DelimiterWithText.jsx";
import SectionList from "./SectionList.jsx";
import {Button, GridItem, Heading, useDisclosure} from "@chakra-ui/react";
import AddContentButton from "./shared/AddContentButton.jsx";
import '../src/App.css'
import AddSongModalContent from "./AddSongModalContent.jsx";
import CreatePlaylistModal from "./playlist/CreatePlaylistModal.jsx";
import {AddIcon} from "@chakra-ui/icons";
import {getPlaylists} from "../services/client.js";
import {setPlaylists} from "../store/userSlice.js";
import {errorNotification} from "../services/notification.js";
import {useDispatch} from "react-redux";
import {useAuth} from "../context/AuthContext.jsx";

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

const AddButton = ({onOpen, title}) => {
    return (
        <Button
            display={'grid'}
            p={'10px'}
            w={'100%'}
            h={'64px'}
            gridTemplateRows={'1fr'}
            gridTemplateColumns={'44px 1fr'}
            gap={'0 20px'}
            bg={'none'}
            borderRadius={'5px'}
            _hover={{bg: '#4A5568'}}
            transition={'background-color 0.2s ease-in-out'}
            color={'white'}
            mb={'10px'}
            onClick={onOpen}
        >
            <GridItem>
                <AddIcon/>
            </GridItem>

            <GridItem>
                <Heading mb={'3px'} size={'md'} textAlign={'start'}>
                    {title}
                </Heading>
            </GridItem>
        </Button>
    )
}

const LeftSide = () => {

    const {isAdmin} = useAuth()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const dispatch = useDispatch()

    const fetchPlaylists = () => {
        getPlaylists().then(res => {
            dispatch(setPlaylists(res.data))
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response.data.message
            )
        })
    }

    const onCreateSuccess = () => {
        fetchPlaylists()
        onClose()
    }

    return (
        <GridItem borderRadius={'5px'} p={'20px'} bg={'gray.700'}>
            {
                isAdmin()
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
                            <AddButton
                                title={'Create Playlist'}
                                onOpen={onOpen}
                            />
                            <CreatePlaylistModal
                                onSuccess={onCreateSuccess}
                                onClose={onClose}
                                isOpen={isOpen}
                            />
                            <PlaylistList/>
                        </>
                    )
            }
        </GridItem>
    )
}

export default LeftSide