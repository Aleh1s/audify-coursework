import SearchInput from "../shared/SearchInput.jsx";
import DelimiterWithText from "../shared/DelimiterWithText.jsx";
import {css} from "../../style/scroll.js";
import {VStack} from "@chakra-ui/react";
import UserItem from "./UserItem.jsx";

const users = [
    {
        firstName: 'Alex',
        lastName: 'Smith',
        email: 'alex_smith@gmail.com',
        isBlocked: false,
    },
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john_doe@gmail.com',
        isBlocked: true,
    }
]

const AdminUsers = () => {
    return (
        <>
            <SearchInput/>

            <DelimiterWithText
                color={'white'}
                textBg={'gray.700'}
                text={'Users'}
            />

            <VStack
                spacing={'20px'}
                overflowY={'auto'}
                maxH={'calc(100vh - 350px)'}
                paddingRight={'10px'}
                css={css}
            >
                {users.map((user, index) => <UserItem key={index} user={user}/>)}
            </VStack>
        </>
    )
}

export default AdminUsers