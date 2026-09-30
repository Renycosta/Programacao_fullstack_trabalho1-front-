import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const apiUrl = import.meta.env.VITE_API_URL

type Usuario = {
    IdUsuario: number
    Nome: string
    Email: string
    Telefone?: string
}

type Produto = {
    IdProduto: number
    Nome: string
    Autor: string
    Valor: number | string
    Img?: string
}

export default function Admin() {
    const navigate = useNavigate()

    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const adminKey = localStorage.getItem("adminKey")

        if (!adminKey) {
            toast.error("Acesso restrito aos administradores.")
            navigate("/login")
            return
        }

        buscarDados()
    }, [])

    async function buscarDados() {
        try {
            setCarregando(true)

            const [responseUsuarios, responseProdutos] = await Promise.all([
                fetch(`${apiUrl}/usuarios`),
                fetch(`${apiUrl}/produtos`)
            ])

            if (!responseUsuarios.ok || !responseProdutos.ok) {
                toast.error("Erro ao carregar dados.")
                return
            }

            const dadosUsuarios = await responseUsuarios.json()
            const dadosProdutos = await responseProdutos.json()

            setUsuarios(dadosUsuarios)
            setProdutos(dadosProdutos)

        } catch (error) {
            console.error("Erro ao buscar dados:", error)
            toast.error("Não foi possível carregar os dados.")
        } finally {
            setCarregando(false)
        }
    }

    async function excluirUsuario(id: number) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este usuário?"
        )

        if (!confirmar) {
            return
        }

        try {
            const response = await fetch(`${apiUrl}/usuarios/${id}`, {
                method: "DELETE"
            })

            const dados = await response.json()

            if (!response.ok) {
                toast.error(
                    typeof dados.erro === "string"
                        ? dados.erro
                        : "Não foi possível excluir o usuário."
                )
                return
            }

            setUsuarios((usuariosAtuais) =>
                usuariosAtuais.filter(
                    (usuario) => usuario.IdUsuario !== id
                )
            )

            toast.success("Usuário excluído com sucesso!")

        } catch (error) {
            console.error("Erro ao excluir usuário:", error)
            toast.error("Não foi possível excluir o usuário.")
        }
    }

    async function excluirProduto(id: number) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este livro?"
        )

        if (!confirmar) {
            return
        }

        try {
            const response = await fetch(`${apiUrl}/produtos/${id}`, {
                method: "DELETE"
            })

            const dados = await response.json()

            if (!response.ok) {
                toast.error(
                    typeof dados.erro === "string"
                        ? dados.erro
                        : "Não foi possível excluir o livro."
                )
                return
            }

            setProdutos((produtosAtuais) =>
                produtosAtuais.filter(
                    (produto) => produto.IdProduto !== id
                )
            )

            toast.success("Livro excluído com sucesso!")

        } catch (error) {
            console.error("Erro ao excluir livro:", error)
            toast.error("Não foi possível excluir o livro.")
        }
    }

    function sairAdmin() {
        localStorage.removeItem("adminKey")
        navigate("/login")
    }

    if (carregando) {
        return (
            <div className="min-h-screen bg-stone-950 flex items-center justify-center">
                <p className="text-stone-400">
                    Carregando painel administrativo...
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-stone-950 text-stone-100">

            {/* Cabeçalho */}
            <header className="border-b border-stone-800 bg-stone-900">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-amber-100">
                            Painel administrativo
                        </h1>

                        <p className="text-sm text-stone-400 mt-1">
                            Gerencie usuários e livros da loja.
                        </p>
                    </div>

                    <button
                        onClick={sairAdmin}
                        className="px-4 py-2 rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-800 transition-colors"
                    >
                        Sair
                    </button>

                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Usuários */}
                <section className="mb-10">

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-stone-100">
                                Usuários
                            </h2>

                            <p className="text-sm text-stone-500">
                                {usuarios.length} usuário(s) cadastrado(s)
                            </p>
                        </div>
                    </div>

                    <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">

                        {usuarios.length === 0 ? (
                            <div className="p-8 text-center text-stone-500">
                                Nenhum usuário cadastrado.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">

                                <table className="w-full text-sm text-left">

                                    <thead className="bg-stone-950 text-stone-400">
                                        <tr>
                                            <th className="px-5 py-4">
                                                ID
                                            </th>

                                            <th className="px-5 py-4">
                                                Nome
                                            </th>

                                            <th className="px-5 py-4">
                                                E-mail
                                            </th>

                                            <th className="px-5 py-4 text-right">
                                                Ação
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {usuarios.map((usuario) => (
                                            <tr
                                                key={usuario.IdUsuario}
                                                className="border-t border-stone-800 hover:bg-stone-800/50"
                                            >
                                                <td className="px-5 py-4 text-stone-500">
                                                    {usuario.IdUsuario}
                                                </td>

                                                <td className="px-5 py-4 font-medium text-stone-200">
                                                    {usuario.Nome}
                                                </td>

                                                <td className="px-5 py-4 text-stone-400">
                                                    {usuario.Email}
                                                </td>

                                                <td className="px-5 py-4 text-right">

                                                    <button
                                                        onClick={() =>
                                                            excluirUsuario(
                                                                usuario.IdUsuario
                                                            )
                                                        }
                                                        className="px-3 py-2 rounded-lg bg-red-950/60 border border-red-900 text-red-400 hover:bg-red-900/60 transition-colors"
                                                    >
                                                        Excluir
                                                    </button>

                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </div>

                </section>

                {/* Livros */}
                <section>

                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-stone-100">
                            Livros
                        </h2>

                        <p className="text-sm text-stone-500">
                            {produtos.length} livro(s) cadastrado(s)
                        </p>
                    </div>

                    {produtos.length === 0 ? (
                        <div className="bg-stone-900 border border-stone-800 rounded-xl p-8 text-center text-stone-500">
                            Nenhum livro cadastrado.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            {produtos.map((produto) => (
                                <div
                                    key={produto.IdProduto}
                                    className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden"
                                >

                                    <div className="h-56 bg-stone-950 flex items-center justify-center">
                                        {produto.Img ? (
                                            <img
                                                src={produto.Img}
                                                alt={`Capa do livro ${produto.Nome}`}
                                                className="h-full w-full object-contain p-4"
                                            />
                                        ) : (
                                            <span className="text-4xl">
                                                📖
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-5">

                                        <p className="text-xs text-stone-500 mb-1">
                                            ID: {produto.IdProduto}
                                        </p>

                                        <h3 className="font-bold text-lg text-amber-100">
                                            {produto.Nome}
                                        </h3>

                                        <p className="text-sm text-stone-400 mt-1">
                                            {produto.Autor}
                                        </p>

                                        <p className="text-lg font-bold text-amber-500 mt-4">
                                            R${" "}
                                            {Number(
                                                produto.Valor
                                            ).toLocaleString("pt-BR", {
                                                minimumFractionDigits: 2
                                            })}
                                        </p>

                                        <button
                                            onClick={() =>
                                                excluirProduto(
                                                    produto.IdProduto
                                                )
                                            }
                                            className="w-full mt-4 px-4 py-2.5 rounded-lg bg-red-950/60 border border-red-900 text-red-400 hover:bg-red-900/60 transition-colors"
                                        >
                                            Excluir livro
                                        </button>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </main>

        </div>
    )
}