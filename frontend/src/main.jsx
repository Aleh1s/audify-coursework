import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {Center, ChakraProvider, createStandaloneToast} from "@chakra-ui/react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Main from "./pages/Main.jsx";
import CategoryList from "./components/category/CategoryList.jsx";
import SongView from "./components/song/SongView.jsx";
import GlobalPlaylist from "./components/shared/GlobalPlaylist.jsx";
import Category from "./components/category/Category.jsx";
import PlaylistView from "./components/playlist/PlaylistView.jsx";
import AdminUsers from "./components/admin/AdminUsers.jsx";
import {Provider} from "react-redux";
import store from "./store/store.js";
import ProtectedRoute from "./components/security/ProtectedRoute.jsx";
import SignIn from "./pages/SignIn.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import RedirectHandler from "./components/oauth2/RedirectHandler.jsx";
import SignUp from "./pages/SignUp.jsx";
import AdminRoute from "./components/security/AdminRoute.jsx";
import UserProfile from "./components/user/UserProfile.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const {ToastContainer} = createStandaloneToast();
const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute><Main/></ProtectedRoute>,
        children: [
            {
                path: '/',
                element: <GlobalPlaylist/>,
            },
            {
                path: '/categories',
                element: <CategoryList/>,
            },
            {
                path: '/song/:songId',
                element: <SongView/>,
            },
            {
                path: '/category/:categoryId',
                element: <Category/>,
            },
            {
                path: '/playlist/:playlistId',
                element: <PlaylistView/>,
            },
            {
                path: '/admin/users',
                element: <AdminRoute><AdminUsers/></AdminRoute>
            }
        ]
    },
    {
        path: '/login',
        element: <SignIn/>
    },
    {
        path: "/oauth2/redirect",
        element: <RedirectHandler/>
    },
    {
        path: '/registration',
        element: <SignUp/>
    },
    {
        path: '/profile',
        element: <ProtectedRoute><UserProfile/></ProtectedRoute>
    },
    {
        path: '*',
        element: <NotFoundPage/>
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <ChakraProvider>
                <AuthProvider>
                    <RouterProvider router={router}/>
                </AuthProvider>
                <ToastContainer/>
            </ChakraProvider>
        </Provider>
    </React.StrictMode>,
)