import { Link, useNavigate } from "react-router-dom"
import { useUsuarioStore } from "../context/UsuarioContext"

export default function Titulo() {
    const { usuario, deslogaUsuario } = useUsuarioStore()
    const navigate = useNavigate()

    function usuarioSair() {

        if (confirm("Confirma saída do sistema?")) {
            deslogaUsuario()
            if (localStorage.getItem("usuarioKey")) {
                localStorage.removeItem("usuarioKey")
            }
            navigate("/login")
        }
    }

    return (
        <nav className="border-b border-stone-800 bg-stone-950 backdrop-blur-md sticky top-0 z-50 shadow-xl">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/80 group-hover:border-amber-600 transition-colors shadow-inner">
                        <span className="text-xl"><img src="src/assets/logo.png" alt="" /></span>
                    </div>
                    <span className="self-center text-2xl font-bold tracking-tight text-amber-100 group-hover:text-amber-200 transition-colors">
                        Livraria Gato preto
                    </span>
                </Link>

                <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-stone-400 rounded-lg md:hidden hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-700 transition-colors" aria-controls="navbar-solid-bg" aria-expanded="false">
                    <span className="sr-only">Abrir menu principal</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>

                <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                    <ul className="flex flex-col md:flex-row md:items-center font-medium mt-4 md:mt-0 p-4 md:p-0 rounded-xl bg-stone-900/90 md:bg-transparent border border-stone-800/80 md:border-0 md:space-x-6 rtl:space-x-reverse shadow-lg md:shadow-none">
                        <li>
                            <Link to="/" className="block py-2.5 px-3 md:py-2 md:px-0 text-stone-300 rounded-lg hover:bg-stone-800 md:hover:bg-transparent md:hover:text-amber-400 transition-colors">
                                Livros
                            </Link>
                        </li>

                        <li className="pt-3 md:pt-0 mt-2 md:mt-0 border-t border-stone-800/80 md:border-t-0 flex flex-col md:flex-row md:items-center md:space-x-4 rtl:space-x-reverse">
                            {usuario.IdUsuario ? (
                                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                                    
                                    <Link to="/vender" className="block py-2.5 px-3 md:py-2 md:px-0 text-stone-300 rounded-lg hover:bg-stone-800 md:hover:bg-transparent md:hover:text-amber-400 transition-colors">
                                        Vender
                                    </Link>

                                    <Link to="/carrinho" className="block py-2.5 px-3 md:py-2 md:px-0 text-stone-300 rounded-lg hover:bg-stone-800 md:hover:bg-transparent md:hover:text-amber-400 transition-colors">
                                        Carrinho
                                    </Link>

                                    <Link to="/minhasCompras" className="block py-2.5 px-3 md:py-2 md:px-0 text-stone-300 rounded-lg hover:bg-stone-800 md:hover:bg-transparent md:hover:text-amber-400 transition-colors">
                                        Minhas Compras
                                    </Link>

                                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-stone-900/80 border border-stone-800 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-amber-100 font-medium text-sm">
                                            {usuario.Nome}
                                        </span>
                                    </div>

                                    <button onClick={usuarioSair} className="text-left md:text-center text-sm font-medium text-stone-400 hover:text-red-400 transition-colors py-1 md:py-0">
                                        Sair
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="inline-flex items-center justify-center py-2 px-4 text-sm font-medium text-stone-950 bg-amber-500 rounded-lg hover:bg-amber-400 focus:ring-2 focus:ring-amber-600 transition-colors shadow-md">
                                    Identifique-se
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}