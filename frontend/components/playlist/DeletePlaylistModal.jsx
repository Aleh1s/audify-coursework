import {
    Button, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import {deletePlaylistById} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";

const DeletePlaylistModal = ({ playlist, isOpen, onClose, onSuccess }) => {

    const onDelete = () => {
        deletePlaylistById(playlist.id).then(() => {
            onSuccess()
            successNotification(
                "Success",
                `${playlist.name} was deleted successfully`
            )
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response.data.message
            )
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent bg={'gray.700'} color={'white'}>
                <ModalHeader>You sure you want to delete playlist?</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    Playlist will be deleted from your library and you won't be able to recover it.
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={onDelete}>
                        Delete
                    </Button>
                    <Button colorScheme='green'>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DeletePlaylistModal