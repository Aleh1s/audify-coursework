import './App.css'
import Main from "../pages/Main.jsx";
import {Container} from "@chakra-ui/react";

function App() {
    return (
        <Container maxW={'100%'} h={'100%'} p={'8px'}>
            <Main/>
        </Container>
    )
}

export default App
