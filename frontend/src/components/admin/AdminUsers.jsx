import SearchInput from "../shared/SearchInput.jsx";
import DelimiterWithText from "../shared/DelimiterWithText.jsx";
import {Center, Heading, Spinner} from "@chakra-ui/react";
import UserItem from "../user/UserItem.jsx";
import {useState} from "react";
import {getUserByEmail} from "../../services/client.js";
import {errorNotification} from "../../services/notification.js";

const AdminUsers = () => {

    const [query, setQuery] = useState('')
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchUser = () => {
        if (query) {
            setIsLoading(true)
            getUserByEmail(query).then(res => {
                console.log(res.data)
                setUser(res.data)
            }).catch(err => {
                console.log(err)
                errorNotification(
                    err.code,
                    err.response?.data?.message
                )
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    return (
        <>
            <SearchInput
                setQuery={setQuery}
                onSearch={fetchUser}
            />

            <DelimiterWithText
                color={'white'}
                textBg={'gray.700'}
                text={'Users'}
            />

            {
                isLoading
                    ? <Center
                        h={'calc(100vh - 350px)'}
                        w={'100%'}
                    >
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                    </Center>
                    : user
                        ? <UserItem
                            user={user}
                            fetchUser={fetchUser}
                        />
                        : <Center>
                            <Heading
                                fontSize={'xl'}
                                color={'gray.500'}
                                mt={'20px'}
                            >
                                Nothing here... Write email to find user
                            </Heading>
                        </Center>
            }
        </>
    )
}

export default AdminUsers