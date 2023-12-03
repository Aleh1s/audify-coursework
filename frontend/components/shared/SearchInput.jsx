import {Button, Grid, GridItem, Input} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";

const SearchInput = () => {
    return (
        <Grid
            w={'100%'}
            templateRows={'40px'}
            templateColumns={'1fr 40px'}
            gap={'0 10px'}
            marginBottom={'20px'}
        >
            <GridItem>
                <Input
                    type={'text'}
                    placeholder={'Search Query'}
                    w={'100%'}
                    h={'100%'}
                />
            </GridItem>

            <GridItem>
                <Button
                    w={'100%'}
                    h={'100%'}
                >
                    <SearchIcon/>
                </Button>
            </GridItem>
        </Grid>
    )
}

export default SearchInput