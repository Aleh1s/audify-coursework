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

const {ToastContainer} = createStandaloneToast();
const router = createBrowserRouter([
    {
        path: '/',
        element: <Main/>,
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
                element: <AdminContent/>,
            },
            {
                path: '/admin/users',
                element: <AdminUsers/>
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider>
            <RouterProvider router={router}/>
            <ToastContainer/>
        </ChakraProvider>
    </React.StrictMode>,
)
