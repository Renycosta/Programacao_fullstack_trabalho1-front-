import { StrictMode } from "react"

import { createRoot } from "react-dom/client"

import "./index.css"

import App from "./App.tsx"

import Login from "./Login.tsx"

import Detalhes from "./Detalhes.tsx"

import CadUsuario from "./CadUsuario.tsx"

import Layout from "./Layout.tsx"

import Carrinho from "./Carrinho.tsx"

import Vender from "./Vender"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

const rotas = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <App />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "detalhes/:produtoId",
                element: <Detalhes />
            },
            {
                path: "cadUsuario",
                element: <CadUsuario />
            },
            {
                path: "carrinho",
                element: <Carrinho />
            },
            {
                path: "vender",
                element: <Vender />
            }
        ],
    },
])

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={rotas} />
    </StrictMode>
)