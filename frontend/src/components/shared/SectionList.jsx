import {Button, Grid, GridItem, Heading, Img, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

const Section = ({section}) => {

    const navigate = useNavigate()

    return (
        <Grid
            p={'10px'}
            w={'100%'}
            h={'64px'}
            templateRows={'1fr'}
            templateColumns={'44px 1fr'}
            gap={'0 20px'}
            bg={'none'}
            borderRadius={'5px'}
            _hover={{bg: '#4A5568'}}
            transition={'background-color 0.2s ease-in-out'}
            color={'white'}
            cursor={'pointer'}
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
        </Grid>
    )
}

const SectionList = ({sections, ...props}) => {
    return (
        <VStack
            w={'100%'}
            {...props}
        >
            {sections.map((section, index) => <Section key={index} section={section}/>)}
        </VStack>
    )
}

export default SectionList