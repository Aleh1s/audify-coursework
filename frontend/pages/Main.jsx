import {Grid, GridItem} from "@chakra-ui/react";
import Header from "../components/Header.jsx";
import LeftSide from "../components/LeftSide.jsx";
import Player from "../components/Player.jsx";
import {Outlet} from "react-router-dom";


const Main = () => {
    return (
        <>
            <Grid
                templateRows={'70px 1fr 100px'}
                templateColumns={'1fr 3fr'}
                gap={'8px'}
                h={'100%'}
            >
                <Header/>
                <LeftSide/>
                <GridItem borderRadius={'5px'} p={'20px'} bg={'gray.700'} color={'white'}>
                    <Outlet/>
                </GridItem>
                <Player/>
            </Grid>
        </>
    )
}

export default Main