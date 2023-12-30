import PlaylistList from "../playlist/PlaylistList.jsx";
import DelimiterWithText from "./DelimiterWithText.jsx";
import SectionList from "./SectionList.jsx";
import {Button, Grid, GridItem, Heading, useDisclosure, VStack} from "@chakra-ui/react";
import '../../App.css'
import CreatePlaylistModal from "../playlist/CreatePlaylistModal.jsx";
import {AddIcon} from "@chakra-ui/icons";
import {getPlaylists} from "../../services/client.js";
import {setPlaylists} from "../../store/userSlice.js";
import {errorNotification} from "../../services/notification.js";
import {useDispatch} from "react-redux";
import {useAuth} from "../../context/AuthContext.jsx";
import AddSongModal from "../admin/AddSongModal.jsx";
import {css} from "../../style/scroll.js";

const commonsSections = [
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
        name: 'Users',
        imageUrl: 'https://picsum.photos/400',
        onClick: '/admin/users'
    }
]

const AddButton = ({onOpen, title}) => {
    return (
        <Grid
            p={'10px'}
            w={'100%'}
            h={'64px'}
            templateRows={'44px'}
            templateColumns={'44px 1fr'}
            alignItems={'center'}
            gap={'0 20px'}
            bg={'none'}
            borderRadius={'5px'}
            _hover={{bg: '#4A5568'}}
            transition={'background-color 0.2s ease-in-out'}
            color={'white'}
            onClick={onOpen}
            cursor={'pointer'}
        >
            <GridItem
                display={'flex'}
                justifyContent={'center'}
            >
                <AddIcon/>
            </GridItem>

            <GridItem>
                <Heading mb={'3px'} size={'md'} textAlign={'start'}>
                    {title}
                </Heading>
            </GridItem>
        </Grid>
    )
}

const LeftSide = () => {

    const {isAdmin} = useAuth()
    const {isOpen: isAddSongModalOpen, onOpen: onAddSongModalOpen, onClose: onAddSongModalClose} = useDisclosure()
    const {
        isOpen: isCreatePlaylistModalOpen,
        onOpen: onCreatePlaylistModalOpen,
        onClose: onCreatePlaylistModalClose
    } = useDisclosure()
    const dispatch = useDispatch()

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

    const onCreatePlaylistSuccess = () => {
        fetchPlaylists()
        onCreatePlaylistModalClose()
    }

    const onAddSongSuccess = () => {
        onAddSongModalClose()
    }

    return (
        <>
            <AddSongModal
                isOpen={isAddSongModalOpen}
                onClose={onAddSongModalClose}
                onSuccess={onAddSongSuccess}
            />
            <CreatePlaylistModal
                onSuccess={onCreatePlaylistSuccess}
                onClose={onCreatePlaylistModalClose}
                isOpen={isCreatePlaylistModalOpen}
            />
            <GridItem borderRadius={'5px'} p={'20px'} bg={'gray.700'}>
                <VStack
                    overflowY={'auto'}
                    maxH={'calc(100vh - 250px)'}
                    paddingRight={'5px'}
                    css={css}
                    w={'100%'}
                >
                    {
                        isAdmin()
                            ? (
                                <>
                                    <SectionList
                                        sections={[...commonsSections, ...adminSections]}
                                    />
                                    <AddButton
                                        title={'Add Song'}
                                        onOpen={onAddSongModalOpen}
                                    />
                                    <AddButton
                                        title={'Create Playlist'}
                                        onOpen={onCreatePlaylistModalOpen}
                                    />
                                    <PlaylistList/>
                                </>
                            )
                            : (
                                <>
                                    <SectionList
                                        sections={commonsSections}
                                    />
                                    <AddButton
                                        title={'Create Playlist'}
                                        onOpen={onCreatePlaylistModalOpen}
                                    />
                                    <PlaylistList/>
                                </>
                            )
                    }
                </VStack>
            </GridItem>
        </>
    )
}

export default LeftSide