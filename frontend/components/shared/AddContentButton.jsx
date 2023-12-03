import {Button, GridItem, Heading, Modal, ModalOverlay, useDisclosure} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";

const AddContentButton = ({title, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                {children}
            </Modal>
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
        </>
    )
}

export default AddContentButton