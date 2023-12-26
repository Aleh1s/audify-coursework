import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const AdminRoute = ({ children }) => {
    const {user, isAdmin} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !user.roles.includes("ROLE_ADMIN")) {
            navigate('/')
        }
    }, [user]);

    return isAdmin() ? children : <></>
}

export default AdminRoute