import { CardProduto } from "./components/CardProduto"
import { InputPesquisa } from "./components/InputPesquisa"
import type { ProdutoType } from "./utils/ProdutoType"
import { useEffect, useState } from "react"
import { useUsuarioStore } from "./context/UsuarioContext"

const apiUrl = import.meta.env.VITE_API_URL

export default function App() {
    const [produtos, setProdutos] = useState<ProdutoType[]>([])

    const { logaUsuario } = useUsuarioStore()

    useEffect(() => {

        async function buscaProdutos() {
            try {
                const response = await fetch(`${apiUrl}/produtos`)
                if (!response.ok) {
                    console.error("Erro ao buscar produtos")
                    return
                }
                const dados: ProdutoType[] = await response.json()
                setProdutos(dados)
            } catch (error) {
                console.error("Erro ao buscar produtos:", error)
            }
        }

        buscaProdutos()

        async function buscaUsuario(id: string) {
            try {
                const response = await fetch(`${apiUrl}/usuarios/${id}`)
                if (!response.ok) {
                    console.error("Usuário não encontrado")
                    return
                }
                const dados = await response.json()
                logaUsuario(dados)
            } catch (error) {
                console.error("Erro ao buscar usuário:", error)
            }
        }

        const usuarioKey = localStorage.getItem("usuarioKey")

        if (usuarioKey) {
            buscaUsuario(usuarioKey)
        }

    }, [logaUsuario])

    const listaProdutos = produtos.map(produto => (
        <CardProduto data={produto} key={produto.IdProduto}/>
    ))

    return (
        <>
            <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
                <div className="max-w-7xl w-full mx-auto px-4 py-8 flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 pb-6 border-b border-stone-800/80">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-stone-100 md:text-5xl">
                                Livros{" "}
                                <span className="underline underline-offset-8 decoration-8 decoration-amber-800">
                                    disponíveis
                                </span>
                            </h1>
                            <p className="mt-2 text-sm text-stone-400">
                                Explore nossa seleção de títulos, HQs e edições especiais.
                            </p>
                        </div>
                        
                        <div className="w-full md:w-auto md:min-w-[320px]">
                            <InputPesquisa setProdutos={setProdutos} />
                        </div>
                    </div>

                    {listaProdutos && listaProdutos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {listaProdutos}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-4 bg-stone-900/40 border border-stone-800/80 rounded-2xl text-center">
                            <span className="text-4xl mb-3">🔍</span>
                            <h3 className="text-xl font-semibold text-amber-100 mb-1">Nenhum livro encontrado</h3>
                            <p className="text-sm text-stone-400 max-w-sm">
                                Tente buscar por outro termo, autor ou categoria para encontrar o que procura.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>

    )
}