import {Button, GridItem, Heading, Img, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

const Section = ({section}) => {

    const navigate = useNavigate()

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
            onClick={() => navigate(section.onClick)}
        >
            <GridItem>
                <Img src={section.imageUrl} borderRadius={'5px'}/>
            </GridItem>

            <GridItem
                display={'flex'}
                alignItems={'center'}
            >
                <Heading mb={'3px'} size={'md'}>
                    {section.name}
                </Heading>
            </GridItem>
        </Button>
    )
}

const SectionList = ({sections, ...props}) => {
    return (
        <VStack
            {...props}
        >
            {sections.map((section, index) => <Section key={index} section={section}/>)}
        </VStack>
    )
}

export default SectionList