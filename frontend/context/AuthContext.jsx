import {
    createContext,
    useContext, useEffect,
    useState
} from 'react'
import {login as performLogin} from "../services/client.js";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext({})

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            const {sub: username, scopes: roles} = jwtDecode(token)
            setUser({
                username,
                roles
            })
        }
    }, [])

    const login = async (loginRequest) => {
        return new Promise((resolve, reject) => {
            performLogin(loginRequest).then(res => {
                const token = res.headers['authorization']

                localStorage.setItem("access_token", token)
                const {sub: username, scopes: roles} = jwtDecode(token)

                setUser({
                    username,
                    roles
                })

                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    const loginUsingToken = async (token) => {
        return new Promise((resolve) => {
            localStorage.setItem("access_token", token)
            const {sub: username, scopes: roles} = jwtDecode(token)

            setUser({
                username,
                roles
            })

            resolve(token)
        })
    }

    const logout = () => {
        if (localStorage.getItem("access_token")) {
            localStorage.removeItem("access_token")
        }
        setUser(null)
    }

    const isAuthenticated = () => {
        const token = localStorage.getItem('access_token')
        if (!token) {
            return false
        }

        const { exp: expiration } = jwtDecode(token)

        if (Date.now() > expiration * 1000) {
            logout()
            return false
        }

        return true
    }

    const isAdmin = () => {
        return user && user.roles.includes("ROLE_ADMIN")
    }

    return (
        <AuthContext.Provider value={{user, login, logout, isAuthenticated, loginUsingToken, isAdmin}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)

export default AuthProvider