import {Box, Heading, HStack, Tooltip} from "@chakra-ui/react";
import {css} from "../style/scroll.js";

const categories = [
    {
        id: 1,
        name: 'Pop',
        bgGradient: 'linear(to-br, #7928CA, #FF0080)'
    },
    {
        id: 2,
        name: 'Rock',
        bgGradient: 'linear(to-br, #7928CA, #FF0080)'
    },
    {
        id: 3,
        name: 'Rap',
        bgGradient: 'linear(to-br, #7928CA, #FF0080)'
    },
    {
        id: 4,
        name: 'Country',
        bgGradient: 'linear(to-br, #7928CA, #FF0080)'
    },
    {
        id: 5,
        name: 'Jazz',
        bgGradient: 'linear(to-br, #7928CA, #FF0080)'
    },
    {
        id: 6,
        name: 'Classical',
        bgGradient: 'linear(to-br, #7928CA, #FF0080)'
    },
    {
        id: 7,
        name: 'Electronic',
        bgGradient: 'linear(to-br, #7928CA, #FF0080)'
    },
    {
        id: 8,
        name: 'Folk',
        bgGradient: 'linear(to-br, #7928CA, #FF0080)'
    },
    {
        id: 9,
        name: 'Hip Hop',
        bgGradient: 'linear(to-br, #7928CA, #FF0080)'
    },
    {
        id: 10,
        name: 'Indie',
        bgGradient: 'linear(to-br, #7928CA, #FF0080)'
    },
    {
        id: 11,
        name: 'Metal',
        bgGradient: 'linear(to-br, #7928CA, #FF0080)'
    }
]

const Category = ({category}) => {
    return (
        <Tooltip
            label={category.name}
        >
            <Box
                _hover={{
                    cursor: 'pointer',
                }}
                w={'190px'}
                h={'190px'}
                bgGradient={category.bgGradient}
                borderRadius={'20px'}
            >
                <Box
                    borderRadius={'20px'}
                    h={'100%'}
                    p={'20px'}
                    bg={'rgba(0, 0, 0, 0.2)'}
                >
                    <Heading size={'lg'}>{category.name}</Heading>
                </Box>
            </Box>
        </Tooltip>
    )
}

const CategoryList = () => {
    return (
        <HStack
            wrap={'wrap'}
            alignItems={'start'}
            justifyContent={'start'}
            spacing={'20px'}
            overflowY={'auto'}
            maxH={'calc(100vh - 250px)'}
            paddingRight={'10px'}
            css={css}
        >
            {categories.map((category, index) => <Category key={index} category={category}/>)}
        </HStack>
    )
}

export default CategoryList