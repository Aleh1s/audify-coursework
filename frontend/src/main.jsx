import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {ChakraProvider, createStandaloneToast} from "@chakra-ui/react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Main from "../pages/Main.jsx";
import CategoryList from "../components/CategoryList.jsx";
import SongView from "../components/SongView.jsx";
import GlobalPlaylist from "../components/GlobalPlaylist.jsx";
import Category from "../components/Category.jsx";
import PlaylistView from "../components/playlist/PlaylistView.jsx";
import AdminContent from "../components/AdminContent.jsx";
import AdminUsers from "../components/AdminUsers.jsx";
import {Provider} from "react-redux";
import store from "../store/store.js";
import ProtectedRoute from "../components/security/ProtectedRoute.jsx";
import SignIn from "../components/login/SignIn.jsx";
import AuthProvider from "../context/AuthContext.jsx";
import RedirectHandler from "../components/oauth2/RedirectHandler.jsx";
import SignUp from "../components/registration/SignUp.jsx";
import AdminRoute from "../components/security/AdminRoute.jsx";

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
                path: '/admin/content',
                element: <AdminRoute><AdminContent/></AdminRoute>,
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
