import {Button, Grid, GridItem, Input} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";

const SearchInput = ({setQuery, onSearch}) => {
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
                    onChange={e => setQuery(e.target.value)}
                />
            </GridItem>

            <GridItem>
                <Button
                    w={'100%'}
                    h={'100%'}
                    onClick={onSearch}
                >
                    <SearchIcon/>
                </Button>
            </GridItem>
        </Grid>
    )
}

export default SearchInput