import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {

    const { user, isAuthenticated, logout} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login')
        }
    }, [user])

    return isAuthenticated() ? children : <></>
}

export default ProtectedRoute