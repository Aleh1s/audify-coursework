import {Box, Center, Heading, HStack, Spinner, Tooltip} from "@chakra-ui/react";
import {css} from "../../style/scroll.js";
import {useEffect, useState} from "react";
import {getCategories} from "../../services/client.js";
import {errorNotification} from "../../services/notification.js";
import {useNavigate} from "react-router-dom";

const Category = ({category}) => {

    const navigate = useNavigate()

    const getRandomColor = () => {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }

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
                bgGradient={`linear(to-br, ${getRandomColor()}, ${getRandomColor()})`}
                borderRadius={'20px'}
                onClick={() => navigate(`/category/${category.id}`)}
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

    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        getCategories().then(res => {
            setCategories(res.data)
        }).catch(err => {
            console.log(err)
            errorNotification(
                err.code,
                err.response.data.message
            )
        }).finally(() => {
            setIsLoading(false)
        })
    }, [])

    return (
        <>
            {
                isLoading
                    ? <Center
                        h={'calc(100vh - 250px)'}
                    >
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                    </Center>
                    : <HStack
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
            }
        </>
    )
}

export default CategoryList